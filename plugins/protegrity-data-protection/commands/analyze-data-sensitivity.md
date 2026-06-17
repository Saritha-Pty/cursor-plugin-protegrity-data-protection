---
name: analyze-data-sensitivity
description: Analyze selected text to identify sensitive data and recommend protection methods.
---

# Analyze Data Sensitivity

Get recommendations on how to protect your data.

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
