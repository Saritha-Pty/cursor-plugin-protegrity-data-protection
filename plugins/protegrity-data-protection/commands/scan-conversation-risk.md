---
name: scan-conversation-risk
description: Evaluate conversation risk and detect PII exposure in multi-turn AI interactions.
---

# Scan Conversation Risk

Assess GenAI conversations for privacy and security risks.

## Steps

1. Provide a multi-turn conversation (user and assistant messages).
2. Run the scan-conversation-risk command.
3. The command calls Protegrity's semantic guardrail API.
4. Receive risk scores for each message and overall conversation.
5. Review detected PII and risk flags.
6. Take action: block, redact, or allow based on risk thresholds.

## Outputs

**Message-Level Risks:**
- Detected PII entities with confidence
- Risk score (0-1) for each message
- Specific risks (injection, compliance violation, etc.)

**Conversation-Level Summary:**
- Aggregate risk score
- Total PII exposure count
- Risk patterns identified
- Recommended actions

## Usage Example

**Input:**
```
User: Can you help me with my SSN 123-45-6789?
Assistant: I'll help you. What's your full name?
User: It's John Smith, email john@example.com
```

**Output:**
Risk Score: 0.92 (High)
Detected PII: SSN, Email, Person Name
Recommended Action: Redact or block
