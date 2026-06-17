---
name: data-discovery
description: Discover and enumerate PII entities in unstructured text using Protegrity classification APIs.
---

# Data Discovery

Use this skill to identify and analyze personally identifiable information in your text.

## When to use

- Before sending user input to AI models
- When analyzing logs or data samples
- During security audits of workflows
- When preparing data for external processing

## Instructions

1. Select or provide the text to analyze.
2. The skill will call Protegrity's data discovery API to classify and detect entities.
3. Review the detected entities with confidence scores.
4. Decide on appropriate protection method (mask, redact, or protect).
5. Apply the chosen protection before using the data in AI workflows.

## Supported Entity Types

- PERSON
- LOCATION
- SOCIAL_SECURITY_ID
- PHONE_NUMBER
- EMAIL_ADDRESS
- CREDIT_CARD_NUMBER
- AGE
- USERNAME
- IP_ADDRESS
- ACCOUNT_NUMBER
- PASSPORT_NUMBER
- DRIVER_LICENSE_NUMBER

For the complete list, refer to [Supported Classification Entities](https://developer.docs.protegrity.com/docs/entities/).
