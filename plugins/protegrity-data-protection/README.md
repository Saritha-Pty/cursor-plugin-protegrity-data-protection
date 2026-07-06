# Protegrity Data Protection

> The plugin calls the Protegrity APIs directly — no external runner required. Ensure the underlying APIs are reachable: Docker services on ports 8580 (classification) / 8581 (guardrail), or set `DEV_EDITION_EMAIL`, `DEV_EDITION_PASSWORD` and `DEV_EDITION_API_KEY` environment variables and install the `protegrity-ai-developer-python` SDK (`pip install protegrity-ai-developer-python`) for protect/unprotect.

A comprehensive Cursor IDE plugin for protecting sensitive data in prompts and AI workflows using Protegrity AI Developer Edition APIs.

## Features

- **PII Discovery**: Automatically detect personally identifiable information in selected text
- **Data Masking**: Replace detected entities with configurable masking characters
- **Data Redaction**: Remove sensitive data completely
- **Tokenization Protection**: Protect/unprotect data using enterprise tokenization APIs
- **Semantic Guardrails**: Evaluate conversation risk and PII exposure in multi-turn interactions
- **Synthetic Data**: Generate privacy-preserving synthetic datasets
- **Configuration Management**: Customize entity mappings and protection methods

## Quick Start

1. Install the plugin in Cursor IDE
2. **Review [PREREQUISITES.md](./PREREQUISITES.md)** - Each feature has specific requirements
3. Configure your Protegrity API credentials via environment variables or settings
4. Use the commands and skills to protect data in your workflow

## Components

- **Rules**: Baseline security and privacy standards
- **Skills**: Data protection workflows (find, redact, mask, protect, unprotect)
- **Agents**: Privacy-focused reviewers and security validators
- **Commands**: Direct protection/unprotection and data analysis commands
- **Hooks**: Automated scanning and validation on file edits and shell execution

## Prerequisites by Feature

> **New to Dev Edition and Cursor?** Start with [PREREQUISITES.md](./PREREQUISITES.md) to understand what you need for each feature.

| Feature | Key Requirements | Setup Time |
|---------|------------------|-----------|
| **Analyze Data Sensitivity** | Classification API (Docker/Cloud) | 5 min |
| **Protect/Unprotect Text** | API Credentials + Env Variables | 10 min |
| **Redact Sensitive Data** | Classification API | 5 min |
| **Scan Conversation Risk** | Semantic Guardrail API (Docker/Cloud) | 5 min |
| **Synthetic Data** | Docker Compose with `--profile synthetic` | 10 min |
| **Privacy Reviewer Agent** | Classification API + AI Model | 5 min |
| **Security Compliance Auditor** | All APIs + Audit Logging | 15 min |

## Documentation

- **Setup Guide**: See [SETUP.md](./SETUP.md) for detailed installation steps
- **Prerequisites**: See [PREREQUISITES.md](./PREREQUISITES.md) for feature-specific requirements
- **Testing**: See [TESTING.md](./TESTING.md) for comprehensive test scenarios
- **API Docs**: [Protegrity AI Developer Edition](https://developer.docs.protegrity.com/)

## Common Scenarios

### Scenario 1: I want to detect PII in my code
→ Use **Analyze Data Sensitivity** command
→ Prerequisites: Classification API (5 min setup)
→ See: [PREREQUISITES.md - Analyze Data Sensitivity](./PREREQUISITES.md#1-analyze-data-sensitivity-command)

### Scenario 2: I want to protect sensitive data for AI prompts
→ Use **Protect Text** command
→ Prerequisites: Protegrity API account + Environment variables (10 min setup)
→ See: [PREREQUISITES.md - Protect Text](./PREREQUISITES.md#2-protect-text-command)

### Scenario 3: I want to check conversations for data leaks
→ Use **Scan Conversation Risk** command
→ Prerequisites: Semantic Guardrail API (5 min setup)
→ See: [PREREQUISITES.md - Scan Conversation Risk](./PREREQUISITES.md#5-scan-conversation-risk-command)

### Scenario 4: I want a full privacy audit of my codebase
→ Use **Privacy Reviewer Agent**
→ Prerequisites: Classification API + AI model (5 min setup)
→ See: [PREREQUISITES.md - Privacy Reviewer Agent](./PREREQUISITES.md#7-privacy-reviewer-agent)

## Troubleshooting

For comprehensive troubleshooting, error indicators, and solutions for each feature, see:
→ [PREREQUISITES.md - Troubleshooting](./PREREQUISITES.md#troubleshooting)

## Support

- **Plugin Issues**: Create an issue in this repository
- **Protegrity API Questions**: Visit https://github.com/Protegrity-Developer-Edition/discussions
- **API Documentation**: https://developer.docs.protegrity.com/
- **Register for Dev Edition**: https://www.protegrity.com/developers/dev-edition-api
