---
name: protect-text
description: Protect selected text using Protegrity tokenization APIs. Returns protected token.
---

# Protect Text

Apply enterprise-grade protection to sensitive data.

## Steps

1. Select the sensitive text in your editor.
2. Run the protect-text command.
3. Provide authentication:
   - Policy user (e.g., "superuser")
   - Data element type (e.g., "name", "email", "ssn")
4. Receive the protected token.
5. Replace the original text with the token.
6. Use the token in your workflows; original data is secure.

## Usage Example

```bash
Input: John Smith
Policy User: superuser
Data Element: name
→ Output: <protected_token>
```

## Requirements

Set environment variables before running:
- `DEV_EDITION_EMAIL`
- `DEV_EDITION_PASSWORD`
- `DEV_EDITION_API_KEY`

Obtain credentials from https://www.protegrity.com/developers/dev-edition-api
