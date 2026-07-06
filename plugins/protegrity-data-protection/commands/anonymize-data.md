---
name: anonymize-data
description: Anonymize sensitive fields in datasets for privacy-preserving data processing using Protegrity Anonymization API.
---

# Anonymize Data

Remove or mask sensitive fields in datasets to create privacy-safe versions for sharing, training AI models, or third-party processing.

## What is Anonymization?

Anonymization permanently removes identifying information from datasets. Unlike tokenization (which is reversible), anonymization is one-way — it produces data safe to share externally without any ability to trace back to individuals. Use it for:
- Preparing datasets for AI model training
- Sharing data with third parties
- Complying with data minimization requirements (GDPR, CCPA)
- Creating safe test/staging data

## Prerequisites Check

✅ **Docker + Docker Compose** — REQUIRED
- Install: https://docs.docker.com/get-started/
- Verify: `docker --version && docker compose version`

✅ **Protegrity AI Developer Edition cloned** — REQUIRED
- Clone: `git clone https://github.com/Protegrity-AI-Developer-Edition/protegrity-ai-developer-edition.git`

✅ **Anonymization service running** — REQUIRED
```bash
cd protegrity-ai-developer-edition/anonymization
docker compose up -d
docker compose logs  # Verify: "Started" or "Running"
```
Service runs at: http://localhost:8085

✅ **Python 3.11+** — REQUIRED
- Verify: `python3 --version` (must show 3.11 or higher)

⏱️ **Setup Time**: ~10 minutes (first time)

### Status Check
```
Cmd+Shift+P → "Protegrity: Status Check"
```
Should show: ✅ Anonymization API: Connected

---

## How to Use

1. Prepare your dataset (CSV or JSON format)
2. Run the anonymize-data command from the Command Palette
3. The plugin calls the Anonymization API — **you don't need to write any code**
4. Download the anonymized version of your dataset

## Example

**Input:**
```
name,email,phone,age
John Smith,john@example.com,555-1234,34
Jane Doe,jane@example.com,555-5678,28
```

**Output (anonymized):**
```
name,email,phone,age
####,################,########,##
####,################,########,##
```

## Methods

| Method | What it does | When to use |
|--------|-------------|-------------|
| `redact` | Replaces PII with `#####` | Compliance, sharing externally |
| `mask` | Replaces with configurable char | Testing, staging data |

## Common Issues

| Issue | Solution |
|-------|----------|
| ❌ "Cannot connect to Anonymization API" | Run: `cd anonymization && docker compose up -d` |
| ❌ "Port 8085 in use" | Stop conflicting service: `lsof -i :8085` then kill it |
| ❌ "Docker not running" | Start Docker Desktop or run `sudo systemctl start docker` |

## Full Prerequisites Guide

📖 See [PREREQUISITES.md](../PREREQUISITES.md#anonymize-data-command) for complete setup.
