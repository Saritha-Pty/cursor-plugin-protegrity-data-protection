---
name: redact-sensitive-data
description: Remove sensitive data by replacing PII with masking characters.
---

# Redact Sensitive Data

Remove sensitive information by replacing detected PII with masking characters.

## Prerequisites Check

Before using this command, ensure you have:

✅ **Classification API** - REQUIRED
- Option A: Docker running with `docker compose up -d classification-service` (local)
- Option B: Cloud API access (automatic)

✅ **Python 3.9+** - REQUIRED
- Verify: `python3 --version`

✅ **Entity Mappings** - REQUIRED
- Check in config.json > named_entity_map
- Contains entity types you want to redact

✅ **Masking Configuration** - RECOMMENDED
- Default masking character: "#"
- Adjust in: Settings → Protegrity → Masking Character

⏱️ **Setup Time**: ~5 minutes

### Quick Setup (First Time)
```bash
# If using Docker (recommended for first-time users):
docker compose up -d classification-service
docker compose logs classification-service  # Verify it's running

# If using Cloud API:
# No setup needed - just use the command
```

### Configure Masking (Optional)
In Cursor Settings:
1. Search for "Protegrity"
2. Set "Masking Character" to: # (or *, X, etc.)
3. Default masking method: "redact"

### Status Check
Run this in Cursor Command Palette:
```
Protegrity: Status Check
```
Should show: ✅ Classification API: Connected

---

## How It Works

1. Text is analyzed for PII using Classification API
2. Detected entities are replaced with masking character
3. Original data location is preserved for readability
4. Output shows which entities were redacted

## Example

**Before:**
```
Contact John Smith at 555-1234 or john@example.com
SSN: 123-45-6789
```

**After (with masking character: #):**
```
Contact #### ##### at #########  or ################
SSN: ###########
```

**Alternative masking** (with character: *):**
```
Contact **** ***** at *********  or ****############
SSN: ***********
```

## Configuration Options

In config.json or Settings:
```json
{
  "method": "redact",           // redact, mask, or tokenize
  "masking_char": "#",          // Character to use: #, *, X, etc.
  "named_entity_map": {
    "PERSON": "PERSON",
    "EMAIL_ADDRESS": "EMAIL",
    "PHONE_NUMBER": "PHONE",
    "SOCIAL_SECURITY_ID": "SSN",
    // ... add more entities
  }
}
```

## Common Issues

| Issue | Solution |
|-------|----------|
| ❌ "Cannot connect to Classification API" | Run: `docker compose up -d classification-service` |
| ❌ "No entities redacted" | Adjust classification_score_threshold lower (try 0.5 instead of 0.6) |
| ❌ "Wrong entities redacted" | Update entity_map in config.json for your domain |
| ❌ "Service timeout" | Reduce input text size or increase service resources |

## Best Practices

1. **Review redacted content** - Ensure sensitive data is properly masked
2. **Choose appropriate character** - Use # for passwords, * for names, X for IDs
3. **Customize entity map** - Add domain-specific entities (medical codes, account IDs, etc.)
4. **Test with samples** - Try on small datasets first before processing large files

## Full Prerequisites Guide

📖 See [PREREQUISITES.md - Redact Sensitive Data](../PREREQUISITES.md#4-redact-sensitive-data-command) for:
- Complete setup instructions
- Entity mapping configuration
- Masking methods comparison
- Verification steps
- Advanced troubleshooting
