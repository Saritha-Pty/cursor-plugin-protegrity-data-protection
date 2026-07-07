---
name: find-and-protect
description: Discover PII in text, then automatically tokenize all detected entities in a single step.
---

# 🔗 Find and Protect

A two-in-one command: **finds** all sensitive data in your text and immediately **tokenizes** it using Protegrity's enterprise protection. Authorized users can later unprotect the tokens to recover originals.

> **Why use this instead of running both commands separately?**
> This command chains data discovery → tokenization in one guided flow, showing you exactly what was found and protected.

---

## 👋 New Here? Start Here!

**Use Find and Protect when you want to:**
- Prepare data for AI prompts without leaking PII to the LLM
- Store user data securely in your database
- Share data with third parties while retaining ability to recover originals
- Build tokenized data pipelines

**Requires both Docker (discovery) and a Protegrity API account (tokenization).**

---

## ✅ Prerequisites Check

| Requirement | Status Check | How to Get It |
|---|---|---|
| Docker Desktop | `docker --version` | https://www.docker.com/products/docker-desktop |
| Data Discovery service | `curl http://localhost:8580/health` | Clone repo, `cd data-discovery && docker compose up -d` |
| Protegrity API account | `echo $DEV_EDITION_API_KEY` | Register free at https://www.protegrity.com/developers/dev-edition-api |
| Python SDK | `python3 -c "import appython"` | `pip install protegrity-ai-developer-python` |

⏱️ **Setup Time**: ~15 minutes (first time only)

---

## 🚀 Quick Setup (First Time)

### Part A: Docker (for data discovery)
```bash
git clone https://github.com/Protegrity-AI-Developer-Edition/protegrity-ai-developer-edition.git
cd protegrity-ai-developer-edition/data-discovery
docker compose up -d
curl http://localhost:8580/health  # Verify: should return OK
```

### Part B: API account (for tokenization)
```bash
# 1. Register free at https://www.protegrity.com/developers/dev-edition-api
#    You will receive: Email, Password, API Key

# 2. Install the Python SDK
pip install protegrity-ai-developer-python

# 3. Set your credentials
# Linux / macOS:
export DEV_EDITION_EMAIL='your-email@company.com'
export DEV_EDITION_PASSWORD='your-password'
export DEV_EDITION_API_KEY='your-api-key'

# Windows PowerShell:
$env:DEV_EDITION_EMAIL = 'your-email@company.com'
$env:DEV_EDITION_PASSWORD = 'your-password'
$env:DEV_EDITION_API_KEY = 'your-api-key'

# 4. Restart Cursor (Cursor reads env vars at startup)
```

### Verify both parts
```
Open Cursor Command Palette → Protegrity: Status Check
Should show:
  ✅ Data Discovery API: Connected
  ✅ Protection API (Cloud): Connected
```

---

## Steps

1. Select text or provide input containing sensitive data.
2. Run the find-and-protect command.
3. The command **discovers** all PII entities with confidence scores.
4. You review the detected entities and confirm which to protect.
5. The command **tokenizes** each confirmed entity via the Protegrity API.
6. You receive the output with all PII replaced by secure tokens.
7. Store or use the tokenized output safely — original data is protected.

---

## Example

**Input:**
```
Customer: John Smith
Email: john.smith@acmecorp.com
SSN: 123-45-6789
Phone: 555-987-6543
```

**Step 1 — Discovered entities:**
```
✅ PERSON:             John Smith         (confidence: 0.98)
✅ EMAIL_ADDRESS:      john.smith@...     (confidence: 0.99)
✅ SOCIAL_SECURITY_ID: 123-45-6789        (confidence: 0.99)
✅ PHONE_NUMBER:       555-987-6543       (confidence: 0.97)

Confirm protection? [Y/n]
```

**Step 2 — Protected output:**
```
Customer: <pty_tok_a1b2c3>
Email: <pty_tok_d4e5f6>
SSN: <pty_tok_g7h8i9>
Phone: <pty_tok_j0k1l2>
```

> Each token can only be reversed by an authorized user using the **Unprotect Text** command.

---

## Common Issues

| Problem | Solution |
|---------|----------|
| ❌ "Cannot connect to Classification API" | Start data-discovery service: `docker compose up -d` |
| ❌ "DEV_EDITION_API_KEY not set" | Set env vars (Part B above) and restart Cursor |
| ❌ "401 Unauthorized" | Check credentials at https://www.protegrity.com/developers/dev-edition-api |
| ❌ "No entities detected" | Lower classification threshold in config.json to 0.5 |
| ❌ "SDK not found" | Run `pip install protegrity-ai-developer-python` |

---

## Next Steps After Protection

- Use **Unprotect Text** command to recover originals for authorized workflows
- Use **Analyze Data Sensitivity** to verify no PII remains in outputs
- Enable audit logging in config.json to track all protection operations

---

## 📖 Full Guide

See [PREREQUISITES.md](../PREREQUISITES.md) for complete setup instructions for both Docker and API account requirements.
