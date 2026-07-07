---
name: data-discovery
description: Discover and classify sensitive data, then guide the next Protegrity action.
---

# Data Discovery

Use this skill when the customer wants to find sensitive data in text, code, logs, or documents.

## Customer goal

Help the customer identify what kind of sensitive data is present, then suggest the next action:
- redact or mask it
- protect it with tokenization
- review conversation risk

## When to use

- Before sending text to an AI model
- When reviewing code, logs, or prompts
- When preparing content for sharing
- When the customer wants to know what sensitive data exists

## What the customer needs

- Docker Desktop
- Protegrity AI Developer Edition local data discovery service

## What this skill should do

1. Ask the customer to provide or select the text.
2. Classify the text using the Developer Edition data discovery service.
3. Show the sensitive entity types found.
4. Keep the explanation short and clear.
5. Offer the next best step in customer language.

## Supported entity examples

- PERSON
- LOCATION
- EMAIL_ADDRESS
- PHONE_NUMBER
- SOCIAL_SECURITY_ID
- CREDIT_CARD_NUMBER
- USERNAME
- IP_ADDRESS
- ACCOUNT_NUMBER
- PASSPORT_NUMBER
- DRIVER_LICENSE_NUMBER

For the full list, see the Protegrity Developer Edition docs.
