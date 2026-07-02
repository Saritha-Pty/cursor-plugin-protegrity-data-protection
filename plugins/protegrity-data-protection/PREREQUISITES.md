# Prerequisites

> **REQUIRED FOR ALL COMMANDS**: Set your Protegrity API credentials as environment variables before using this plugin.

## Environment Variables Setup (CRITICAL)

### Step 1: Get Your Credentials
Sign up for free at: https://www.protegrity.com/developers/dev-edition-api

You will receive:
- **Email** - Your account email
- **Password** - Your account password  
- **API Key** - Your unique API key

### Step 2: Set Environment Variables

**Linux/macOS (bash/zsh):**
```bash
export DEV_EDITION_EMAIL='your-email@company.com'
export DEV_EDITION_PASSWORD='your-secure-password'
export DEV_EDITION_API_KEY='your-api-key-here'
```

**Windows (PowerShell):**
```powershell
$env:DEV_EDITION_EMAIL = 'your-email@company.com'
$env:DEV_EDITION_PASSWORD = 'your-secure-password'
$env:DEV_EDITION_API_KEY = 'your-api-key-here'
```

**Windows (Command Prompt):**
```cmd
setx DEV_EDITION_EMAIL "your-email@company.com"
setx DEV_EDITION_PASSWORD "your-secure-password"
setx DEV_EDITION_API_KEY "your-api-key-here"
```

### Step 3: Verify Setup
After setting environment variables, **restart Cursor IDE** completely.

To verify in Cursor:
1. Open Command Palette (Cmd/Ctrl + Shift + P)
2. Run: `Protegrity: Status Check`
3. Should show: ✅ **Protection API: Connected**

---

## Per-Command Prerequisites

### 1. Classify Data (analyze-data-sensitivity)

**Requirements:**
- ✅ Environment variables set (DEV_EDITION_EMAIL, DEV_EDITION_PASSWORD, DEV_EDITION_API_KEY)
- ✅ Network access to Protegrity cloud APIs
- ✅ Python 3.9+

**Quick Test:**
```bash
python3 --version  # Should show 3.9+
```

---

### 2. Protect Text (protect-text) ⭐ **NEW**

**Requirements:**
- ✅ **Environment variables set** (DEV_EDITION_EMAIL, DEV_EDITION_PASSWORD, DEV_EDITION_API_KEY)
- ✅ Network access to Protegrity cloud APIs
- ✅ Python 3.9+
- ✅ `protection_endpoint` in config.json ✅ **Already configured**

**What It Does:**
Converts sensitive text into secure tokens using Protegrity's tokenization APIs.

**Example:**
```
Input: "John Smith"
Policy User: superuser
Data Element: name
→ Output: protected_token_xyz123
```

**Setup Time:** ~5 minutes (environment variables only)

**Quick Start:**
1. Select text in editor
2. Command Palette → `/protect-text <text>`
3. Provide policy user and data element type
4. Get protected token

**Supported Data Elements:**
- `name` - Person names
- `email` - Email addresses
- `phone` - Phone numbers
- `ssn` - Social security numbers
- `credit_card` - Credit card numbers
- `address` - Addresses
- Custom types - Define your own

---

### 3. Redact Sensitive Data (redact-sensitive-data)

**Requirements:**
- ✅ Environment variables set
- ✅ Network access to Protegrity APIs
- ✅ Python 3.9+

---

### 4. Scan Conversation Risk (scan-conversation-risk)

**Requirements:**
- ✅ Environment variables set
- ✅ Network access to Protegrity APIs
- ✅ Python 3.9+

---

### 5. Unprotect Text (unprotect-text)

**Requirements:**
- ✅ Environment variables set
- ✅ Network access to Protegrity APIs
- ✅ Valid protected token from protect-text command

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| ❌ "Environment variable not set" | Follow Step 2 above and **restart Cursor IDE** |
| ❌ "401 Unauthorized" | Check credentials at https://www.protegrity.com/developers/dev-edition-api |
| ❌ "Connection refused" | Check internet connection and firewall |
| ❌ "Policy user not recognized" | Use: `superuser` or contact Protegrity admin |
| ❌ "protection endpoint not configured" | Run `/config-check` or verify config.json has `protection_endpoint` |

---

## Configuration Reference

**File:** `plugins/protegrity-data-protection/config.json`

Default endpoints (can be overridden with environment variables):
```json
{
  "protegrity": {
    "classification_endpoint": "http://localhost:8580/pty/data-discovery/v1.1/classify",
    "protection_endpoint": "http://localhost:8090/pty/data-protection/v1/protect",
    "semantic_guardrail_endpoint": "http://localhost:8581/pty/semantic-guardrail/v1.1/conversations/messages/scan",
    "synthetic_data_endpoint": "http://localhost:8095/pty/synthetic-data/v1"
  }
}
```

---

## Quick Checklist

Before using any command:

- [ ] Registered at https://www.protegrity.com/developers/dev-edition-api
- [ ] Have DEV_EDITION_EMAIL, DEV_EDITION_PASSWORD, DEV_EDITION_API_KEY
- [ ] Set environment variables (Steps 1-2 above)
- [ ] Restarted Cursor IDE
- [ ] Verified with `/config-check` or Status Check
- [ ] Have Python 3.9+
- [ ] Internet connection working

✅ **All set! Ready to use protect-text and other commands.**
