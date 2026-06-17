---
name: semantic-guardrails
description: Evaluate conversation risk and PII exposure in multi-turn AI interactions.
---

# Semantic Guardrails

Use this skill to apply guardrails to GenAI conversations and detect privacy risks.

## When to use

- Before sending multi-turn conversations to LLMs
- When evaluating chatbot interactions for PII exposure
- During security assessment of AI workflows
- For continuous monitoring of conversation risk

## Instructions

1. Provide the conversation messages (multi-turn).
2. The skill calls Protegrity's semantic guardrail API.
3. Receive message-level risk scores and PII detection results.
4. Receive conversation-level aggregated risk assessment.
5. Take appropriate action (block, redact, or allow) based on risk thresholds.

## Risk Scoring

- **Message Risk Score**: Evaluates individual messages for:
  - Sensitive data exposure
  - Prompt injection risks
  - Compliance violations

- **Conversation Risk Score**: Aggregates across multi-turn exchanges:
  - Cumulative PII exposure
  - Pattern-based risk detection
  - Historical context analysis

## Configuration

Customize risk thresholds in your Protegrity configuration to trigger different actions.
