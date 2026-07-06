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

### 3. Install SDK Dependency
```bash
pip install protegrity-ai-developer-python
```

### 4. Restart Cursor IDE
Close and reopen Cursor completely.

### 5. Test It
In Cursor Command Palette:
```
/protect-text John Smith
```

---

## ✅ What's Configured

- Protect path uses official SDK import: `appython`
- Credentials are read from: `DEV_EDITION_EMAIL`, `DEV_EDITION_PASSWORD`, `DEV_EDITION_API_KEY`
- Classification and semantic guardrail continue to use local services (`:8580`, `:8581`)
- No localhost:8090 endpoint is used for protect

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Environment variable not set" | Set env vars again, restart Cursor |
| "Missing dependency ... appython" | Install with `pip install protegrity-ai-developer-python` |
| "401 Unauthorized" | Check credentials at https://www.protegrity.com/developers/dev-edition-api |
| "Unable to invoke protect via appython SDK" | Verify installed SDK version and available method names |

---

**Done — protect-text is configured to use the official SDK path.**
