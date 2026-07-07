---
name: semantic-guardrails
description: Check prompts and conversations for risk before the customer sends them to an AI model.
---

# Semantic Guardrails

Use this skill when the customer wants to review prompt or conversation risk.

## Customer goal

Help the customer understand whether a prompt or conversation may contain sensitive content or risky instructions.

## When to use

- Before sending prompts to an AI model
- When reviewing an AI conversation
- When checking for privacy risks

## What the customer needs

- Docker Desktop
- Protegrity AI Developer Edition semantic guardrail service

## What this skill should do

1. Ask the customer for the prompt or conversation.
2. Scan it with the semantic guardrail service.
3. Summarize the risk clearly.
4. Recommend the next action the customer can take.

## Guidance

- Use short, plain-language results.
- Keep the customer in control of what gets sent to the model.
