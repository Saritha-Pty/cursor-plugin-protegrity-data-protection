---
name: protect-text
description: Protect selected text using Protegrity tokenization APIs. Returns protected token.
---

# Protect Text

Apply enterprise-grade protection to sensitive data.

## Prerequisites Check

Before using this command, ensure you have:

✅ **Protegrity API Account** - REQUIRED
- Sign up: https://www.protegrity.com/developers/dev-edition-api
- You need: Email, Password, API Key

✅ **Environment Variables Set** - REQUIRED
- DEV_EDITION_EMAIL
- DEV_EDITION_PASSWORD
- DEV_EDITION_API_KEY

✅ **Python 3.9+** - REQUIRED
- Verify: `python3 --version`

✅ **Network Access** - REQUIRED
- Outbound HTTPS to Protegrity cloud APIs
- Test: `curl https://api.protegrity.com` (should connect)

✅ **Policy User Configuration** - REQUIRED
- Typical value: "superuser"
- Contact your Protegrity admin if different

⏱️ **Setup Time**: ~10 minutes

### Quick Setup (First Time)

**Step 1: Register for API Access**
```
Go to: https://www.protegrity.com/developers/dev-edition-api
Sign up and obtain: Email, Password, API Key
```

**Step 2: Set Environment Variables (Linux/macOS)**
```bash
export DEV_EDITION_EMAIL='your-email@company.com'
export DEV_EDITION_PASSWORD='your-password'
export DEV_EDITION_API_KEY='your-api-key-here'
```

**Step 3: Set Environment Variables (Windows PowerShell)**
```powershell
$env:DEV_EDITION_EMAIL = 'your-email@company.com'
$env:DEV_EDITION_PASSWORD = 'your-password'
$env:DEV_EDITION_API_KEY = 'your-api-key-here'
```

**Step 4: Restart Cursor**
- Cursor reads environment variables at startup
- Close and reopen Cursor IDE

**Step 5: Verify Connection**
```
In Cursor Command Palette run:
Protegrity: Status Check
Should show: ✅ Protection API: Connected
```

### Status Check
Run this in Cursor Command Palette:
```
Protegrity: Status Check
```
Should show: ✅ Protection API (Cloud): Connected

---

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

## Common Issues

| Issue | Solution |
|-------|----------|
| ❌ "401 Unauthorized" | Check API credentials at https://www.protegrity.com/developers/dev-edition-api |
| ❌ "Environment variable not set" | Follow Step 2-3 above, then restart Cursor |
| ❌ "Policy user not recognized" | Use: "superuser" or contact Protegrity admin |
| ❌ "Network timeout" | Check internet connection and firewall |

## Data Element Types

Common data elements you can protect:
- `name` - Person names
- `email` - Email addresses
- `phone` - Phone numbers
- `ssn` - Social security numbers
- `credit_card` - Credit card numbers
- `address` - Addresses
- Custom types - Define your own

## Full Prerequisites Guide

📖 See [PREREQUISITES.md - Protect Text](../PREREQUISITES.md#2-protect-text-command) for:
- Complete setup instructions
- Detailed credential registration
- Environment variable verification
- Verification steps
- Policy user configuration
- Advanced troubleshooting
