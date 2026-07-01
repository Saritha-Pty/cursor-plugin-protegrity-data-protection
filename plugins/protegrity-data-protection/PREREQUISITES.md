# Prerequisites Guide - Protegrity Data Protection Plugin

This guide outlines all prerequisites for using the Protegrity Data Protection Plugin in Cursor IDE. Each feature has specific requirements listed below.

---

## Table of Contents

1. [Universal Prerequisites](#universal-prerequisites)
2. [Feature-Specific Prerequisites](#feature-specific-prerequisites)
3. [Setup Verification](#setup-verification)
4. [Troubleshooting](#troubleshooting)

---

## Universal Prerequisites

These prerequisites apply to ALL features in the plugin:

### 1. **Cursor IDE**
- **Requirement**: Cursor IDE version 0.40.0 or later
- **Check**: `Cursor > About Cursor IDE`
- **Installation**: Download from [cursor.com](https://cursor.com)

### 2. **System Requirements**
- **Memory**: Minimum 4GB RAM (8GB recommended)
- **Storage**: 2GB free space for plugin and dependencies
- **OS Support**: macOS, Linux, or Windows

### 3. **Plugin Installation**
- **Status**: Plugin must be installed and enabled in Cursor
- **Verify**: Settings → Extensions → Search "Protegrity Data Protection"
- **Action**: Install if not present, restart Cursor

### 4. **Network Access**
- **Requirement**: Outbound HTTPS connectivity (port 443)
- **Check**: Can access https://developer.docs.protegrity.com/
- **Firewall**: Whitelist Protegrity API endpoints if needed

---

## Feature-Specific Prerequisites

### 1. **Analyze Data Sensitivity** (Command)

**Purpose**: Detect PII and classify data sensitivity levels

**Prerequisites**:

| Requirement | Details | How to Verify |
|---|---|---|
| Classification API Access | Docker compose running OR cloud API registered | `docker compose ps` or check account at protegrity.com |
| Python 3.9+ | Required for classification service | `python3 --version` |
| Docker & Docker Compose (Optional) | For local development deployment | `docker --version && docker compose --version` |
| Entity Mappings Configured | Named entity types defined in config.json | Check `config.json` > `named_entity_map` section |
| Configuration Threshold | Classification score threshold set (default: 0.6) | Settings → Protegrity → Classification Threshold |

**Quick Setup** (Docker - Recommended for first-time users):
```bash
# 1. Clone Protegrity Developer Edition
git clone https://github.com/Protegrity-Developer-Edition/protegrity-developer-edition.git
cd protegrity-developer-edition

# 2. Start Classification service only
docker compose up -d classification-service

# 3. Verify service is running
docker compose logs classification-service

# 4. Service available at: http://localhost:8580
```

**Quick Setup** (Cloud API):
```bash
# Register at https://www.protegrity.com/developers/dev-edition-api
# No additional setup needed - plugin auto-connects
```

**Error Indicators**:
- ❌ "Cannot connect to Classification API" → Docker not running or wrong endpoint
- ❌ "No entities detected" → Check entity mappings in config

---

### 2. **Protect Text** (Command)

**Purpose**: Convert sensitive data into secure tokens using enterprise APIs

**Prerequisites**:

| Requirement | Details | How to Verify |
|---|---|---|
| **Protegrity API Account** | Required: Email, Password, API Key | Login at https://www.protegrity.com/developers/dev-edition-api |
| **Environment Variables Set** | DEV_EDITION_EMAIL, DEV_EDITION_PASSWORD, DEV_EDITION_API_KEY | `printenv \| grep DEV_EDITION` |
| **Network Access to API** | Outbound HTTPS to Protegrity cloud APIs | Test: `curl -I https://api.protegrity.com` |
| **Python 3.9+** | Required for protection client | `python3 --version` |
| **Policy User Configuration** | User role defined (e.g., "superuser") | Check with Protegrity admin |
| **Data Element Mapping** | Define what data elements you protect (name, email, ssn, etc.) | Update config.json > named_entity_map |

**Setup Instructions**:

```bash
# Step 1: Register for API Access
# Go to: https://www.protegrity.com/developers/dev-edition-api
# Complete signup and get: Email, Password, API Key

# Step 2: Set Environment Variables (Linux/macOS)
export DEV_EDITION_EMAIL='your-email@company.com'
export DEV_EDITION_PASSWORD='your-password'
export DEV_EDITION_API_KEY='your-api-key-here'

# Step 3: Set Environment Variables (Windows PowerShell)
$env:DEV_EDITION_EMAIL = 'your-email@company.com'
$env:DEV_EDITION_PASSWORD = 'your-password'
$env:DEV_EDITION_API_KEY = 'your-api-key-here'

# Step 4: Verify Connection (Linux/macOS)
echo $DEV_EDITION_API_KEY  # Should show your API key

# Step 5: Verify Connection (Windows)
$env:DEV_EDITION_API_KEY  # Should show your API key
```

**Cursor Settings Configuration**:
1. Open Cursor Settings (Cmd+, or Ctrl+,)
2. Search for "Protegrity"
3. Verify:
   - Protection Method: "tokenize"
   - Policy User: "superuser" (or your role)

**Error Indicators**:
- ❌ "401 Unauthorized" → Invalid API credentials
- ❌ "Environment variable not set" → Follow Step 2-3 above
- ❌ "Policy user not recognized" → Verify your user role with admin

---

### 3. **Unprotect Text** (Command)

**Purpose**: Convert protected tokens back to original data

**Prerequisites**:

| Requirement | Details | How to Verify |
|---|---|---|
| **Same as Protect Text** | All Protect Text prerequisites apply | See Protect Text section above |
| **Valid Protection Token** | Must be token generated by Protect Text | Format: `<protected_token_string>` |
| **Matching Policy User** | Same policy user who created token | Use same user as protection command |
| **API Access** | Cloud API must be accessible | Test connection |

**Setup**: Identical to "Protect Text" - follow those instructions

**Error Indicators**:
- ❌ "Invalid token" → Token format incorrect or corrupted
- ❌ "User not authorized" → Using different policy user than protection
- ❌ "Unprotection failed" → Contact Protegrity support

---

### 4. **Redact Sensitive Data** (Command)

**Purpose**: Replace detected PII with masking characters

**Prerequisites**:

| Requirement | Details | How to Verify |
|---|---|---|
| **Classification API** | Same as "Analyze Data Sensitivity" | See Analyze Data Sensitivity section |
| **Entity Detection** | Named entities must be configured | Check config.json > named_entity_map |
| **Masking Configuration** | Define masking character and method | Settings → Protegrity → Masking Character (default: #) |
| **Python 3.9+** | Required for redaction service | `python3 --version` |

**Setup** (Minimal - inherits from Classification API):
```bash
# 1. Start Classification service (if using Docker)
docker compose up -d classification-service

# 2. Configure masking in Cursor Settings
# Settings → Protegrity → Masking Character (set to: #, *, X, etc.)

# 3. Verify entity mappings are complete
# config.json > named_entity_map should include all PII types you want to redact
```

**Error Indicators**:
- ❌ "Classification API not available" → Start Docker or cloud API
- ❌ "No entities found" → Data contains no detectable PII

---

### 5. **Scan Conversation Risk** (Command)

**Purpose**: Analyze multi-turn conversations for PII exposure and security risks

**Prerequisites**:

| Requirement | Details | How to Verify |
|---|---|---|
| **Semantic Guardrail API** | Docker compose OR cloud API access | `docker compose ps` or check Protegrity account |
| **Python 3.9+** | Required for guardrail service | `python3 --version` |
| **Risk Threshold Configuration** | Define block, redact, warn, allow thresholds | Check config.json > risk_thresholds |
| **Docker & Docker Compose** (Optional) | For local Docker-based guardrail service | `docker --version` |
| **Audit Logging (Optional)** | Enable for compliance tracking | Settings → Protegrity → Audit Logging |

**Setup** (Docker - Recommended):
```bash
# 1. Clone Protegrity Developer Edition
git clone https://github.com/Protegrity-Developer-Edition/protegrity-developer-edition.git
cd protegrity-developer-edition

# 2. Start Semantic Guardrail service
docker compose up -d semantic-guardrail-service

# 3. Verify service is running
docker compose logs semantic-guardrail-service

# 4. Service available at: http://localhost:8581
```

**Setup** (Cloud API):
```bash
# Use Protegrity cloud account - no Docker needed
# Endpoint automatically configured for cloud API
```

**Cursor Configuration**:
```json
// In config.json, set risk thresholds:
{
  "risk_thresholds": {
    "block": 0.9,      // Risk >= 0.9: Block message
    "redact": 0.7,     // Risk >= 0.7: Redact PII
    "warn": 0.5,       // Risk >= 0.5: Show warning
    "allow": 0.0       // Risk < 0.5: Allow
  }
}
```

**Error Indicators**:
- ❌ "Cannot connect to Semantic Guardrail API" → Docker not running
- ❌ "No risk detected" → Conversation contains no sensitive data

---

### 6. **Synthetic Data Generation** (Skill)

**Purpose**: Generate privacy-preserving synthetic datasets for testing/development

**Prerequisites**:

| Requirement | Details | How to Verify |
|---|---|---|
| **Synthetic Data API** | Docker compose with `--profile synthetic` OR cloud API | `docker compose logs synthetic-data-service` |
| **Docker & Docker Compose** | Required for local synthetic data service | `docker --version` |
| **Docker Profiles Enabled** | Must include synthetic profile | `docker compose up -d --profile synthetic` |
| **Python 3.9+** | Required for synthetic data generation | `python3 --version` |
| **Training Data** (Optional) | Historical data to train generator on | Provide sample dataset or use defaults |

**Setup** (Docker with Synthetic Profile):
```bash
# 1. Clone Protegrity Developer Edition
git clone https://github.com/Protegrity-Developer-Edition/protegrity-developer-edition.git
cd protegrity-developer-edition

# 2. Start services including Synthetic Data (requires --profile synthetic)
docker compose up -d --profile synthetic

# 3. Verify Synthetic Data service is running
docker compose logs synthetic-data-service

# 4. Service available at: http://localhost:8095
```

**Provide Training Data** (Optional):
```bash
# Place sample data in data/ directory
mkdir -p data/training
# Add CSV or JSON files with sample records

# Or use default patterns without training data
```

**Error Indicators**:
- ❌ "Synthetic Data service not found" → Run with `--profile synthetic`
- ❌ "Service unreachable at localhost:8095" → Docker not running correctly
- ❌ "Generation timeout" → Reduce dataset size or increase service resources

---

### 7. **Privacy Reviewer Agent**

**Purpose**: AI-powered code review for data protection and privacy compliance

**Prerequisites**:

| Requirement | Details | How to Verify |
|---|---|---|
| **Classification API** | For PII detection in code | See Analyze Data Sensitivity section |
| **Claude or GPT Model** | Cursor's AI model for analysis | Cursor must have AI features enabled |
| **Code Repository** | Access to source files being reviewed | Current workspace files |
| **Entity Mappings** | Named entities defined for your domain | Check config.json > named_entity_map |
| **Audit Logging** (Optional) | For compliance tracking of reviews | Settings → Protegrity → Audit Logging |

**Setup**:
1. Ensure Classification API is running (Docker or Cloud)
2. Enable Cursor AI features
3. Configure entity mappings for your codebase
4. Optionally enable audit logging for review history

**Error Indicators**:
- ❌ "Classification API not available" → Start Docker or cloud API
- ❌ "AI features disabled" → Enable in Cursor settings

---

### 8. **Security Compliance Auditor Agent**

**Purpose**: Automated security auditing and compliance validation

**Prerequisites**:

| Requirement | Details | How to Verify |
|---|---|---|
| **All Protegrity APIs** | Classification, Guardrail, Protection APIs | All services must be accessible |
| **Audit Logging** | Must be enabled for audit trail | Settings → Protegrity → Audit Logging: enabled |
| **Compliance Framework** | Define standards (GDPR, CCPA, HIPAA, etc.) | Update agent configuration |
| **File Access** | Read permissions for all code files | Check file permissions |

**Setup**:
1. Start all Protegrity services (Classification, Guardrail, Protection)
2. Enable audit logging in settings
3. Configure compliance standards to audit against
4. Run auditor on codebase

**Error Indicators**:
- ❌ "Some APIs unavailable" → Ensure all services running
- ❌ "Audit logging disabled" → Enable in settings

---

## Setup Verification

### Quick Verification Checklist

Run this to verify your setup is complete:

```bash
# 1. Check Cursor IDE
cursor --version

# 2. Check Python
python3 --version  # Should be 3.9+

# 3. Check Docker (if using local services)
docker --version
docker compose --version

# 4. Check Docker services (if applicable)
docker compose ps

# 5. Check environment variables (if using Protection APIs)
printenv | grep DEV_EDITION

# 6. Check network connectivity
curl -I https://developer.docs.protegrity.com/

# 7. Test Classification API (if local)
curl http://localhost:8580/health

# 8. Test Guardrail API (if local)
curl http://localhost:8581/health

# 9. Test Protection API (if cloud)
curl -H "Authorization: Bearer $DEV_EDITION_API_KEY" \
  https://api.protegrity.com/v1/health
```

### Cursor Plugin Verification

1. Open Cursor IDE
2. Run Command Palette: `Cmd+K` or `Ctrl+K`
3. Type: "Protegrity: Status Check"
4. Should show:
   - ✅ Plugin loaded
   - ✅ Config loaded
   - ✅ Each API endpoint status (Connected/Disconnected)
   - ✅ Environment variables status

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: "Plugin not loading"
**Solution**:
1. Verify plugin is installed: Settings → Extensions → Search "Protegrity"
2. Restart Cursor: Cmd+Q (macOS) or Close window (Windows/Linux)
3. Reopen Cursor and check Extension Log (Help → Show Logs)

#### Issue: "Cannot connect to Classification API"
**Solution**:
1. If using Docker:
   ```bash
   docker compose logs classification-service
   docker compose restart classification-service
   ```
2. If using Cloud API:
   - Check internet connection
   - Verify endpoint URL in Settings → Protegrity
   - Check firewall allows outbound HTTPS

#### Issue: "Protection API returns 401 Unauthorized"
**Solution**:
1. Verify environment variables are set:
   ```bash
   echo $DEV_EDITION_EMAIL
   echo $DEV_EDITION_PASSWORD
   echo $DEV_EDITION_API_KEY
   ```
2. Restart Cursor after setting environment variables (Cursor reads env at startup)
3. Verify credentials are correct on https://www.protegrity.com/developers/dev-edition-api

#### Issue: "No PII entities detected"
**Solution**:
1. Verify entity mappings in config.json
2. Adjust classification_score_threshold lower (default 0.6)
3. Ensure input text contains detectable patterns (e.g., "john@example.com" for EMAIL)

#### Issue: "Docker services won't start"
**Solution**:
1. Check Docker daemon: `docker ps`
2. Check available disk space: `df -h`
3. Check available memory: `free -h` (Linux) or `vm_stat` (macOS)
4. Increase Docker resources if needed (Settings → Resources)

---

## Next Steps

After verifying prerequisites:

1. **Start with Analyze Data Sensitivity** - Simplest feature to test your setup
2. **Try Redact Sensitive Data** - Basic protection workflow
3. **Progress to Protect/Unprotect Text** - Enterprise-grade tokenization
4. **Use Scan Conversation Risk** - Multi-turn conversation protection
5. **Run Privacy Reviewer Agent** - Full code security scan
6. **Enable Synthetic Data** - For testing and development

---

## Support

- **Plugin Issues**: Create issue on [GitHub](https://github.com/Saritha-Pty/cursor-plugin-protegrity-data-protection/issues)
- **Protegrity API Questions**: https://github.com/Protegrity-Developer-Edition/discussions
- **API Documentation**: https://developer.docs.protegrity.com/
- **Protegrity Account**: https://www.protegrity.com/developers/dev-edition-api
