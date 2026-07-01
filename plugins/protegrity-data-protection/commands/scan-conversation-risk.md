---
name: scan-conversation-risk
description: Evaluate conversation risk and detect PII exposure in multi-turn AI interactions.
---

# Scan Conversation Risk

Assess GenAI conversations for privacy and security risks.

## Prerequisites Check

Before using this command, ensure you have:

✅ **Semantic Guardrail API** - REQUIRED
- Option A: Docker running with `docker compose up -d semantic-guardrail-service` (local)
- Option B: Cloud API access (automatic)

✅ **Python 3.9+** - REQUIRED
- Verify: `python3 --version`

✅ **Risk Thresholds Configured** - RECOMMENDED
- Default: block=0.9, redact=0.7, warn=0.5, allow=0.0
- Adjust in: Settings → Protegrity → Risk Thresholds

✅ **Docker & Docker Compose** - OPTIONAL
- Only required if using local Docker-based guardrail service
- Verify: `docker --version && docker compose --version`

⏱️ **Setup Time**: ~5 minutes

### Quick Setup (First Time)

**Option A: Using Docker (Recommended for Development)**
```bash
# Clone Protegrity Developer Edition
git clone https://github.com/Protegrity-Developer-Edition/protegrity-developer-edition.git
cd protegrity-developer-edition

# Start Semantic Guardrail service
docker compose up -d semantic-guardrail-service

# Verify it's running
docker compose logs semantic-guardrail-service

# Service available at: http://localhost:8581
```

**Option B: Using Cloud API (No Setup Needed)**
- Just run the command - automatically connects to cloud service

### Configure Risk Thresholds (Optional)
In Cursor Settings or config.json:
```json
{
  "risk_thresholds": {
    "block": 0.9,      // Risk >= 0.9: Block message
    "redact": 0.7,     // Risk >= 0.7: Redact PII
    "warn": 0.5,       // Risk >= 0.5: Show warning
    "allow": 0.0       // Risk < 0.5: Allow
  }
}
```

### Status Check
Run this in Cursor Command Palette:
```
Protegrity: Status Check
```
Should show: ✅ Semantic Guardrail API: Connected

---

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
```
Risk Score: 0.92 (High) ⚠️
Detected PII: SSN, Email, Person Name
Message-Level Analysis:
  - User msg 1: Risk 0.95 (CRITICAL) - SSN exposed
  - Assistant msg 1: Risk 0.20 (LOW) - Safe response
  - User msg 2: Risk 0.88 (HIGH) - Multiple PII exposed

Recommended Action: REDACT or BLOCK
Compliance Concerns: GDPR, CCPA, HIPAA
```

## Risk Levels

| Risk Score | Level | Action | Color |
|-----------|-------|--------|-------|
| 0.9 - 1.0 | CRITICAL | Block | 🔴 Red |
| 0.7 - 0.9 | HIGH | Redact | 🟠 Orange |
| 0.5 - 0.7 | MEDIUM | Warn | 🟡 Yellow |
| 0.0 - 0.5 | LOW | Allow | 🟢 Green |

## Common Issues

| Issue | Solution |
|-------|----------|
| ❌ "Cannot connect to Guardrail API" | Run: `docker compose up -d semantic-guardrail-service` |
| ❌ "No risk detected" | Conversation contains no sensitive data - that's good! |
| ❌ "Service timeout" | Input may be too long; reduce conversation history |
| ❌ "Incorrect risk scores" | Adjust risk_thresholds in Settings |

## Best Practices

1. **Regular Monitoring** - Scan conversations regularly, especially with external users
2. **Set Appropriate Thresholds** - Adjust based on your organization's risk tolerance
3. **Review High-Risk** - Always review conversations flagged as HIGH or CRITICAL
4. **Enable Audit Logging** - Track risk assessment results for compliance
5. **Train Teams** - Help teams understand what constitutes risky data sharing

## Use Cases

- **Before sharing AI outputs** - Ensure no PII escapes to users
- **Customer support chats** - Monitor for accidental data disclosure
- **GenAI workflows** - Validate multi-turn conversations
- **Compliance audits** - Prove you're monitoring data exposure
- **Incident investigation** - Trace when/where data was exposed

## Full Prerequisites Guide

📖 See [PREREQUISITES.md - Scan Conversation Risk](../PREREQUISITES.md#5-scan-conversation-risk-command) for:
- Complete setup instructions
- Docker vs Cloud API comparison
- Risk threshold configuration
- Verification steps
- Advanced troubleshooting
