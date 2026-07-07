---
name: generate-synthetic-data
description: Generate realistic, privacy-safe synthetic datasets that mimic real data without exposing actual personal information.
---

# 🧪 Generate Synthetic Data

Create privacy-preserving test data that looks real but contains no actual personal information. Perfect for development, testing, and sharing across teams.

---

## 👋 New Here? Start Here!

**Synthetic data generation lets you:**
- Build and test features using realistic-looking data
- Share datasets with teammates without leaking real customer info
- Train ML models without privacy risk
- Fill databases for demos and QA

**No API account needed — just Docker!**

---

## ✅ Prerequisites Check

| Requirement | Status Check | How to Get It |
|---|---|---|
| Docker Desktop | `docker --version` | https://www.docker.com/products/docker-desktop |
| Synthetic Data service | `curl http://localhost:8095/health` | See Quick Setup below |
| Python 3.11+ | `python3 --version` | https://python.org/downloads |

⏱️ **Setup Time**: ~10 minutes (first time only)

---

## 🚀 Quick Setup (First Time)

```bash
# Step 1: Clone Protegrity AI Developer Edition
git clone https://github.com/Protegrity-AI-Developer-Edition/protegrity-ai-developer-edition.git
cd protegrity-ai-developer-edition

# Step 2: Start the Synthetic Data service
cd synthetic-data
docker compose up -d

# Step 3: Confirm it is running (wait ~30 seconds after starting)
curl http://localhost:8095/health
# Expected: {"status":"UP"} or similar OK response

# Step 4: Verify in Cursor
# Open Command Palette → Protegrity: Status Check
# Should show: ✅ Synthetic Data API: Connected
```

---

## Steps

1. Provide a sample of your real data **or** describe the schema (column names + data types).
2. Specify how many synthetic records you need.
3. Run the generate-synthetic-data command.
4. The command calls the Protegrity Synthetic Data API.
5. Review the generated dataset — it mirrors your real data's structure and statistics.
6. Use it freely in development, testing, or training pipelines.

---

## Example

**Input schema:**
```json
{
  "schema": [
    {"name": "full_name",    "type": "PERSON"},
    {"name": "email",        "type": "EMAIL_ADDRESS"},
    {"name": "phone",        "type": "PHONE_NUMBER"},
    {"name": "account_id",   "type": "ACCOUNT_NUMBER"},
    {"name": "signup_date",  "type": "DATE"},
    {"name": "balance",      "type": "FLOAT", "range": [0, 10000]}
  ],
  "count": 100
}
```

**Output (sample rows):**
```
full_name          | email                        | phone        | account_id  | signup_date | balance
-------------------|------------------------------|--------------|-------------|-------------|--------
Maria Gomez        | mgomez_synth@example.net     | 555-204-7831 | ACC-00129   | 2023-04-12  | 4821.50
David Nakamura     | d.nakamura_synth@mail.io     | 555-813-9047 | ACC-00847   | 2022-11-30  | 892.00
```

> All values are **completely synthetic** — no real personal data is used.

---

## Supported Data Types

| Type | Description |
|------|-------------|
| `PERSON` | Realistic full names |
| `EMAIL_ADDRESS` | Valid-format email addresses |
| `PHONE_NUMBER` | Formatted phone numbers |
| `SOCIAL_SECURITY_ID` | SSN-format identifiers |
| `CREDIT_CARD_NUMBER` | Card number patterns |
| `DATE` / `DATE_OF_BIRTH` | Date values |
| `ADDRESS` | Street addresses |
| `ACCOUNT_NUMBER` | Account identifiers |
| `IP_ADDRESS` | IPv4 / IPv6 addresses |
| `INTEGER` / `FLOAT` | Numeric ranges |
| `CATEGORICAL` | Custom value sets |

---

## API Reference

**Endpoint:** `POST http://localhost:8095/pty/syntheticdata/v2/generate`

**Request:**
```json
{
  "schema": [
    {"name": "field_name", "type": "ENTITY_TYPE"}
  ],
  "count": 50,
  "format": "json",
  "preserve_distributions": true
}
```

**Response:**
```json
{
  "records": [...],
  "count": 50,
  "generation_id": "gen-abc123"
}
```

---

## Common Issues

| Problem | Solution |
|---------|----------|
| ❌ "Connection refused on port 8095" | Run `docker compose up -d` in `synthetic-data/` folder |
| ❌ "Service not healthy" | Wait 30 seconds after starting, then retry `curl http://localhost:8095/health` |
| ❌ "Unknown type" error | Check supported types list above; use closest match |
| ❌ "Docker not found" | Install Docker Desktop from https://www.docker.com/products/docker-desktop |

---

## Best Practices

1. **Use for all testing** — never use real customer data in dev/test environments
2. **Preserve distributions** — set `preserve_distributions: true` for realistic statistical patterns
3. **Validate output** — spot-check that generated data looks realistic for your domain
4. **Version your schemas** — store schema definitions so tests are reproducible
5. **Combine with redaction** — if starting from real data, redact first, then generate synthetic variants

---

## 📖 Full Guide

See [PREREQUISITES.md - Generate Synthetic Data](../PREREQUISITES.md#6-generate-synthetic-data) for complete setup, advanced options, and troubleshooting.
