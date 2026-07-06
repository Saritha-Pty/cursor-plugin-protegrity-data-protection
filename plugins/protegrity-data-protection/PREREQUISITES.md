# Prerequisites by Feature

> **New to Protegrity AI Developer Edition?** Start with [QUICK_START.md](./QUICK_START.md) first.

This page lists the exact prerequisites for each plugin feature — nothing more, nothing less.

---

## Feature Prerequisites Overview

| Feature | Docker? | API Account? | Python SDK? | Setup Time |
|---------|---------|-------------|------------|------------|
| Analyze Data Sensitivity | ✅ Yes (data-discovery) | ❌ No | ❌ No | ~5 min |
| Redact Sensitive Data | ✅ Yes (data-discovery) | ❌ No | ❌ No | ~5 min |
| Scan Conversation Risk | ✅ Yes (semantic-guardrail) | ❌ No | ❌ No | ~5 min |
| Generate Synthetic Data | ✅ Yes (synthetic-data) | ❌ No | ❌ No | ~10 min |
| Anonymize Data | ✅ Yes (anonymization) | ❌ No | ❌ No | ~10 min |
| Protect Text (tokenize) | ❌ No | ✅ Yes | ✅ Yes | ~10 min |
| Unprotect Text (detokenize) | ❌ No | ✅ Yes | ✅ Yes | ~10 min |
| Find and Protect | ✅ Yes (data-discovery) | ✅ Yes | ✅ Yes | ~15 min |
| Find and Redact | ✅ Yes (data-discovery) | ❌ No | ❌ No | ~5 min |
| Privacy Reviewer Agent | ✅ Yes (data-discovery) | ❌ No | ❌ No | ~5 min |
| Security Compliance Auditor | ✅ Yes (all) | ✅ Optional | ❌ No | ~15 min |

---

## 1. Analyze Data Sensitivity

**What it does**: Classifies text and finds PII entities (names, emails, SSNs, etc.) with confidence scores.

**Requires:**
- ✅ Docker Desktop running
- ✅ Data Discovery service started
- ✅ Python 3.11+ installed

**Start the service:**
```bash
cd protegrity-ai-developer-edition/data-discovery
docker compose up -d

# Verify it's running:
curl http://localhost:8580/health
```

**API used:** `http://localhost:8580/pty/data-discovery/v2.0/classify`

**Supported entities:** PERSON, LOCATION, EMAIL_ADDRESS, PHONE_NUMBER, SOCIAL_SECURITY_ID, CREDIT_CARD_NUMBER, AGE, USERNAME, IP_ADDRESS, ACCOUNT_NUMBER, PASSPORT_NUMBER, DRIVER_LICENSE_NUMBER, DATE_OF_BIRTH

---

## 2. Redact Sensitive Data

**What it does**: Removes or masks detected PII from text using `redact` or `mask` method.

**Requires:**
- ✅ Docker Desktop running
- ✅ Data Discovery service started (same as above)
- ✅ Python 3.11+ installed

**Start the service:**
```bash
cd protegrity-ai-developer-edition/data-discovery
docker compose up -d
```

**Configuration (config.json):**
```json
{
  "method": "redact",      // "redact" removes PII, "mask" replaces with #####
  "masking_char": "#",    // used only when method is "mask"
  "classification_score_threshold": 0.6
}
```

---

## 3. Protect Text (Tokenization)

**What it does**: Converts sensitive data into secure tokens using Protegrity's hosted API. Tokens are reversible by authorized users.

**Requires:**
- ✅ Protegrity account (free registration)
- ✅ `protegrity-ai-developer-python` SDK installed
- ✅ 3 environment variables set
- ❌ No Docker needed

**Step 1: Register (free)**
```
Go to: https://www.protegrity.com/developers/dev-edition-api
Sign up → Get: Email, Password, API Key
```

**Step 2: Install SDK**
```bash
# Recommended: use a virtual environment
python3 -m venv .venv
source .venv/bin/activate  # Linux/macOS
# .venv\Scripts\activate  # Windows

pip install protegrity-ai-developer-python
```

**Step 3: Set credentials**
```bash
# Linux/macOS:
export DEV_EDITION_EMAIL='your-email@company.com'
export DEV_EDITION_PASSWORD='your-password'
export DEV_EDITION_API_KEY='your-api-key'

# Windows PowerShell:
$env:DEV_EDITION_EMAIL = 'your-email@company.com'
$env:DEV_EDITION_PASSWORD = 'your-password'
$env:DEV_EDITION_API_KEY = 'your-api-key'

# Windows Command Prompt (setx persists across sessions):
setx DEV_EDITION_EMAIL "your-email@company.com"
setx DEV_EDITION_PASSWORD "your-password"
setx DEV_EDITION_API_KEY "your-api-key"
```

**Step 4: Restart Cursor** (reads env vars at startup)

