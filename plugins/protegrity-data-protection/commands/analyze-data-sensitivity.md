---
name: analyze-data-sensitivity
description: Analyze selected text to identify sensitive data and recommend protection methods.
---

# Analyze Data Sensitivity

Get recommendations on how to protect your data.

## Prerequisites Check

Before using this command, ensure you have:

✅ **Classification API** - REQUIRED
- Option A: Docker running with `docker compose up -d classification-service` (local)
- Option B: Cloud API access (automatic)

✅ **Python 3.9+** - REQUIRED
- Verify: `python3 --version`

✅ **Entity Mappings** - RECOMMENDED
- Check in config.json > named_entity_map
- Contains entity types you want to detect (PERSON, EMAIL, PHONE, etc.)

✅ **Configuration Threshold** - OPTIONAL
- Default: 0.6 (sensitivity score threshold)
- Adjust in: Settings → Protegrity → Classification Threshold

⏱️ **Setup Time**: ~5 minutes

### Quick Setup (First Time)
```bash
# If using Docker (recommended for first-time users):
docker compose up -d classification-service
docker compose logs classification-service  # Verify it's running

# If using Cloud API:
# No setup needed - just use the command
```

### Status Check
Run this in Cursor Command Palette:
```
Protegrity: Status Check
```
Should show: ✅ Classification API: Connected

---

## Steps

1. Select text or provide data snippet.
2. Run the analyze-data-sensitivity command.
3. The command performs classification and entity detection.
4. Receive a sensitivity assessment with:
   - Detected entity types and confidence scores
   - Sensitivity classification (public, internal, sensitive, restricted)
   - Recommended protection methods
   - Compliance implications
5. Choose appropriate protection based on recommendations.

## Output Includes

- **Entity Detection**: All PII found with locations and confidence
- **Sensitivity Level**: Based on entity types and data context
- **Recommended Protection**:
  - Public data: No protection needed
  - Internal data: Masking recommended
  - Sensitive data: Tokenization or redaction recommended
  - Restricted data: Full encryption or deletion required
- **Compliance Notes**: Relevant regulations (GDPR, CCPA, HIPAA)

## Example

```
Input: Patient John Smith (SSN: 123-45-6789) diagnosed with diabetes

Detected Entities:
- PERSON: John Smith (confidence: 0.98)
- SOCIAL_SECURITY_ID: 123-45-6789 (confidence: 0.99)
- HEALTH_CONDITION: diabetes (confidence: 0.95)

Sensitivity Level: RESTRICTED (due to health data + PII)
Recommended Protection: Tokenization + Encryption
Compliance: HIPAA, GDPR, CCPA
```

## Common Issues

| Issue | Solution |
|-------|----------|
| ❌ "Cannot connect to Classification API" | Run: `docker compose up -d classification-service` |
| ❌ "No entities detected" | Text may not contain detectable PII; try: "Contact John at john@example.com" |
| ❌ "Service timeout" | Increase classification threshold in Settings (try 0.5 instead of 0.6) |

## Full Prerequisites Guide

📖 See [PREREQUISITES.md - Analyze Data Sensitivity](../PREREQUISITES.md#1-analyze-data-sensitivity-command) for:
- Complete setup instructions
- Docker vs Cloud API comparison
- Verification steps
- Advanced configuration
- Troubleshooting details
