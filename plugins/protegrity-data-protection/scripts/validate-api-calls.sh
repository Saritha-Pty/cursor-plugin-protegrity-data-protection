#!/bin/bash

# Protegrity API Call Validator Hook
# Validates that API calls use protected/redacted data, not raw PII

echo "[Protegrity] Validating API calls for data protection..."

# This script runs before shell execution for curl, wget, http, fetch commands
# Check if the command contains common PII patterns

COMMAND="$@"

if echo "$COMMAND" | grep -qE '[0-9]{3}-[0-9]{2}-[0-9]{4}'; then
  echo "❌ ERROR: Command contains potential SSN"
  echo "   Use Protegrity protect-text or redact-sensitive-data commands first."
  exit 1
fi

if echo "$COMMAND" | grep -qP '(password|token|secret|api[-_]?key)=["\x27]?[^\s"]+'; then
  echo "⚠️  WARNING: Command may contain secrets"
  echo "   Use environment variables instead of inline secrets."
fi

exit 0