**Verify:**
```bash
python3 -c "import appython; print('SDK ready')"
echo $DEV_EDITION_API_KEY  # Should not be empty
```

---

## 4. Unprotect Text (Detokenization)

Same requirements as **Protect Text** above (same SDK and credentials).

Also requires: a valid protected token from a previous protect operation.

---

## 5. Scan Conversation Risk

**What it does**: Evaluates multi-turn AI conversations for semantic risk, PII exposure, and prompt injection risks.

**Requires:**
- ✅ Docker Desktop running
- ✅ Data Discovery service started (dependency)
- ✅ Semantic Guardrail service started
- ✅ Python 3.11+ installed

**Start the services (in order):**
```bash
# Step 1: Start data-discovery (required dependency)
cd protegrity-ai-developer-edition/data-discovery
docker compose up -d

# Step 2: Start semantic guardrail
cd ../semantic-guardrail
docker compose up -d

# Verify:
curl http://localhost:8581/health
```

**API used:** `http://localhost:8581/pty/semantic-guardrail/v1.1/conversations/messages/scan`

---

## 6. Generate Synthetic Data

**What it does**: Creates realistic, privacy-safe test datasets that mimic real data without containing actual personal information.

**Requires:**
- ✅ Docker Desktop running
- ✅ Synthetic Data service started
- ✅ Python 3.11+ installed

**Start the service:**
```bash
cd protegrity-ai-developer-edition/synthetic-data
docker compose up -d

# Verify:
curl http://localhost:8095/health
```

**API used:** `http://localhost:8095/pty/syntheticdata/v2`

---

## 7. Anonymize Data

**What it does**: Anonymizes sensitive fields in datasets. Unlike redaction, anonymization preserves data utility while removing identifiers.

**Requires:**
- ✅ Docker Desktop running
- ✅ Anonymization service started
- ✅ Python 3.11+ installed

**Start the service:**
```bash
cd protegrity-ai-developer-edition/anonymization
docker compose up -d

# Verify:
curl http://localhost:8085/health
```

**API used:** `http://localhost:8085/pty/anonymization/v3`

---

## 8. Find and Protect

**What it does**: End-to-end workflow — discovers PII in text and then tokenizes (protects) it automatically.

**Requires:**
- Everything from **Analyze Data Sensitivity** (Data Discovery Docker)
- Everything from **Protect Text** (API account + SDK + env vars)

---

## 9. Find and Redact

**What it does**: Discovers PII in text and then removes/masks it.

**Requires:**
- Everything from **Analyze Data Sensitivity** (Data Discovery Docker)
- No API account needed

---

## 10. Privacy Reviewer Agent

**What it does**: Reviews your codebase for data exposure risks, protection gaps, and compliance issues.

**Requires:**
- ✅ Data Discovery service (Docker)
- ✅ Cursor AI model enabled (Claude or GPT-4)

---

## 11. Security Compliance Auditor

**What it does**: Full compliance audit across all data protection operations.

**Requires:**
- ✅ All Docker services (data-discovery, semantic-guardrail)
- ✅ Audit logging enabled in config.json
- ✅ (Optional) API credentials for protection audit

---

## Common Prerequisites (All Features)

- **Python 3.11+**: Required for all API calls and scripts
  ```bash
  python3 --version  # Must show 3.11 or later
  ```

- **Cursor IDE**: Any recent version with AI features

- **Internet connection**: Required for Protect/Unprotect (cloud APIs); optional for Docker features

---

## MacOS Additional Setup

If you're on macOS with Apple Silicon (M1/M2/M3):

**Option A: Using Docker Desktop**
1. Open Docker Desktop → Settings → General
2. Enable: **Use Virtualization framework**
3. Enable: **Use Rosetta for x86_64/amd64 emulation on Apple Silicon**
4. Click Apply & Restart

**Option B: Using Colima**
```bash
colima start --vm-type vz --vz-rosetta --memory 8
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `Cannot connect to Classification API` | Run `docker compose up -d` in `data-discovery/` directory |
| `Cannot connect to Guardrail API` | Run `docker compose up -d` in `semantic-guardrail/` (also needs data-discovery) |
| `Cannot connect to Synthetic Data API` | Run `docker compose up -d` in `synthetic-data/` directory |
| `Cannot connect to Anonymization API` | Run `docker compose up -d` in `anonymization/` directory |
| `401 Unauthorized` (protect/unprotect) | Check credentials at https://www.protegrity.com/developers |
| `SDK not found` (import error) | Run `pip install protegrity-ai-developer-python` |
| `Environment variable not set` | Set vars, then **restart Cursor** (not just terminal) |
| `Docker daemon not running` | Start Docker Desktop application |
| `Port already in use` | Check `lsof -i :8580` and stop conflicting process |
| MacOS image pull errors | See MacOS section above for Docker Desktop settings |

---

📚 **Full documentation**: https://developer.docs.protegrity.com/
