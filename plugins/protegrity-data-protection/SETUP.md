# Setup Guide: Protegrity Data Protection Plugin

## ⚠️ CRITICAL: Two Independent Setup Tracks

This plugin has **two completely separate requirement paths**. You don't need both — choose based on your use case:

### 🐳 **Track 1: Docker + Docker Compose** (Local Services)
**Estimated Setup Time: 5-15 minutes**

**Required for these features:**
- ✅ Analyze Data Sensitivity (PII detection)
- ✅ Redact Sensitive Data
- ✅ Scan Conversation Risk (semantic guardrails)
- ✅ Synthetic Data Generation
- ✅ Privacy Reviewer Agent
- ✅ Security Compliance Auditor

**Prerequisites:**
- Docker installed and running
- Docker Compose (usually included with Docker Desktop)
- ~2GB disk space for container images
- ~4GB RAM available

### 🔑 **Track 2: API Credentials** (Cloud APIs)
**Estimated Setup Time: 10 minutes**

**Required for these features:**
- ✅ Protect Text (tokenization)
- ✅ Unprotect Text (detokenization)

**Prerequisites:**
- Protegrity account at https://www.protegrity.com/developers/dev-edition-api
- Email, Password, API Key from account
- Ability to set environment variables on your system

---

## Quick Decision Tree

```
What do you want to do?

├─ Detect/mask/redact PII in text?
│  └─ Need: Docker Compose (Track 1)
│
├─ Protect data with tokenization?
│  └─ Need: API Credentials (Track 2)
│
├─ Both?
│  └─ Need: Docker Compose (Track 1) + API Credentials (Track 2)
│
└─ Not sure?
   └─ Run: "Protegrity: Setup Wizard" command after installation
      (Wizard will assess your needs and guide you)
```

---

## Installation Steps

### 1. Install the Plugin

1. Open Cursor IDE
2. Go to Settings → Extensions → Cursor Marketplace
3. Search for "Protegrity Data Protection"
4. Click Install
5. Restart Cursor

### 2. Launch Setup Wizard (Recommended)

After installation:

1. Open Command Palette: `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux)
2. Type: "Protegrity: Setup Wizard"
3. Follow the wizard — it will:
   - Ask what features you need
   - Tell you exactly which prerequisites you need
   - Walk you through setup for your chosen track(s)
   - Verify everything works at the end

**First-time users: This is the recommended path.**

---

## Manual Setup (Skip if using Setup Wizard)

### Track 1: Docker Compose Setup (Local Services)

**Prerequisites Check:**
```bash
docker --version          # Should show Docker version
docker compose --version  # Should show Docker Compose version
```

**Setup Steps:**

1. Clone Protegrity Developer Edition repository:
```bash
git clone https://github.com/Protegrity-Developer-Edition/protegrity-developer-edition.git
cd protegrity-developer-edition
```

2. Start services:

**Option A: All services (includes everything)**
```bash
docker compose up -d
```

**Option B: Specific services only (faster startup)**
```bash
# For PII detection, redaction, guardrails:
docker compose up -d classification-service semantic-guardrail-service

# For synthetic data too:
docker compose up -d --profile synthetic
```

3. Verify services are running:
```bash
docker compose ps
# Should see services with status "running"

# Check logs if any fail:
docker compose logs classification-service
docker compose logs semantic-guardrail-service
```

4. Test connection:
```bash
# Classification API
curl http://localhost:8580/health

# Semantic Guardrail API
curl http://localhost:8581/health

# Synthetic Data API (if started with --profile synthetic)
curl http://localhost:8095/health
```

**Service Endpoints:**
- Classification API: `http://localhost:8580`
- Semantic Guardrail API: `http://localhost:8581`
- Synthetic Data API: `http://localhost:8095` (with `--profile synthetic`)

---

### Track 2: API Credentials Setup (Cloud APIs)

**Prerequisites Check:**
```bash
# Verify you can set environment variables
export TEST_VAR="test"
echo $TEST_VAR  # Should print "test"
```

**Setup Steps:**

1. **Register for Protegrity Account:**
   - Go to: https://www.protegrity.com/developers/dev-edition-api
   - Sign up and complete verification
   - Retrieve your credentials:
     - Email (for login)
     - Password
     - API Key

2. **Set Environment Variables:**

**Linux/macOS:**
```bash
export DEV_EDITION_EMAIL='your-email@company.com'
export DEV_EDITION_PASSWORD='your-password'
export DEV_EDITION_API_KEY='your-api-key-here'

# Verify they're set:
echo $DEV_EDITION_API_KEY  # Should show your API key (not empty)
```

**Windows PowerShell:**
```powershell
$env:DEV_EDITION_EMAIL = 'your-email@company.com'
$env:DEV_EDITION_PASSWORD = 'your-password'
$env:DEV_EDITION_API_KEY = 'your-api-key-here'

# Verify they're set:
$env:DEV_EDITION_API_KEY  # Should show your API key
```

**Windows Command Prompt (cmd.exe):**
```cmd
setx DEV_EDITION_EMAIL "your-email@company.com"
setx DEV_EDITION_PASSWORD "your-password"
setx DEV_EDITION_API_KEY "your-api-key-here"

# Restart cmd or Cursor for changes to take effect
```

**⚠️ Important:**
- ✅ Environment variables must be set **before** starting Cursor
- ✅ Cursor reads environment variables at startup only
- ✅ Restart Cursor if you set variables after Cursor is open
- ✅ Never commit credentials to version control

