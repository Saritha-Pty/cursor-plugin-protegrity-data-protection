---
name: anonymize-data
description: Anonymize sensitive fields in datasets. Preserves data utility and statistical patterns while permanently removing identifiers.
---

# 🕵️ Anonymize Data

Transform sensitive datasets so they can be used, shared, and analyzed safely — without any personally identifiable information.

> **Anonymization vs Redaction vs Tokenization:**
> - **Redaction** — removes PII entirely (data is lost)
> - **Tokenization** — replaces PII with a reversible token (authorized users can recover original)
> - **Anonymization** — replaces PII with realistic-but-fake values that preserve statistical patterns (irreversible by design)

---

## 👋 New Here? Start Here!

**Use anonymization when you want to:**
- Share datasets externally (vendors, partners, researchers)
- Publish demo or sample data
- Comply with GDPR "right to be forgotten" requirements
- Reduce privacy risk in analytics pipelines

**No API account needed — just Docker!**

---

## ✅ Prerequisites Check

| Requirement | Status Check | How to Get It |
|---|---|---|
| Docker Desktop | `docker --version` | https://www.docker.com/products/docker-desktop |
| Anonymization service | `curl http://localhost:8085/health` | See Quick Setup below |
| Python 3.11+ | `python3 --version` | https://python.org/downloads |

⏱️ **Setup Time**: ~10 minutes (first time only)

---

## 🚀 Quick Setup (First Time)

```bash
# Step 1: Clone Protegrity AI Developer Edition
git clone https://github.com/Protegrity-AI-Developer-Edition/protegrity-ai-developer-edition.git
cd protegrity-ai-developer-edition

# Step 2: Start the Anonymization service
cd anonymization
docker compose up -d

# Step 3: Confirm it is running (wait ~30 seconds after starting)
curl http://localhost:8085/health
# Expected: {"status":"UP"} or similar OK response

# Step 4: Verify in Cursor
# Open Command Palette → Protegrity: Status Check
# Should show: ✅ Anonymization API: Connected
```

---

## Steps

1. Provide the text or dataset you want to anonymize.
2. Specify which fields contain sensitive data (or let the service auto-detect).
3. Run the anonymize-data command.
4. The command calls the Protegrity Anonymization API.
5. Review the anonymized output — PII is replaced with realistic-but-fake values.
6. Use the anonymized data safely in any environment.

---

## Example

**Before anonymization:**
```
Name: Sarah Johnson
Email: sarah.johnson@acmecorp.com
Phone: 415-555-0178
DOB: 1985-03-22
Address: 123 Oak Street, San Francisco, CA 94110
```

**After anonymization:**
```
Name: Emily Robertson
Email: e.robertson_anon@placeholder.net
Phone: 415-555-0294
DOB: 1987-07-14
Address: 456 Maple Avenue, Oakland, CA 94601
```

> The anonymized values are realistic and preserve format, but cannot be traced back to Sarah Johnson.

---

## Anonymization Methods

| Method | What it does | Use case |
|--------|-------------|---------|
| `pseudonymization` | Replace with consistent fake values (same input → same output per session) | Analytics, joins across tables |
| `generalization` | Replace with a broader category (e.g., exact age → age range) | Statistical analysis |
| `suppression` | Remove the field entirely | When the field is not needed |
| `noise_addition` | Add random noise to numeric values | Numeric data, financial records |
| `data_masking` | Partially hide values (e.g., `john@*****.com`) | Display purposes |

---

## API Reference

**Endpoint:** `POST http://localhost:8085/pty/anonymization/v3/anonymize`

**Request:**
```json
{
  "text": "Sarah Johnson, email sarah@example.com, SSN 123-45-6789",
  "method": "pseudonymization",
  "entity_types": ["PERSON", "EMAIL_ADDRESS", "SOCIAL_SECURITY_ID"]
}
```

**Response:**
```json
{
  "anonymized_text": "Emily Robertson, email e.robertson@placeholder.net, SSN ###-##-####",
  "entities_anonymized": [
    {"type": "PERSON", "original_span": [0, 13], "method": "pseudonymization"},
    {"type": "EMAIL_ADDRESS", "original_span": [22, 40], "method": "pseudonymization"},
    {"type": "SOCIAL_SECURITY_ID", "original_span": [47, 58], "method": "suppression"}
  ]
}
```

---

## Common Issues

| Problem | Solution |
|---------|----------|
| ❌ "Connection refused on port 8085" | Run `docker compose up -d` in `anonymization/` folder |
| ❌ "Service not healthy" | Wait 30 seconds after starting, then retry `curl http://localhost:8085/health` |
| ❌ "Entity type not recognized" | Check supported types in analyze-data-sensitivity command |
| ❌ Docker not installed | Install Docker Desktop: https://www.docker.com/products/docker-desktop |

---

## Best Practices

1. **Irreversibility** — anonymization is intentionally one-way; use tokenization if you need to recover originals
2. **Consistency** — use `pseudonymization` method when the same person appears across multiple records
3. **Test with samples** — verify anonymized output before processing full datasets
4. **Combine with analysis** — run analyze-data-sensitivity first to discover all PII fields
5. **Document your method** — record which anonymization method was applied for compliance audit trail

---

## 📖 Full Guide

See [PREREQUISITES.md - Anonymize Data](../PREREQUISITES.md#7-anonymize-data) for complete setup, method comparisons, and troubleshooting.
