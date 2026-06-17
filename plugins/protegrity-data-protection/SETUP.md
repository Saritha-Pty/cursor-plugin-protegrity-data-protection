# Setup Guide: Protegrity Data Protection Plugin

## Prerequisites

1. **Cursor IDE**: Latest version installed
2. **Docker & Docker Compose**: For running Protegrity services (optional but recommended)
3. **Python 3.12+**: For running Protegrity API clients
4. **Protegrity AI Developer Edition**: Docker containers or cloud API access

## Installation Steps

### 1. Install the Plugin

1. Open Cursor IDE
2. Go to Settings → Extensions → Cursor Marketplace
3. Search for "Protegrity Data Protection"
4. Click Install
5. Restart Cursor

### 2. Configure Protegrity Services

#### Option A: Using Docker Compose (Recommended for Development)

```bash
# Clone the Protegrity AI Developer Edition repo
git clone https://github.com/Protegrity-Developer-Edition/protegrity-developer-edition.git
cd protegrity-developer-edition

# Start services
docker compose up -d

# Verify services are running
docker compose logs
```

Services will be available at:
- Classification API: `http://localhost:8580`
- Semantic Guardrail API: `http://localhost:8581`
- Synthetic Data API: `http://localhost:8095` (with `--profile synthetic`)

#### Option B: Using Cloud API

For production use, register at https://www.protegrity.com/developers/dev-edition-api

### 3. Set Environment Variables

For protection/unprotection commands, set:

```bash
# Linux/macOS
export DEV_EDITION_EMAIL='your-email@example.com'
export DEV_EDITION_PASSWORD='your-password'
export DEV_EDITION_API_KEY='your-api-key'

# Windows PowerShell
$env:DEV_EDITION_EMAIL = 'your-email@example.com'
$env:DEV_EDITION_PASSWORD = 'your-password'
$env:DEV_EDITION_API_KEY = 'your-api-key'
```

### 4. Configure Plugin Settings

1. Open Cursor Settings
2. Search for "Protegrity"
3. Configure:
   - **Endpoint URLs**: Match your Protegrity deployment (default: localhost)
   - **Classification Threshold**: Confidence score (0-1, default: 0.6)
   - **Redaction Method**: "redact" or "mask"
   - **Masking Character**: Default "#"
   - **Entity Mappings**: Customize for your domain
   - **Risk Thresholds**: For semantic guardrails
   - **Audit Logging**: Enable/disable and set retention

## Verification

### Test Data Discovery

1. Create a test file with sample text containing PII:
   ```
   Contact John Smith at 555-1234 or john@example.com
   ```

2. Select the text
3. Use Command Palette: "Protegrity: Analyze Data Sensitivity"
4. Should detect PERSON, PHONE_NUMBER, EMAIL_ADDRESS entities

### Test Protection APIs

1. Ensure environment variables are set (step 3 above)
2. Use Command Palette: "Protegrity: Protect Text"
3. Provide policy user: "superuser"
4. Provide data element: "name"
5. Should return a protected token

### Test Hooks

1. Edit a file containing PII
2. Should see hook notification scanning for exposed data
3. Check hooks are working as expected

## Troubleshooting

### "Cannot connect to Protegrity API"

- Verify Docker containers are running: `docker compose ps`
- Check endpoint URL in plugin settings
- Verify firewall allows localhost connections
- Check service logs: `docker compose logs classification-service`

### "Protection API returns 401 Unauthorized"

- Verify environment variables are set correctly
- Check DEV_EDITION_API_KEY is valid
- Ensure credentials match your registered account

### "PII detection not working"

- Verify classification_score_threshold is reasonable (0.6 default)
- Check entity types are in named_entity_map
- Review classification service logs for errors
- Ensure input text contains detectable entities

### Hooks not triggering

- Verify scripts have execute permissions: `chmod +x scripts/*.sh`
- Check .cursor-plugin directory is in project root
- Review Cursor extension logs for hook errors
- Restart Cursor if hooks were recently modified

## Next Steps

1. Review the [Protegrity Documentation](https://developer.docs.protegrity.com/)
2. Explore sample scripts and skills
3. Customize entity mappings for your use case
4. Integrate into your AI workflow
5. Monitor audit logs for compliance tracking

## Support

- **Plugin Issues**: Create an issue in this repository
- **Protegrity API Questions**: Visit https://github.com/Protegrity-Developer-Edition/discussions
- **API Documentation**: https://developer.docs.protegrity.com/
