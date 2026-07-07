---
name: anonymization
description: Anonymize sensitive fields in datasets using Protegrity's anonymization API. Irreversible — preserves data utility without retaining identifiers.
---

# Anonymization

Use this skill to permanently anonymize personally identifiable information while preserving data structure, format, and statistical properties.

## When to use

- When sharing datasets externally (vendors, partners, researchers)
- For publishing sample or demo data
- When complying with GDPR right-to-erasure requirements
- When data recipients should never have access to original values
- For building analytics pipelines over non-identifiable data

## How it differs from other protection methods

| Method | Reversible? | Use case |
|--------|------------|---------|
| Anonymization | ❌ No | Share externally, publish, analytics |
| Redaction | ❌ No | Remove PII from logs, prompts |
| Tokenization (Protect) | ✅ Yes (authorized users) | Store data, authorized retrieval |

## Instructions

1. Provide the text or dataset to anonymize.
2. Specify the anonymization method:
   - `pseudonymization` — replace with consistent realistic fake values
   - `generalization` — replace with broader category (e.g., exact age → age range)
   - `suppression` — remove the field entirely
   - `noise_addition` — add random noise to numeric values
3. Optionally specify which entity types to anonymize, or let the API auto-detect.
4. The skill calls Protegrity's Anonymization API (`http://localhost:8085/pty/anonymization/v3`).
5. Review the anonymized output to verify all PII is replaced.
6. Use the result freely — it contains no identifiable information.

## Prerequisites

- Docker Desktop running
- Anonymization service started:
  ```bash
  cd protegrity-ai-developer-edition/anonymization
  docker compose up -d
  ```
- Service health check: `curl http://localhost:8085/health`

## Supported Entity Types

- PERSON, LOCATION, EMAIL_ADDRESS, PHONE_NUMBER
- SOCIAL_SECURITY_ID, CREDIT_CARD_NUMBER, ACCOUNT_NUMBER
- DATE_OF_BIRTH, IP_ADDRESS, USERNAME, PASSPORT_NUMBER
- DRIVER_LICENSE_NUMBER, MEDICAL_RECORD, BANK_ACCOUNT

## API Reference

**Endpoint:** `POST http://localhost:8085/pty/anonymization/v3/anonymize`

**Request body:**
```json
{
  "text": "John Smith, john@example.com, SSN 123-45-6789",
  "method": "pseudonymization",
  "entity_types": ["PERSON", "EMAIL_ADDRESS", "SOCIAL_SECURITY_ID"]
}
```

**Response:**
```json
{
  "anonymized_text": "Emily Robertson, e.robertson@placeholder.net, SSN ###-##-####",
  "entities_anonymized": [
    {"type": "PERSON", "method": "pseudonymization"},
    {"type": "EMAIL_ADDRESS", "method": "pseudonymization"},
    {"type": "SOCIAL_SECURITY_ID", "method": "suppression"}
  ]
}
```

## Notes

- Anonymization is **irreversible** by design
- Use `pseudonymization` when the same person appears in multiple records (ensures consistent replacement)
- For compliance documentation, record which method was applied and when
- Run `Protegrity: Status Check` to verify the Anonymization API is running before use
