# Protegrity Data Protection Cursor Plugin

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.1.1-green.svg)](plugins/protegrity-data-protection/.cursor-plugin/plugin.json)
[![Cursor Plugin](https://img.shields.io/badge/cursor-plugin-blueviolet.svg)](https://www.cursor.com)

A customer-friendly Cursor IDE plugin for Protegrity AI Developer Edition that helps new users discover sensitive data, protect prompts, redact content, generate synthetic data, anonymize datasets, and use guardrail workflows without taking control away from the user.

## What this plugin helps you do

- Discover PII in selected text or files
- Redact or mask sensitive content
- Protect and unprotect text using Developer Edition tokenization APIs
- Evaluate conversation risk with semantic guardrails
- Generate synthetic data for safe testing
- Anonymize dataset fields
- Follow simple, guided setup steps based on the feature you want

## What changed in this version

- Focused onboarding for new Developer Edition users
- Clear prerequisites by feature so you only install what you need
- Removed MCP-related guidance and references from the plugin experience
- More customer-friendly language and step-by-step workflow help
- Improved task-driven guidance so the customer stays in control

## Feature map

### 1) Discover sensitive data
Use this when you want to find PII in text, code, or documents.

**Requires:**
- Docker Desktop
- Developer Edition local services for data discovery

### 2) Redact or mask data
Use this when you want to remove or hide sensitive data from shared text.

**Requires:**
- Docker Desktop
- Developer Edition data discovery service

### 3) Protect or unprotect text
Use this when you want reversible tokenization.

**Requires:**
- Protegrity Developer Edition account
- `DEV_EDITION_EMAIL`
- `DEV_EDITION_PASSWORD`
- `DEV_EDITION_API_KEY`
- Official Developer Edition SDK installed

### 4) Scan conversation risk
Use this when you want to check prompts or conversations for privacy risk.

**Requires:**
- Docker Desktop
- Developer Edition semantic guardrail service

### 5) Generate synthetic data
Use this when you want test data that is safer than production data.

**Requires:**
- Docker Desktop
- Developer Edition synthetic data service

### 6) Anonymize data
Use this when you want to anonymize structured datasets while keeping them useful.

**Requires:**
- Docker Desktop
- Developer Edition anonymization service

## Recommended setup path for new users

1. Install the plugin in Cursor
2. Open the setup guide in `plugins/protegrity-data-protection/SETUP.md`
3. Choose the feature you want first
4. Install only the prerequisites for that feature
5. Run the plugin status check
6. Start using the guided commands

## Customer experience principles

- The plugin explains what the customer should do, step by step
- The plugin avoids technical overload unless the user asks for it
- The plugin uses simple language and clear action prompts
- The plugin does not ask Cursor to take over the workflow
- The plugin encourages the customer to drive the task from the command palette

## Components

- Rules for privacy-safe behavior
- Skills for discovery, redaction, protection, guardrails, synthetic data, and anonymization
- Commands for direct user actions
- Setup and prerequisite guides

## Documentation

- [Setup Guide](plugins/protegrity-data-protection/SETUP.md)
- [Quick Start](plugins/protegrity-data-protection/QUICK_START.md)
- [Prerequisites by Feature](plugins/protegrity-data-protection/PREREQUISITES.md)
- [Protegrity AI Developer Edition Docs](https://developer.docs.protegrity.com/docs/)

## Notes

- No MCP is used in this plugin.
- Keep credentials out of source control.
- Use only the prerequisites needed for the feature you want to run.

## Support

- Plugin issues: [GitHub Issues](https://github.com/Saritha-Pty/cursor-plugin-protegrity-data-protection/issues)
- Protegrity docs: https://developer.docs.protegrity.com/docs/

**Protect your data. Keep control with the customer.**
