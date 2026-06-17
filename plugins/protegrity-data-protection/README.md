# Protegrity Data Protection

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
2. Configure your Protegrity API credentials via environment variables or settings
3. Use the commands and skills to protect data in your workflow

## Components

- **Rules**: Baseline security and privacy standards
- **Skills**: Data protection workflows (find, redact, mask, protect, unprotect)
- **Agents**: Privacy-focused reviewers and security validators
- **Commands**: Direct protection/unprotection and data analysis commands
- **Hooks**: Automated scanning and validation on file edits and shell execution

## Documentation

Refer to the Protegrity AI Developer Edition documentation at https://developer.docs.protegrity.com/ for API details and configuration options.
