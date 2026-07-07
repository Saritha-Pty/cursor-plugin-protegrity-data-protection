---
name: find-and-redact
description: Discover PII in text, then automatically redact all detected entities in a single step.
---

# ✂️ Find and Redact

A two-in-one command: **finds** all sensitive data in your text and immediately **removes** it. The fastest way to scrub PII from logs, prompts, exports, or any text.

> **Redaction vs Tokenization:**
> - **Redact** — permanently removes PII (cannot be recovered). Use when you don't need originals.
> - **Tokenize (Find and Protect)** — replaces PII with a reversible token. Use when authorized users may need originals later.

---

## 👋 New Here? Start Here!

**Use Find and Redact when you want to:**
- Clean logs before sharing with your team
- Scrub prompts before sending to AI models
- Prepare data exports for third parties
- Remove PII from code comments, documentation, or config files

**No API account needed — just Docker!**

---

## ✅ Prerequisites Check

| Requirement | Status Check | How to Get It |
|---|---|---|
| Docker Desktop | `docker --version` | https://www.docker.com/products/docker-desktop |
| Data Discovery service | `curl http://localhost:8580/health` | See Quick Setup below |
| Python 3.11+ | `python3 --version` | https://python.org/downloads |

⏱️ **Setup Time**: ~5 minutes (first time only)

---

## 🚀 Quick Setup (First Time)

```bash
# Step 1: Clone Protegrity AI Developer Edition
git clone https://github.com/Protegrity-AI-Developer-Edition/protegrity-ai-developer-edition.git
cd protegrity-ai-developer-edition/data-discovery

# Step 2: Start the Data Discovery service
docker compose up -d

# Step 3: Confirm it is running (wait ~20 seconds)
curl http://localhost:8580/health
# Expected: {"status":"UP"} or similar OK response

# Step 4: Verify in Cursor
# Open Command Palette → Protegrity: Status Check
# Should show: ✅ Data Discovery API: Connected
```

---

## Steps

1. Select text or provide input containing sensitive data.
2. Run the find-and-redact command.
3. The command **discovers** all PII entities with confidence scores.
4. You review the detected entities and confirm which to redact.
5. The command **redacts** confirmed entities — replacing them with `[REDACTED]` or your configured masking character.
6. You receive clean output with all PII removed.

---

## Example

**Input:**
```
Hi, I'm Sarah Johnson. Reach me at sarah.j@example.com or 555-202-9876.
My account number is ACC-00391 and date of birth is 1990-06-15.
```

**Step 1 — Discovered entities:**
```
✅ PERSON:          Sarah Johnson    (confidence: 0.98)
✅ EMAIL_ADDRESS:   sarah.j@...      (confidence: 0.99)
✅ PHONE_NUMBER:    555-202-9876     (confidence: 0.97)
✅ ACCOUNT_NUMBER:  ACC-00391        (confidence: 0.95)
✅ DATE_OF_BIRTH:   1990-06-15       (confidence: 0.92)

Confirm redaction? [Y/n]
```

**Step 2 — Redacted output:**
```
Hi, I'm [REDACTED]. Reach me at [REDACTED] or [REDACTED].
My account number is [REDACTED] and date of birth is [REDACTED].
```

**Alternative — with masking character `#`:**
```
Hi, I'm ############# Reach me at ################### or ############.
My account number is ########## and date of birth is ##########.
```

---

## Configuration

Customize redaction behavior in `config.json`:
```json
{
  "method": "redact",
  "masking_char": "#",
  "classification_score_threshold": 0.6
}
```

| Setting | Values | Description |
|---------|--------|-------------|
| `method` | `redact` | Replace PII with `[REDACTED]` label |
| `method` | `mask` | Replace PII with masking character |
| `masking_char` | `#`, `*`, `X` | Character to use when method is `mask` |
| `classification_score_threshold` | `0.5`–`0.9` | Lower = finds more (may have false positives); Higher = more confident hits only |

---

## Common Issues

| Problem | Solution |
|---------|----------|
| ❌ "Cannot connect to Classification API" | Start data-discovery service: `docker compose up -d` |
| ❌ "No entities detected" | Lower `classification_score_threshold` to `0.5` in config.json |
| ❌ "Wrong entities redacted" | Review and update `named_entity_map` in config.json |
| ❌ "Service timeout" | Try with a smaller text sample; check Docker resources |

---

## Best Practices

1. **Review before redacting** — always confirm the detected entities make sense before applying
2. **Lower threshold for logs** — use threshold 0.5 for noisy logs where missing PII is worse than false positives
3. **Choose your method** — use `redact` for logs/docs, `mask` when preserving text length matters
4. **Combine with status check** — run `Protegrity: Status Check` before processing large batches
5. **Keep audit logs** — enable logging in config.json to record what was redacted and when

---

## 📖 Full Guide

See [PREREQUISITES.md - Redact Sensitive Data](../PREREQUISITES.md#2-redact-sensitive-data) and [QUICK_START.md](../QUICK_START.md) for complete setup and advanced configuration.
