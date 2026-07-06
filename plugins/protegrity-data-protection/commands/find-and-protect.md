---
name: find-and-protect
description: Discover PII in text and automatically protect all found entities using Protegrity tokenization — a combined one-step workflow.
---

# Find and Protect

The most powerful workflow: automatically discover ALL sensitive data in your text and protect every entity in one step. No manual selection needed.

## What it Does

1. **Discover** — Scans text using the Classification API to find all PII entities
2. **Protect** — Tokenizes each discovered entity using the Protection API
3. **Return** — Gives you back the text with all PII replaced by tokens

This mirrors the `find-and-protect` solution in Protegrity AI Developer Edition.

## Prerequisites Check

✅ **Docker + Data Discovery service** — REQUIRED (for the classify step)
```bash
cd protegrity-ai-developer-edition/data-discovery
docker compose up -d
```

✅ **Protegrity API Account** — REQUIRED (for the protect step)
- Sign up: https://www.protegrity.com/developers/dev-edition-api
- Set: `DEV_EDITION_EMAIL`, `DEV_EDITION_PASSWORD`, `DEV_EDITION_API_KEY`

✅ **Python 3.11+ with SDK** — REQUIRED
```bash
pip install protegrity-ai-developer-python
```

⏱️ **Setup Time**: ~15 minutes (both tracks needed)

---

## How to Use

1. Select or paste text containing sensitive data
2. Run "Protegrity: Find and Protect" from the Command Palette
3. The plugin automatically:
   - Scans for PII
   - Protects each entity
   - Returns the protected version
4. Use the returned text safely in AI prompts, logs, or APIs

## Example

**Input:**
```
Customer John Smith (john@example.com, SSN: 123-45-6789) requested a refund.
```

**Output:**
```
Customer <token_name> (<token_email>, SSN: <token_ssn>) requested a refund.
```

## Common Issues

| Issue | Solution |
|-------|----------|
| ❌ "Cannot connect to Classification API" | Start data-discovery service with Docker Compose |
| ❌ "Protect failed after classify succeeded" | Verify DEV_EDITION_* credentials are set and valid |
| ❌ "No entities found" | Lower threshold or test with obvious PII like email + SSN |

## Full Prerequisites Guide

📖 See [PREREQUISITES.md](../PREREQUISITES.md#find-and-protect-command) for complete setup.
