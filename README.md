# Protegrity Data Protection Cursor Plugin

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](plugins/protegrity-data-protection/.cursor-plugin/plugin.json)
[![Cursor Plugin](https://img.shields.io/badge/cursor-plugin-blueviolet.svg)](https://www.cursor.com)

A comprehensive Cursor IDE plugin for protecting sensitive data in prompts and AI workflows using Protegrity AI Developer Edition's enterprise-grade privacy APIs.

## 🔐 Features

### Data Discovery & Classification
- **PII Detection**: Automatically identify personally identifiable information
- **Entity Recognition**: Detect 12+ PII entity types with confidence scores
- **Text Classification**: Classify text snippets by sensitivity level

### Data Protection
- **Masking**: Replace sensitive data with configurable characters (#, *, etc.)
- **Redaction**: Completely remove detected PII from text
- **Tokenization**: Enterprise-grade reversible protection with tokens

### AI Safety
- **Semantic Guardrails**: Evaluate conversation risk in multi-turn interactions
- **Prompt Sanitization**: Automatically protect prompts before sending to LLMs
- **Output Validation**: Detect sensitive data leakage in AI model outputs

### Privacy-Enhancing Tech
- **Synthetic Data**: Generate realistic, anonymized datasets for testing
- **Audit Logging**: Full compliance tracking of all protection operations

## 🚀 Quick Start

### Installation

1. **Install Plugin**: Open Cursor → Settings → Marketplace → Search "Protegrity" → Install
2. **Setup Services**: Follow [SETUP.md](plugins/protegrity-data-protection/SETUP.md)
3. **Configure Credentials**: Set `DEV_EDITION_EMAIL`, `DEV_EDITION_PASSWORD`, `DEV_EDITION_API_KEY`
4. **Verify**: Use any data discovery command to test

### Basic Usage

**Find PII in text:**
```
Cmd+Shift+P → "Protegrity: Analyze Data Sensitivity"
Select text → Choose entity types → Review results
```

**Protect sensitive data:**
```
Cmd+Shift+P → "Protegrity: Protect Text"
Select text → Provide policy user and data element → Get protected token
```

**Redact information:**
```
Cmd+Shift+P → "Protegrity: Redact Sensitive Data"
Select text → Choose redaction method (remove/mask) → Apply changes
```

## 📋 What's Included

```
.
├── plugins/protegrity-data-protection/
│   ├── rules/                          # Data protection standards
│   │   ├── data-protection-standards.mdc
│   │   └── privacy-review-checklist.mdc
│   ├── skills/                         # Protection workflows
│   │   ├── data-discovery/
│   │   ├── data-redaction/
│   │   ├── data-protection/
│   │   ├── semantic-guardrails/
│   │   └── synthetic-data-generation/
│   ├── agents/                         # AI reviewers
│   │   ├── privacy-reviewer.md
│   │   └── security-compliance-auditor.md
│   ├── commands/                       # Direct actions
│   │   ├── protect-text.md
│   │   ├── unprotect-text.md
│   │   ├── redact-sensitive-data.md
│   │   ├── scan-conversation-risk.md
│   │   └── analyze-data-sensitivity.md
│   ├── hooks/
│   │   └── hooks.json                  # File edit & API call hooks
│   ├── scripts/                        # Hook implementations
│   │   ├── scan-for-pii.sh
│   │   ├── validate-api-calls.sh
│   │   ├── sanitize-prompt.sh
│   │   └── audit-session.sh
│   ├── config.json                     # Plugin configuration
│   ├── SETUP.md                        # Installation & setup
│   └── .cursor-plugin/plugin.json      # Plugin metadata
├── .cursor-plugin/marketplace.json      # Marketplace config
└── README.md
```

## 🔧 Components

### Rules
- **data-protection-standards**: Core principles for handling sensitive data
- **privacy-review-checklist**: Pre-deployment verification checklist

### Skills
- **data-discovery**: Find and enumerate PII entities
- **data-redaction**: Remove or mask sensitive information
- **data-protection**: Protect/unprotect with tokenization APIs
- **semantic-guardrails**: Evaluate conversation risk
- **synthetic-data-generation**: Create anonymized datasets

### Agents
- **privacy-reviewer**: Reviews code for data exposure risks
- **security-compliance-auditor**: Full security and compliance audit

### Commands
- **protect-text**: Tokenize data (requires credentials)
- **unprotect-text**: Retrieve original data (requires credentials)
- **redact-sensitive-data**: Remove/mask PII
- **scan-conversation-risk**: Evaluate multi-turn conversation safety
- **analyze-data-sensitivity**: Get protection recommendations

### Hooks
- **afterFileEdit**: Scan for exposed PII after edits
- **beforeShellExecution**: Validate API calls contain no raw PII
- **beforePromptSend**: Sanitize prompts before AI submission
- **sessionEnd**: Generate compliance audit log

## 🔑 API Requirements

### Data Discovery & Guardrails (Local)
```bash
# Start Protegrity services locally
git clone https://github.com/Protegrity-Developer-Edition/protegrity-developer-edition.git
cd protegrity-developer-edition
docker compose up -d
```

### Protection APIs (Registration Required)
Protection now uses the official Protegrity AI Developer Edition Python SDK (`protegrity-ai-developer-python`, import `appython`).

```bash
# Set credentials from https://www.protegrity.com/developers/dev-edition-api
export DEV_EDITION_EMAIL='your-email@example.com'
export DEV_EDITION_PASSWORD='your-password'
export DEV_EDITION_API_KEY='your-api-key'

# Install SDK
pip install protegrity-ai-developer-python
```

## 📚 Entity Types Supported

- PERSON
- LOCATION
- EMAIL_ADDRESS
- PHONE_NUMBER
- SOCIAL_SECURITY_ID (SSN)
- CREDIT_CARD_NUMBER
- AGE
- USERNAME
- IP_ADDRESS
- ACCOUNT_NUMBER
- PASSPORT_NUMBER
- DRIVER_LICENSE_NUMBER

For complete list and details: [Supported Entities](https://developer.docs.protegrity.com/docs/entities/)

## 🔒 Security Best Practices

1. **Never hardcode credentials**: Use environment variables only
2. **Apply protection early**: Protect data before AI processing
3. **Use appropriate methods**: Match protection level to data sensitivity
4. **Monitor audit logs**: Review protection operations regularly
5. **Validate outputs**: Check AI model outputs for data leakage
6. **Test synthetic data**: Use generated datasets instead of production data

## 📖 Documentation

- **Setup & Installation**: [SETUP.md](plugins/protegrity-data-protection/SETUP.md)
- **Protegrity AI Developer Edition**: https://developer.docs.protegrity.com/
- **Data Discovery API**: https://docs.protegrity.com/data-discovery/1.1.1/docs/
- **Semantic Guardrails**: https://docs.protegrity.com/sem_guardrail/1.1.0/docs/
- **Synthetic Data**: https://docs.protegrity.com/synthetic-data/1.0.0/docs/
- **Developer Portal**: https://www.protegrity.com/developers

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙋 Support

- **Plugin Issues**: [GitHub Issues](https://github.com/Saritha-Pty/cursor-plugin-protegrity-data-protection/issues)
- **Protegrity Community**: [GitHub Discussions](https://github.com/orgs/Protegrity-Developer-Edition/discussions)
- **API Documentation**: [Protegrity Docs](https://developer.docs.protegrity.com/)

## 🗺️ Roadmap

- [ ] Real-time PII detection as you type
- [ ] Integration with popular LLMs (OpenAI, Anthropic, Cohere)
- [ ] Custom entity type definitions
- [ ] Advanced policy management UI
- [ ] Integration with CI/CD pipelines
- [ ] Batch processing for large datasets
- [ ] Enhanced analytics dashboard

## 🙏 Acknowledgments

- Built on the [Cursor Plugin Template](https://github.com/cursor/plugin-template)
- Powered by [Protegrity AI Developer Edition](https://github.com/Protegrity-Developer-Edition)
- Special thanks to the Cursor and Protegrity communities

---

**Protect your data. Secure your AI. Build with confidence.** 🛡️