3. **Verify Connection:**
```bash
# Test API connectivity
curl -H "Authorization: Bearer $DEV_EDITION_API_KEY" \
  https://api.protegrity.com/v1/health

# Should return a success response (not 401/403 errors)
```

---

## Verification & Testing

### Combined Status Check

1. Open Command Palette: `Cmd+Shift+P` or `Ctrl+Shift+P`
2. Run: "Protegrity: Status Check"
3. Plugin will report:
   - ✅ Plugin loaded successfully
   - ✅ Config file detected
   - ✅ Docker services status (if applicable)
   - ✅ API credentials status (if applicable)
   - ✅ Each endpoint connectivity

### Test Each Feature Track

**Test Track 1 (Docker Services):**

1. Create a test file with sample PII:
```
John Smith works at Acme Corp
Phone: 555-123-4567
Email: john@acme.com
SSN: 123-45-6789
```

2. Select the text in the editor
3. Run Command: "Protegrity: Analyze Data Sensitivity"
4. Should detect PERSON, ORGANIZATION, PHONE_NUMBER, EMAIL_ADDRESS, SSN entities

**Test Track 2 (API Credentials):**

1. Ensure environment variables are set and Cursor is restarted
2. Create test text: "Sensitive data to protect"
3. Select the text
4. Run Command: "Protegrity: Protect Text"
5. When prompted:
   - Policy User: `superuser`
   - Data Element: `name`
6. Should return a protected token

---

## Configuration

### Plugin Settings

After successful setup, customize these in Cursor Settings (search "Protegrity"):

**For Track 1 (Docker Services):**
```json
{
  "classification_endpoint": "http://localhost:8580",
  "semantic_guardrail_endpoint": "http://localhost:8581",
  "classification_score_threshold": 0.6,
  "masking_character": "#",
  "redaction_method": "redact"  // or "mask"
}
```

**For Track 2 (API Credentials):**
```json
{
  "protection_policy_user": "superuser",
  "enable_protection_logging": true
}
```

**For Both Tracks:**
```json
{
  "audit_enabled": true,
  "audit_log_retention_days": 90
}
```

---

## Troubleshooting

### Docker Setup Issues

**Problem: "Cannot connect to Docker daemon"**
- Solution: Ensure Docker Desktop is running
- Check: `docker ps` should work without errors

**Problem: "Services won't start"**
```bash
# Check if ports are in use
lsof -i :8580   # Classification API port
lsof -i :8581   # Guardrail API port

# If ports are busy, either:
# 1. Stop the process using that port
# 2. Or modify docker-compose.yml to use different ports
```

**Problem: "docker compose: command not found"**
- Ensure you have Docker Compose v2+ installed
- Check: `docker compose --version`
- If missing: https://docs.docker.com/compose/install/

**Problem: "Out of disk space"**
- Docker images need ~2GB
- Check: `df -h`
- Clean unused images: `docker system prune`

### API Credentials Issues

**Problem: "401 Unauthorized" error**
- ❌ Environment variables not set or incorrect
- ❌ Cursor restarted after setting variables?
- Solution:
  1. Verify variables: `echo $DEV_EDITION_API_KEY`
  2. Verify they're not empty
  3. Verify they match your account at https://www.protegrity.com/developers/dev-edition-api
  4. Restart Cursor
  5. Try again

**Problem: "Environment variable not found"**
- Solution:
  1. Ensure variable is exported (not just set): `export VAR_NAME=value`
  2. Verify: `echo $VAR_NAME` shows the value
  3. Restart terminal/Cursor
  4. Try again

**Problem: "Network unreachable"**
- Check internet connection
- Check firewall allows outbound HTTPS
- Verify VPN if using one

---

## Next Steps After Setup

1. **Read PREREQUISITES.md** for detailed feature-by-feature requirements
2. **Read TESTING.md** for comprehensive test scenarios
3. **Explore sample skills** in `skills/` directory
4. **Enable audit logging** for compliance tracking (in plugin settings)
5. **Review Protegrity docs**: https://developer.docs.protegrity.com/

---

## Getting Help

**Setup Wizard Failed?**
→ Run again: `Cmd+Shift+P` → "Protegrity: Setup Wizard"

**Plugin not loading?**
→ Check Cursor extension logs: Help → Show Logs → Look for "Protegrity"

**Docker issues?**
→ See Docker troubleshooting section above
→ Or: https://docs.docker.com/get-started/

**API credential issues?**
→ Verify account: https://www.protegrity.com/developers/dev-edition-api
→ Contact Protegrity support for account issues

**Plugin issues?**
→ GitHub Issues: https://github.com/Saritha-Pty/cursor-plugin-protegrity-data-protection/issues

**API questions?**
→ Protegrity Discussions: https://github.com/Protegrity-Developer-Edition/discussions
→ API Docs: https://developer.docs.protegrity.com/

---

## Summary

| Setup Track | Time | Prerequisites | Features Unlocked |
|-----------|------|-----------------|-------------------|
| **Track 1: Docker** | 5-15 min | Docker + 2GB disk | PII detection, redaction, guardrails, synthetic data |
| **Track 2: API Creds** | 10 min | Account + 3 env vars | Protect/unprotect (tokenization) |
| **Both Tracks** | 15-25 min | Docker + API creds | All features |

**Don't know where to start?** → Run the Setup Wizard!
