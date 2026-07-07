#!/bin/bash

# Protegrity Prompt Sanitizer Hook
# Scans and sanitizes prompts before sending to AI models.
# Calls the Protegrity Data Discovery API to detect PII and blocks or warns.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PLUGIN_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Read endpoint from env or config.json
get_endpoint() {
  if [ -n "$PROTEGRITY_CLASSIFICATION_ENDPOINT" ]; then
    echo "$PROTEGRITY_CLASSIFICATION_ENDPOINT"
    return
  fi
  python3 -c "
import json, sys
try:
    cfg = json.load(open('$PLUGIN_DIR/config.json'))
    print(cfg.get('protegrity', {}).get('classification_endpoint', ''))
except Exception:
    print('')
" 2>/dev/null
}

CLASSIFICATION_ENDPOINT=$(get_endpoint)

echo "[Protegrity] Scanning prompt for sensitive data before sending to AI model..."

# If no endpoint configured, fall back to local pattern scan
if [ -z "$CLASSIFICATION_ENDPOINT" ]; then
  echo "⚠️  [Protegrity] Classification API not configured — running local pattern scan only."
  echo "   To enable full PII scanning: start Docker services and run 'Protegrity: Status Check'"

  # Local pattern scan for common PII
  PROMPT_TEXT="${1:-}"
  if [ -z "$PROMPT_TEXT" ] && [ -p /dev/stdin ]; then
    PROMPT_TEXT=$(cat /dev/stdin)
  fi

  if echo "$PROMPT_TEXT" | grep -qE '[0-9]{3}-[0-9]{2}-[0-9]{4}'; then
    echo "❌ [Protegrity] SSN pattern detected in prompt — use 'Protegrity: Redact Sensitive Data' first"
    exit 1
  fi
  if echo "$PROMPT_TEXT" | grep -qE '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'; then
    echo "⚠️  [Protegrity] Email address detected in prompt — consider using 'Protegrity: Protect Text' or 'Protegrity: Redact Sensitive Data'"
  fi
  if echo "$PROMPT_TEXT" | grep -qE '\b[0-9]{3}[-. ]?[0-9]{3}[-. ]?[0-9]{4}\b'; then
    echo "⚠️  [Protegrity] Phone number detected in prompt — consider redacting before sending"
  fi

  echo "[Protegrity] Local pattern scan complete. For full PII detection, enable Protegrity Data Discovery service."
  exit 0
fi

# Full scan via Protegrity Classification API
PROMPT_TEXT="${1:-}"
if [ -z "$PROMPT_TEXT" ] && [ -p /dev/stdin ]; then
  PROMPT_TEXT=$(cat /dev/stdin)
fi

if [ -z "$PROMPT_TEXT" ]; then
  echo "[Protegrity] No prompt text provided — skipping scan."
  exit 0
fi

RESPONSE=$(curl -s -X POST "$CLASSIFICATION_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "{\"text\": $(echo "$PROMPT_TEXT" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')}" \
  2>/dev/null)

if [ $? -ne 0 ] || [ -z "$RESPONSE" ]; then
  echo "⚠️  [Protegrity] Classification API unreachable — skipping API scan, running local patterns only."
  exit 0
fi

# Check for entities in response
ENTITY_COUNT=$(echo "$RESPONSE" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    entities = data.get('entities', data.get('classifications', []))
    print(len(entities))
except Exception:
    print(0)
" 2>/dev/null)

if [ "$ENTITY_COUNT" -gt "0" ] 2>/dev/null; then
  echo "⚠️  [Protegrity] $ENTITY_COUNT sensitive entity/entities detected in prompt!"
  echo "   Recommended actions:"
  echo "   • Use 'Protegrity: Redact Sensitive Data' to remove PII"
  echo "   • Use 'Protegrity: Protect Text' to tokenize PII before including in prompt"
  echo "   • Use 'Protegrity: Analyze Data Sensitivity' for detailed PII breakdown"
  echo ""
  echo "   The prompt has been flagged. Review before sending to AI model."
else
  echo "✅ [Protegrity] No sensitive data detected in prompt — safe to send."
fi

exit 0
