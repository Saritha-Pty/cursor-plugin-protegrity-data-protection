# 🚀 Quick Start — Protegrity Data Protection for Cursor

Welcome! This guide helps you get started with Protegrity AI Developer Edition in Cursor in **under 5 minutes**.

---

## Step 1: What do you want to do?

> **Pick your goal below — each path tells you exactly what to set up.**

| I want to... | Feature | Setup needed | Time |
|---|---|---|---|
| 🔍 Find PII / sensitive data in text | **Analyze Data Sensitivity** | Docker only | ~5 min |
| ✂️ Remove / mask PII from text | **Redact Sensitive Data** | Docker only | ~5 min |
| 🔒 Tokenize data (protect & unprotect) | **Protect / Unprotect Text** | API account + SDK | ~10 min |
| 🛡️ Check AI conversations for risk | **Scan Conversation Risk** | Docker only | ~5 min |
| 🧪 Generate fake-but-realistic test data | **Generate Synthetic Data** | Docker only | ~10 min |
| 🕵️ Anonymize dataset fields | **Anonymize Data** | Docker only | ~10 min |
| 📋 Full privacy audit of my codebase | **Privacy Reviewer Agent** | Docker only | ~5 min |
| 🔗 Find then protect sensitive data | **Find & Protect** | Docker + API account | ~15 min |

---

## Step 2: Install prerequisites

### For Docker-based features (no API account needed)

```bash
# 1. Clone the Protegrity AI Developer Edition repo
git clone https://github.com/Protegrity-AI-Developer-Edition/protegrity-ai-developer-edition.git
cd protegrity-ai-developer-edition

# 2. Start ONLY the service you need:

# For Data Discovery / Redaction / Anonymization:
cd data-discovery && docker compose up -d && cd ..

# For Semantic Guardrails (also starts data-discovery first):
cd semantic-guardrail && docker compose up -d && cd ..

# For Synthetic Data:
cd synthetic-data && docker compose up -d && cd ..

# For Anonymization:
cd anonymization && docker compose up -d && cd ..

# 3. Verify services are up:
docker compose ps
```

### For Data Protection (tokenization) — API account required

```bash
# 1. Register (free) at: https://www.protegrity.com/developers/dev-edition-api
#    You'll get: Email, Password, API Key

# 2. Install the Python SDK
pip install protegrity-ai-developer-python

# 3. Set your credentials (Linux/macOS)
export DEV_EDITION_EMAIL='your-email@company.com'
export DEV_EDITION_PASSWORD='your-password'
export DEV_EDITION_API_KEY='your-api-key'

# Windows PowerShell:
# $env:DEV_EDITION_EMAIL = 'your-email@company.com'
# $env:DEV_EDITION_PASSWORD = 'your-password'
# $env:DEV_EDITION_API_KEY = 'your-api-key'

# 4. Restart Cursor (reads env vars at startup)
```

---

## Step 3: Use the commands in Cursor

Open the Cursor Command Palette (`Cmd+Shift+P` on Mac, `Ctrl+Shift+P` on Windows/Linux) and type **Protegrity** to see all available commands.

### Available Commands

| Command | What it does |
|---|---|
| `Protegrity: Analyze Data Sensitivity` | Detect PII in selected text |
| `Protegrity: Redact Sensitive Data` | Remove or mask PII from text |
| `Protegrity: Protect Text` | Tokenize sensitive data (reversible) |
| `Protegrity: Unprotect Text` | Restore original data from token |
| `Protegrity: Scan Conversation Risk` | Check AI conversations for data risks |
| `Protegrity: Generate Synthetic Data` | Create privacy-safe test datasets |
| `Protegrity: Anonymize Data` | Anonymize fields in datasets |
| `Protegrity: Find and Protect` | Discover PII then tokenize it |
| `Protegrity: Find and Redact` | Discover PII then remove it |
| `Protegrity: Status Check` | Verify all services are working |

---

## Step 4: Verify it works

1. Open Command Palette → `Protegrity: Status Check`
2. You should see green checkmarks for your enabled services
3. Try your first command!

---

## Need help?

- 📖 **Full setup**: [SETUP.md](./SETUP.md)
- 🔧 **Prerequisites by feature**: [PREREQUISITES.md](./PREREQUISITES.md)
- 🐛 **Troubleshooting**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- 📚 **Protegrity Docs**: https://developer.docs.protegrity.com/
- 💬 **Community**: https://github.com/orgs/Protegrity-AI-Developer-Edition/discussions
