# Environment Setup Guide for Protect-Text Command

## ⚡ Quick Setup (5 minutes)

### 1. Get API Credentials
Go to: https://www.protegrity.com/developers/dev-edition-api
- Sign up for free
- Get: Email, Password, API Key

### 2. Set Environment Variables

**macOS/Linux:**
```bash
export DEV_EDITION_EMAIL='your-email@company.com'
export DEV_EDITION_PASSWORD='your-password'
export DEV_EDITION_API_KEY='your-api-key'
```

**Windows PowerShell:**
```powershell
$env:DEV_EDITION_EMAIL = 'your-email@company.com'
$env:DEV_EDITION_PASSWORD = 'your-password'
$env:DEV_EDITION_API_KEY = 'your-api-key'
```

### 3. Restart Cursor IDE
Close and reopen Cursor completely.

### 4. Test It
In Cursor Command Palette:
```
/protect-text John Smith
```

---

## ✅ What's Been Configured

All necessary changes have been made to your repository:

### 1. **config.json** ✓
Added `protection_endpoint`:
```json
"protection_endpoint": "http://localhost:8090/pty/data-protection/v1/protect"
```

### 2. **JavaScript Wrapper** ✓
`skills/api-wrapper.js` now includes:
```javascript
async function protect(data, policyUser = 'superuser', dataElement = 'name')
```

### 3. **Python Wrapper** ✓
`skills/py_api_wrapper.py` now includes:
```python
def protect(data, policy_user='superuser', data_element='name')
```

### 4. **Wrapper Runner** ✓
`skills/wrapper-runner.js` updated with protect command support:
```bash
node wrapper-runner.js protect "John Smith" "superuser" "name"
```

### 5. **Environment Template** ✓
Created `.env.example` with all required variables.

### 6. **Documentation** ✓
Updated `PREREQUISITES.md` with complete setup instructions.

---

## 🚀 Ready to Use

Your Cursor IDE can now execute `/protect-text` smoothly!

**Test command:**
```
/protect-text John Smith
```

**Expected response:**
- Prompts for policy user (default: superuser)
- Prompts for data element type (default: name)
- Returns: Protected token

---

## 📋 Verify Installation

Run in Cursor Command Palette:
```
Protegrity: Status Check
```

Should show: ✅ **Protection API: Connected**

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Environment variable not set" | Set env vars again, restart Cursor |
| "401 Unauthorized" | Check credentials at https://www.protegrity.com/developers/dev-edition-api |
| "Connection refused" | Check internet connection |
| "protection endpoint not configured" | Reload Cursor - config.json is already updated |

---

## 📝 Files Modified

```
✓ plugins/protegrity-data-protection/config.json
✓ plugins/protegrity-data-protection/skills/api-wrapper.js
✓ plugins/protegrity-data-protection/skills/py_api_wrapper.py
✓ plugins/protegrity-data-protection/skills/wrapper-runner.js
✓ plugins/protegrity-data-protection/PREREQUISITES.md
✓ plugins/protegrity-data-protection/.env.example (NEW)
```

---

**All done! Your repository is now fully configured for the protect-text command.** ✨
