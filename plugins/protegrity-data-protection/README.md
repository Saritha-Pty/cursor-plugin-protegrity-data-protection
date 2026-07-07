# Protegrity Data Protection

> NOTE: MCP has been removed entirely from this repository. The plugin uses skills, commands, agents, and rules that call library functions directly. Ensure APIs are reachable via local Docker services on ports 8580/8581/8095/8085 or cloud credentials via DEV_EDITION_* env vars.

A comprehensive Cursor IDE plugin for protecting sensitive data in prompts and AI workflows using Protegrity AI Developer Edition APIs.

> **The plugin drives all data protection — not Cursor's AI model.** Every PII detection, tokenization, redaction, anonymization, and compliance operation goes through Protegrity's enterprise APIs.

## 🆕 New to Protegrity Developer Edition?

Start here → Open Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) and run:
```
Protegrity: Setup Wizard
```
The wizard asks what you want to do and gives you a personalized setup plan in ~2 minutes.

Or run `Protegrity: Status Check` to see which features are ready right now.

---

## Features (v2.0.0)

| Command | What it does | Requires |
|---------|-------------|---------|
| **Analyze Data Sensitivity** | Detect 15+ PII entity types with confidence scores | Docker (data-discovery) |
| **Redact Sensitive Data** | Remove or mask PII from text | Docker (data-discovery) |
| **Find and Redact** | Discover PII then remove it in one step | Docker (data-discovery) |
| **Protect Text** | Tokenize sensitive data (reversible) | API account + SDK |
| **Unprotect Text** | Recover original data from token | API account + SDK |
| **Find and Protect** | Discover PII then tokenize it in one step | Docker + API account |
| **Scan Conversation Risk** | Evaluate AI conversations for data risks | Docker (semantic-guardrail) |
| **Generate Synthetic Data** | Create realistic fake test datasets | Docker (synthetic-data) |
| **Anonymize Data** | Irreversible anonymization of sensitive fields | Docker (anonymization) |
| **Status Check** | See which services are running right now | — |
| **Setup Wizard** | Personalized step-by-step setup guide | — |

**Agents:**
- **Privacy Reviewer** — Audit code and workflows for data exposure risks
- **Security Compliance Auditor** — Full compliance posture assessment
- **Developer Edition Guide** — Friendly guide for new users

**Rules (always active):**
- `data-protection-standards` — Baseline privacy rules for all AI workflows
- `plugin-behavior` — Ensures the plugin drives all data protection (not Cursor AI)
- `privacy-review-checklist` — Applied to code files during editing

---

## Quick Start

1. Install the plugin in Cursor IDE
2. Open Command Palette → `Protegrity: Setup Wizard`
3. Follow the personalized setup plan
4. Run `Protegrity: Status Check` to verify services are ready
5. Try `Protegrity: Analyze Data Sensitivity` on any text with sample data

---

## Prerequisites by Feature

| Feature | Docker Service | API Account? | Setup Time |
|---------|---------------|-------------|------------|
| Analyze Data Sensitivity | data-discovery (port 8580) | ❌ No | ~5 min |
| Redact Sensitive Data | data-discovery (port 8580) | ❌ No | ~5 min |
| Find and Redact | data-discovery (port 8580) | ❌ No | ~5 min |
| Scan Conversation Risk | semantic-guardrail (port 8581) | ❌ No | ~5 min |
| Generate Synthetic Data | synthetic-data (port 8095) | ❌ No | ~10 min |
| Anonymize Data | anonymization (port 8085) | ❌ No | ~10 min |
| Protect Text | ❌ None | ✅ Yes | ~10 min |
| Unprotect Text | ❌ None | ✅ Yes | ~10 min |
| Find and Protect | data-discovery (port 8580) | ✅ Yes | ~15 min |
| Privacy Reviewer Agent | data-discovery (port 8580) | ❌ No | ~5 min |

> **No API account needed for most features!** Start with Docker-based features first.

---

## Components

- **Rules**: Baseline security and privacy standards; plugin behavior enforcement
- **Skills**: Data protection workflows (classify, redact, protect, unprotect, synthetic, anonymize)
- **Agents**: Privacy reviewer, compliance auditor, and new-user guide
- **Commands**: All 11 direct protection commands
- **Hooks**: Automated PII scanning on file edit and prompt sanitization

---

## Common Scenarios

### "I want to detect PII in my code"
→ Command: `Protegrity: Analyze Data Sensitivity`
→ Needs: Data Discovery service running (Docker, ~5 min)

### "I want to protect sensitive data before sending to an AI model"
→ Command: `Protegrity: Find and Protect`
→ Needs: Docker + free API account (~15 min total)

### "I want to share test data without real PII"
→ Command: `Protegrity: Generate Synthetic Data`
→ Needs: Synthetic Data service running (Docker, ~10 min)

### "I want to clean logs before sharing with my team"
→ Command: `Protegrity: Find and Redact`
→ Needs: Data Discovery service running (Docker, ~5 min)

### "I want a full privacy audit of my codebase"
→ Agent: **Privacy Reviewer**
→ Needs: Data Discovery service running + AI model in Cursor

### "I'm new and don't know where to start"
→ Command: `Protegrity: Setup Wizard`
→ Agent: **Developer Edition Guide** (ask it anything)

---

## Troubleshooting

Always start with: **`Protegrity: Status Check`** in the Command Palette.

For comprehensive troubleshooting by feature, see:
→ [PREREQUISITES.md](./PREREQUISITES.md)
→ [QUICK_START.md](./QUICK_START.md)

---

## Support

- **Plugin Issues**: Create an issue in this repository
- **Protegrity API Questions**: Visit https://github.com/Protegrity-AI-Developer-Edition/discussions
- **API Documentation**: https://developer.docs.protegrity.com/
- **Register for Dev Edition**: https://www.protegrity.com/developers/dev-edition-api
