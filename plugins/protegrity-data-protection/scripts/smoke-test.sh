#!/usr/bin/env bash
set -euo pipefail

# Smoke test for Protegrity plugin endpoints.
# - Accepts endpoints from env vars PROTEGRITY_CLASSIFICATION_ENDPOINT and PROTEGRITY_GUARDRAIL_ENDPOINT
# - Or reads them from config.json in the plugin root

PLUGIN_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CFG_FILE="$PLUGIN_DIR/config.json"

get_from_config() {
  local key="$1"
  python3 - <<PY
import json
cfg=json.load(open('$CFG_FILE'))
print(cfg.get('protegrity', {}).get('$key',''))
PY
}

classification_endpoint="${PROTEGRITY_CLASSIFICATION_ENDPOINT:-$(get_from_config classification_endpoint)}"
guardrail_endpoint="${PROTEGRITY_GUARDRAIL_ENDPOINT:-$(get_from_config semantic_guardrail_endpoint)}"

echo "[smoke-test] classification_endpoint=$classification_endpoint"
echo "[smoke-test] guardrail_endpoint=$guardrail_endpoint"

if [[ -z "$classification_endpoint" || -z "$guardrail_endpoint" ]]; then
  echo "ERROR: Endpoints not configured. Set env vars or update $CFG_FILE"
  exit 2
fi

# Helper to check reachability — non-zero HTTP code 000 indicates network failure
check_endpoint() {
  local url="$1"
  local data="$2"
  echo "[smoke-test] POST $url with payload: $data"
  http_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" "$url" || echo "000")
  if [[ "$http_code" == "000" ]]; then
    echo "FAIL: Network error when contacting $url"
    return 2
  else
    echo "OK: $url returned HTTP $http_code"
    return 0
  fi
}

# Test classification
classification_payload='{"text":"Protegrity smoke test"}'
check_endpoint "$classification_endpoint" "$classification_payload" || exit 3

# Test guardrail
guardrail_payload='{"messages":[{"role":"user","content":"Protegrity smoke test"}]}'
check_endpoint "$guardrail_endpoint" "$guardrail_payload" || exit 4

# Try using node wrapper-runner if available
if command -v node >/dev/null 2>&1; then
  echo "[smoke-test] Running node wrapper-runner classify"
  node "$PLUGIN_DIR/skills/wrapper-runner.js" classify "Protegrity smoke test" >/dev/null 2>&1 || echo "[smoke-test] wrapper-runner classify failed or returned non-zero"
fi

# Try using python wrapper if available
if command -v python3 >/dev/null 2>&1; then
  echo "[smoke-test] Running python py_api_wrapper classify"
  python3 "$PLUGIN_DIR/skills/py_api_wrapper.py" classify "Protegrity smoke test" >/dev/null 2>&1 || echo "[smoke-test] python classify failed or returned non-zero"
fi

echo "[smoke-test] Completed. If both endpoints were reachable (no network errors), smoke test passed."
exit 0
