---
name: redact-sensitive-data
description: Find and redact sensitive data in selected text using Protegrity classification APIs.
---

# Redact Sensitive Data

Automatically remove detected PII from your text.

## Steps

1. Select the text containing sensitive data.
2. Run the redact-sensitive-data command.
3. Specify redaction method:
   - **Remove**: Delete the entity completely
   - **Mask**: Replace with # characters
4. Choose entity types to target (PERSON, EMAIL, PHONE, SSN, etc.).
5. Review the redacted output.
6. Apply or save the results.

## Usage Example

**Input:**
```
John Smith called 555-1234 about his order.
```

**Output (redacted):**
```
[PERSON] called [PHONE] about his order.
```

**Output (masked):**
```
### ##### called #### redacted #### about his order.
```

## Configuration

Customize in config.json:
- `method`: "redact" or "mask"
- `masking_char`: Character for masking (default "#")
- `classification_score_threshold`: Minimum confidence (0-1)
- `named_entity_map`: Custom entity labels
