#!/bin/bash

# Protegrity PII Scanner Hook
# Scans edited files for exposed PII and alerts the user

FILE_PATH="$1"
FILE_CONTENT=$(cat "$FILE_PATH" 2>/dev/null)

if [ -z "$FILE_CONTENT" ]; then
  exit 0
fi

echo "[Protegrity] Scanning for exposed PII in $FILE_PATH..."

# Check for common PII patterns (basic regex examples)
if echo "$FILE_CONTENT" | grep -qE '[0-9]{3}-[0-9]{2}-[0-9]{4}'; then
  echo "⚠️  WARNING: Potential SSN detected in $FILE_PATH"
  echo "   Consider using Protegrity protect-text command or masking."
fi

if echo "$FILE_CONTENT" | grep -qE '[0-9]{3}-[0-9]{3}-[0-9]{4}'; then
  echo "⚠️  WARNING: Potential phone number detected in $FILE_PATH"
fi

if echo "$FILE_CONTENT" | grep -qE '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'; then
  echo "ℹ️  INFO: Email address detected in $FILE_PATH"
fi

echo "[Protegrity] Scan complete."
exit 0
