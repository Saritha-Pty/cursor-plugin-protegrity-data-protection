---
name: unprotect-text
description: Unprotect a protected token to retrieve the original data. Requires authorization.
---

# Unprotect Text

Retrieve original data from a protected token (requires authorization).

## Steps

1. Select the protected token in your editor.
2. Run the unprotect-text command.
3. Provide authentication:
   - Policy user
   - Data element type
4. Confirm you have authorization to unprotect.
5. Receive the original data.
6. **Important**: Log the unprotection operation for audit purposes.

## Usage Example

```bash
Input: <protected_token>
Policy User: superuser
Data Element: name
→ Output: John Smith
```

## Security Notes

- Use sparingly; prefer working with protected tokens
- Always log unprotection operations
- Verify authorization before unprotecting
- Consider if unprotection is necessary for the workflow

## Requirements

Set environment variables before running:
- `DEV_EDITION_EMAIL`
- `DEV_EDITION_PASSWORD`
- `DEV_EDITION_API_KEY`
