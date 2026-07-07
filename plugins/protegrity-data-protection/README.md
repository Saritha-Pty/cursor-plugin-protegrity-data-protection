# Protegrity Data Protection

> This plugin helps Cursor users work with Protegrity AI Developer Edition in a simple, task-driven way. It does **not** use MCP. Follow the setup guide for the specific feature you want, and only install the prerequisites for that feature.

## What this plugin includes

- PII discovery and classification
- Redaction and masking
- Tokenization protection and unprotection
- Semantic guardrail scanning
- Synthetic data workflows
- Anonymization workflows
- Customer-friendly setup and troubleshooting guidance

## Feature prerequisites

### Discover sensitive data
- Docker Desktop
- Developer Edition local data discovery service

### Redact or mask sensitive data
- Docker Desktop
- Developer Edition local data discovery service

### Protect or unprotect text
- Developer Edition account
- Environment variables:
  - `DEV_EDITION_EMAIL`
  - `DEV_EDITION_PASSWORD`
  - `DEV_EDITION_API_KEY`
- Official Developer Edition SDK

### Scan conversation risk
- Docker Desktop
- Developer Edition semantic guardrail service

### Generate synthetic data
- Docker Desktop
- Developer Edition synthetic data service

### Anonymize data
- Docker Desktop
- Developer Edition anonymization service

## Getting started

1. Read `SETUP.md`
2. Choose the feature you want
3. Install only the prerequisites for that feature
4. Run the plugin commands from Cursor

## User guidance style

The plugin should speak to the customer directly, for example:
- “Choose the feature you want to use.”
- “Here is what you need to install.”
- “Now run this command in Cursor.”
- “You can stop here if you only need this one feature.”

## Support

- Protegrity docs: https://developer.docs.protegrity.com/docs/
- Plugin issues: https://github.com/Saritha-Pty/cursor-plugin-protegrity-data-protection/issues
