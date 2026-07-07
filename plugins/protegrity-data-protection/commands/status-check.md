---
name: status-check
description: Check which Protegrity services are running and which commands are available right now.
---

# 🩺 Protegrity Status Check

Instantly see which Protegrity Developer Edition services are running, which commands you can use right now, and what to do if something isn't ready.

---

## What This Command Does

Runs a health check on every Protegrity service endpoint and shows:
- ✅ Which services are **running** and ready to use
- ❌ Which services are **offline** and which commands are affected
- 🔑 Whether your API credentials are **configured** (for tokenization)
- 📋 Which commands are **available** based on what's running
- 💡 **Next steps** for anything that isn't ready

---

## How to Run

Open the Cursor Command Palette (`Cmd+Shift+P` on Mac, `Ctrl+Shift+P` on Windows/Linux) and type:
```
Protegrity: Status Check
```

---

## Example Output

```
╔══════════════════════════════════════════════════════╗
║         Protegrity Developer Edition — Status        ║
╚══════════════════════════════════════════════════════╝

🐳 Docker Services
  ✅ Data Discovery API      http://localhost:8580   → RUNNING
  ❌ Semantic Guardrail API  http://localhost:8581   → OFFLINE
  ❌ Synthetic Data API      http://localhost:8095   → OFFLINE
  ✅ Anonymization API       http://localhost:8085   → RUNNING

🔑 API Credentials (for tokenization)
  ✅ DEV_EDITION_EMAIL       → Set
  ✅ DEV_EDITION_PASSWORD    → Set
  ✅ DEV_EDITION_API_KEY     → Set
  ✅ Protection API (Cloud)  → Connected

📋 Available Commands
  ✅ Analyze Data Sensitivity    (Data Discovery running)
  ✅ Redact Sensitive Data       (Data Discovery running)
  ✅ Find and Redact             (Data Discovery running)
  ✅ Protect Text                (API credentials set)
  ✅ Unprotect Text              (API credentials set)
  ✅ Find and Protect            (Data Discovery running + credentials set)
  ✅ Anonymize Data              (Anonymization running)
  ✅ Privacy Reviewer Agent      (Data Discovery running)
  ❌ Scan Conversation Risk      → Semantic Guardrail offline
  ❌ Generate Synthetic Data     → Synthetic Data service offline

💡 To enable Scan Conversation Risk:
   cd protegrity-ai-developer-edition/semantic-guardrail && docker compose up -d

💡 To enable Generate Synthetic Data:
   cd protegrity-ai-developer-edition/synthetic-data && docker compose up -d

✅ 8 of 10 commands available. You're good to go for most tasks!
```

---

## Service Ports Reference

| Service | Port | Command(s) it enables |
|---------|------|-----------------------|
| Data Discovery | 8580 | Analyze Sensitivity, Redact, Find & Redact, Find & Protect, Privacy Reviewer |
| Semantic Guardrail | 8581 | Scan Conversation Risk |
| Synthetic Data | 8095 | Generate Synthetic Data |
| Anonymization | 8085 | Anonymize Data |
| Protegrity Cloud API | (cloud) | Protect Text, Unprotect Text, Find & Protect |

---

## Quick Fix Commands

**Start all Docker services at once:**
```bash
cd protegrity-ai-developer-edition

# Start each service
cd data-discovery    && docker compose up -d && cd ..
cd semantic-guardrail && docker compose up -d && cd ..
cd synthetic-data    && docker compose up -d && cd ..
cd anonymization     && docker compose up -d && cd ..

# Check all services
docker ps
```

**Set API credentials (if not set):**
```bash
# Linux / macOS:
export DEV_EDITION_EMAIL='your-email@company.com'
export DEV_EDITION_PASSWORD='your-password'
export DEV_EDITION_API_KEY='your-api-key'

# Then restart Cursor to pick up the new env vars
```

**Check individual service health:**
```bash
curl http://localhost:8580/health   # Data Discovery
curl http://localhost:8581/health   # Semantic Guardrail
curl http://localhost:8095/health   # Synthetic Data
curl http://localhost:8085/health   # Anonymization
```

---

## Common Issues

| Problem | Solution |
|---------|----------|
| All services OFFLINE | Make sure Docker Desktop is running, then start services |
| Credentials missing | Set the 3 `DEV_EDITION_*` env vars and restart Cursor |
| Service starts but returns errors | Wait 30 seconds after `docker compose up -d`, then re-check |
| Port already in use | Another service is using that port; check with `lsof -i :8580` |

---

## 📖 More Help

- **First time setup**: [QUICK_START.md](../QUICK_START.md)
- **Feature-by-feature setup**: [PREREQUISITES.md](../PREREQUISITES.md)
- **Run setup wizard**: `Protegrity: Setup Wizard` in Command Palette
