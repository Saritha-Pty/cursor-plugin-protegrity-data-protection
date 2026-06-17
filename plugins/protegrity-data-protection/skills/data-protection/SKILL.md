---
name: data-protection
description: Protect and unprotect sensitive data using Protegrity's tokenization-style protection APIs.
---

# Data Protection (Tokenization)

Use this skill for enterprise-grade data protection with reversible tokenization.

## When to use

- When you need to preserve data structure while protecting values
- For secure token-based workflows
- When authorized users need to unprotect data later
- For compliance with data minimization requirements

## Instructions

### Protect Data

1. Set environment variables for authentication:
   - `DEV_EDITION_EMAIL`: Registration email
   - `DEV_EDITION_PASSWORD`: Provided password
   - `DEV_EDITION_API_KEY`: Provided API key
2. Select the sensitive data to protect.
3. Specify the policy user and data element type.
4. The API will return a protected token.
5. Use the token in workflows; original data remains secure.

### Unprotect Data

1. Provide the protected token.
2. Confirm you have authorization to unprotect.
3. The API will return the original data.
4. Use with caution; log all unprotection operations.

## Policy Users and Data Elements

For current roles, users, and data element definitions, refer to [Understanding Users and Roles](https://developer.docs.protegrity.com/docs/running/).
