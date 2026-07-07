---
name: data-redaction
description: Remove or hide sensitive data after the customer reviews what was found.
---

# Data Redaction

Use this skill when the customer wants to remove or mask sensitive information from text.

## Customer goal

Help the customer safely share or store text with sensitive values removed or hidden.

## When to use

- Before sharing text outside the team
- Before logging content
- Before storing prompts or responses
- When the customer asks to hide sensitive values

## What the customer needs

- Docker Desktop
- Protegrity AI Developer Edition local data discovery service

## What this skill should do

1. Let the customer choose redact or mask.
2. Use the discovery results to find sensitive values.
3. Apply the selected redaction method.
4. Show the sanitized output.
5. Tell the customer what changed in plain language.

## Guidance

- **Redact** means remove the value.
- **Mask** means replace it with a visible placeholder.
- Keep the customer in control of the final output.
