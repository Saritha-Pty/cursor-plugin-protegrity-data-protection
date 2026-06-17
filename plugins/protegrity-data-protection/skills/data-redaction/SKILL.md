---
name: data-redaction
description: Find and redact or mask detected PII entities in text.
---

# Data Redaction

Use this skill to remove or mask sensitive information from your text.

## When to use

- Before logging or storing data
- When preparing text for display to users
- During data sanitization workflows
- When creating anonymized datasets

## Instructions

1. Select the text containing sensitive data.
2. Choose redaction method:
   - **Redact**: Remove the entity completely
   - **Mask**: Replace with configurable character (default: #)
3. Specify which entity types to target.
4. Review the redacted output before using.
5. Save or export the sanitized data.

## Configuration

Edit the Protegrity configuration to customize:

- `method`: "redact" or "mask"
- `masking_char`: Character for masking (default "#")
- `classification_score_threshold`: Minimum confidence score (0-1)
- `named_entity_map`: Custom entity type labels
