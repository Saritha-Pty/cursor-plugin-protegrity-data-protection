---
name: data-protection
description: Protect and unprotect sensitive data using Protegrity tokenization workflows.
---

# Data Protection

Use this skill when the customer wants reversible protection using tokenization.

## Customer goal

Help the customer protect sensitive values so they can be restored later by an authorized user.

## When to use

- When the customer wants tokenization
- When the customer needs to restore a protected value
- When a workflow must keep data usable but protected

## What the customer needs

- Protegrity AI Developer Edition account
- `DEV_EDITION_EMAIL`
- `DEV_EDITION_PASSWORD`
- `DEV_EDITION_API_KEY`
- Official Protegrity Developer Edition SDK installed

## What this skill should do

1. Ask whether the customer wants to protect or unprotect.
2. Confirm the required environment variables are set.
3. Use the official Developer Edition protection flow.
4. Show the result in a simple message.
5. Explain that the customer must keep the token safe.

## Notes

- Keep credentials out of source control.
- This workflow is only for the tokenization feature.
