---
name: unprotect-text
description: Convert protected tokens back to original sensitive data using Protegrity APIs.
---

# Unprotect Text

Retrieve original data from protected tokens.

## Prerequisites Check

Before using this command, ensure you have:

✅ **Protegrity API Account** - REQUIRED
- Sign up: https://www.protegrity.com/developers/dev-edition-api
- You need: Email, Password, API Key

✅ **Environment Variables Set** - REQUIRED
- DEV_EDITION_EMAIL
- DEV_EDITION_PASSWORD
- DEV_EDITION_API_KEY
- ⚠️ Same credentials used to create the token

✅ **Python 3.9+** - REQUIRED
- Verify: `python3 --version`

✅ **Valid Protection Token** - REQUIRED
- Token must be created by Protect Text command
- Format: `<protected_token_string>`

✅ **Matching Policy User** - REQUIRED
- Use the same policy user that created the token
- Example: if token created with "superuser", unprotect with "superuser"

⏱️ **Setup Time**: ~10 minutes (if Protect Text already configured)

### Quick Setup (First Time)

⚠️ **IMPORTANT**: Unprotect Text uses the same credentials as Protect Text.

**If you already use Protect Text:**
- Just use the same environment variables
- No additional setup needed

**If this is your first time:**
See [protect-text.md - Quick Setup](./protect-text.md#quick-setup-first-time) for:
1. Register for API Access
2. Set Environment Variables
3. Restart Cursor
4. Verify Connection

### Status Check
Run this in Cursor Command Palette:
```
Protegrity: Status Check
```
Should show: ✅ Protection API (Cloud): Connected

---

## Steps

1. Have a protected token (created by Protect Text command)
2. Run the unprotect-text command
3. Provide the protected token
4. Provide authentication:
   - Policy user (must match the user who created token)
   - Policy context (if applicable)
5. Receive the original unprotected data
6. Use for authorized purposes only

## Usage Example

```bash
Protected Token: <protected_token_abc123xyz>
Policy User: superuser
→ Output: John Smith (original data)
```

## Token Lifecycle

```
1. Original Data: "john@example.com"
   ↓
2. Protect: Use Protect Text command with policy user "superuser"
   ↓
3. Protected Token: "<protected_token_abc123xyz>"
   ↓
4. Store/Transmit safely without exposing original
   ↓
5. Unprotect: Use Unprotect Text command with same policy user "superuser"
   ↓
6. Original Data: "john@example.com" (retrieved)
```

## Authorization & Security

⚠️ **Important Security Notes**:

1. **Same User Required** - Token can only be unprotected by the same policy user who created it
2. **Credentials Matter** - API credentials must be identical
3. **Audit Trail** - All unprotection operations are logged (if audit logging enabled)
4. **Compliance** - Document why unprotection is needed for compliance audit

## Common Issues

| Issue | Solution |
|-------|----------|
| ❌ "Invalid token" | Token format incorrect or corrupted; check token string |
| ❌ "User not authorized" | Using different policy user than protection; use same user |
| ❌ "Environment variable not set" | Follow Step 2-3 in protect-text.md, then restart Cursor |
| ❌ "401 Unauthorized" | API credentials invalid or expired; refresh at protegrity.com |
| ❌ "Unprotection failed" | Contact Protegrity support; provide error message |

## When to Use Unprotect

✅ **Appropriate Use Cases**:
- Authorized personnel retrieving their own protected data
- Compliance investigators reviewing protected records
- Data recovery for legitimate business purposes
- Authorized third-party access with proper controls

❌ **Inappropriate Use Cases**:
- Bypassing data protection controls
- Unauthorized data access
- Circumventing security policies
- Accidentally exposing protected data

## Best Practices

1. **Minimize Unprotection** - Only unprotect when absolutely necessary
2. **Access Controls** - Restrict who can run this command
3. **Audit Logging** - Enable audit logging to track all unprotection activities
4. **Documentation** - Log reason and context for each unprotection
5. **Sensitive Handling** - Treat unprotected data securely (don't log, don't screenshot)

## Full Prerequisites Guide

📖 See [PREREQUISITES.md - Unprotect Text](../PREREQUISITES.md#3-unprotect-text-command) for:
- Complete setup instructions
- API credential setup
- Verification steps
- Authorization requirements
- Advanced troubleshooting
