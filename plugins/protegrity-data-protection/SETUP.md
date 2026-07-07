# Setup Guide: Protegrity Data Protection Plugin

## Start here

This guide helps new Cursor users get started with Protegrity AI Developer Edition without extra setup.

### Choose what you want to do

- Discover sensitive data
- Redact or mask data
- Protect or unprotect text
- Scan conversation risk
- Generate synthetic data

You only need the prerequisites for the feature you choose.

---

## Quick setup flow

1. Install the plugin in Cursor
2. Open the Command Palette
3. Run **Protegrity: Setup Wizard**
4. Choose your feature
5. Install only the required prerequisites
6. Run **Protegrity: Status Check**
7. Start the feature command you want

---

## Feature prerequisites

### 1) Discover sensitive data
**You need:**
- Docker Desktop
- Local Developer Edition data discovery service

### 2) Redact or mask sensitive data
**You need:**
- Docker Desktop
- Local Developer Edition data discovery service

### 3) Protect or unprotect text
**You need:**
- Protegrity Developer Edition account
- `DEV_EDITION_EMAIL`
- `DEV_EDITION_PASSWORD`
- `DEV_EDITION_API_KEY`
- Official Developer Edition SDK installed

### 4) Scan conversation risk
**You need:**
- Docker Desktop
- Local Developer Edition semantic guardrail service

### 5) Generate synthetic data
**You need:**
- Docker Desktop
- Local Developer Edition synthetic data service

---

## Simple setup instructions

### For local service features
1. Start Docker Desktop
2. Start the Developer Edition service required for your feature
3. Wait until the health check succeeds
4. Run the plugin command again

### For tokenization features
1. Register for a Developer Edition account
2. Set the three environment variables
3. Install the official SDK
4. Restart Cursor
5. Run the protect or unprotect command

---

## Customer-friendly guidance

Use these prompts in the plugin:
- “What do you want to do today?”
- “I’ll show only the prerequisites you need.”
- “You can stop after this step if that is all you need.”
- “Run Status Check when you are ready.”

---

## Troubleshooting

- If a local feature fails, confirm Docker Desktop is running
- If tokenization fails, confirm the environment variables and restart Cursor
- If you see connection errors, start only the service required for that feature
- If you are unsure, return to the setup wizard and pick one feature

---

## Important notes

- No MCP setup is included in this plugin
- Keep the workflow customer-driven
- Use only the prerequisites needed for the selected feature
