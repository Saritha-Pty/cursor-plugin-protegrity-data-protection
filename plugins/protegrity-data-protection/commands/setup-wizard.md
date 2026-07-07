---
name: setup-wizard
description: Interactive setup wizard that guides new users through Protegrity Developer Edition configuration step by step.
---

# 🧙 Protegrity Setup Wizard

Welcome to Protegrity Data Protection for Cursor! This wizard will ask you a few questions and give you a **personalized setup plan** — only the steps you actually need.

> **You are in charge.** The wizard tells you exactly what to do. It does not make changes to your system — you run each step yourself.

---

## How the Wizard Works

The wizard asks:
1. What do you want to do? (your use case)
2. What do you already have? (Docker, Python, API account)
3. What is your operating system?

Then it gives you a **step-by-step plan** tailored to your answers — no guessing, no extra steps.

---

## Start the Wizard

Open the Cursor Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) and run:
```
Protegrity: Setup Wizard
```

---

## Wizard Questions

### Question 1: What do you want to do?

Choose your primary goal:

| # | I want to... | Feature needed |
|---|---|---|
| 1 | Find PII / sensitive data in text | Analyze Data Sensitivity |
| 2 | Remove or mask PII from text | Redact Sensitive Data |
| 3 | Tokenize data (protect & later unprotect) | Protect / Unprotect Text |
| 4 | Check AI conversations for data risks | Scan Conversation Risk |
| 5 | Generate fake-but-realistic test data | Generate Synthetic Data |
| 6 | Anonymize dataset fields | Anonymize Data |
| 7 | Find PII and tokenize it in one step | Find and Protect |
| 8 | Find PII and remove it in one step | Find and Redact |
| 9 | Do a full privacy audit of my codebase | Privacy Reviewer Agent |
| 10 | Everything — set up all features | Full Setup |

---

### Question 2: What do you already have?

Check what's installed:
```bash
docker --version         # Docker Desktop
python3 --version        # Python 3.11+
echo $DEV_EDITION_API_KEY  # Protegrity API key (set = non-empty)
```

---

### Question 3: What is your OS?

- macOS
- Linux
- Windows (PowerShell)
- Windows (Command Prompt)

---

## Personalized Setup Plans

### Plan A: "I want to find or remove PII" (Options 1, 2, 8)

**Requires:** Docker only — no API account needed!

```bash
# Step 1: Install Docker Desktop (if not installed)
# https://www.docker.com/products/docker-desktop

# Step 2: Clone Protegrity AI Developer Edition
git clone https://github.com/Protegrity-AI-Developer-Edition/protegrity-ai-developer-edition.git
cd protegrity-ai-developer-edition/data-discovery

# Step 3: Start the Data Discovery service
docker compose up -d

# Step 4: Wait ~20 seconds, then verify
curl http://localhost:8580/health
# Expected: {"status":"UP"}

# Step 5: In Cursor, run:
# Command Palette → Protegrity: Status Check
# ✅ Data Discovery API: Connected
```

**You can now use:**
- `Protegrity: Analyze Data Sensitivity`
- `Protegrity: Redact Sensitive Data`
- `Protegrity: Find and Redact`

---

### Plan B: "I want to tokenize data" (Option 3, 7)

**Requires:** Protegrity API account + Python SDK (no Docker needed for tokenization)

```bash
# Step 1: Register for free at
# https://www.protegrity.com/developers/dev-edition-api
# → You receive: Email, Password, API Key

# Step 2: Install Python SDK
pip install protegrity-ai-developer-python

# Step 3a: Set credentials — macOS / Linux
export DEV_EDITION_EMAIL='your-email@company.com'
export DEV_EDITION_PASSWORD='your-password'
export DEV_EDITION_API_KEY='your-api-key'

# Step 3b: Set credentials — Windows PowerShell
$env:DEV_EDITION_EMAIL = 'your-email@company.com'
$env:DEV_EDITION_PASSWORD = 'your-password'
$env:DEV_EDITION_API_KEY = 'your-api-key'

# Step 3c: Set credentials — Windows Command Prompt (persistent)
setx DEV_EDITION_EMAIL "your-email@company.com"
setx DEV_EDITION_PASSWORD "your-password"
setx DEV_EDITION_API_KEY "your-api-key"

# Step 4: RESTART Cursor (reads env vars at startup)

# Step 5: Verify
# Command Palette → Protegrity: Status Check
# ✅ Protection API (Cloud): Connected
```

**You can now use:**
- `Protegrity: Protect Text`
- `Protegrity: Unprotect Text`

---

### Plan C: "I want to scan conversation risk" (Option 4)

**Requires:** Docker with Data Discovery + Semantic Guardrail services

```bash
# Step 1: Start Data Discovery (required dependency)
cd protegrity-ai-developer-edition/data-discovery
docker compose up -d

# Step 2: Start Semantic Guardrail
cd ../semantic-guardrail
docker compose up -d

# Step 3: Verify
curl http://localhost:8581/health
# Expected: {"status":"UP"}

# Step 4: Verify in Cursor
# Command Palette → Protegrity: Status Check
# ✅ Semantic Guardrail API: Connected
```

**You can now use:**
- `Protegrity: Scan Conversation Risk`

---

### Plan D: "I want synthetic data" (Option 5)

**Requires:** Docker with Synthetic Data service

```bash
cd protegrity-ai-developer-edition/synthetic-data
docker compose up -d

# Verify
curl http://localhost:8095/health

# Command Palette → Protegrity: Status Check
# ✅ Synthetic Data API: Connected
```

**You can now use:**
- `Protegrity: Generate Synthetic Data`

---

### Plan E: "I want to anonymize data" (Option 6)

**Requires:** Docker with Anonymization service

```bash
cd protegrity-ai-developer-edition/anonymization
docker compose up -d

# Verify
curl http://localhost:8085/health

# Command Palette → Protegrity: Status Check
# ✅ Anonymization API: Connected
```

**You can now use:**
- `Protegrity: Anonymize Data`

---

### Plan F: Full Setup (Option 10)

**Requires:** Docker + API account

```bash
# Start all Docker services
cd protegrity-ai-developer-edition
cd data-discovery    && docker compose up -d && cd ..
cd semantic-guardrail && docker compose up -d && cd ..
cd synthetic-data    && docker compose up -d && cd ..
cd anonymization     && docker compose up -d && cd ..

# Set API credentials (see Plan B above)

# Restart Cursor

# Verify everything
# Command Palette → Protegrity: Status Check
# All services should show ✅
```

---

## After Setup: Your First Command

Once setup is done, try your first command:

1. Open any file in Cursor that contains sample data
2. Select a line of text (e.g., `Name: John Smith, email: john@example.com`)
3. Open Command Palette → type `Protegrity: Analyze Data Sensitivity`
4. See the detected PII with confidence scores!

---

## Getting Help

- **Status Check**: `Protegrity: Status Check` in Command Palette
- **Full setup guide**: [SETUP.md](./SETUP.md)
- **Feature prerequisites**: [PREREQUISITES.md](./PREREQUISITES.md)
- **Quick reference**: [QUICK_START.md](./QUICK_START.md)
- **Protegrity docs**: https://developer.docs.protegrity.com/
- **Community**: https://github.com/orgs/Protegrity-AI-Developer-Edition/discussions
