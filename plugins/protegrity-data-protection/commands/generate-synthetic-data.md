---
name: generate-synthetic-data
description: Generate realistic, privacy-safe synthetic datasets that mimic production data without exposing sensitive information.
---

# Generate Synthetic Data

Create realistic fake datasets that have the same statistical properties as your real data — without any actual personal information. Perfect for safe AI model training and development.

## What is Synthetic Data?

Synthetic data is AI-generated data that mirrors the structure, types, ranges, correlations, and distributions of real data — but contains no actual personal information. Use it for:
- Training and testing AI/ML models safely
- Development and staging environments
- Sharing datasets with external teams or vendors
- Demos and proof-of-concepts without real data risk

## Prerequisites Check

✅ **Docker + Docker Compose** — REQUIRED
- Verify: `docker --version && docker compose version`

✅ **Protegrity AI Developer Edition cloned** — REQUIRED
- Clone: `git clone https://github.com/Protegrity-AI-Developer-Edition/protegrity-ai-developer-edition.git`

✅ **Synthetic Data service running** — REQUIRED
```bash
cd protegrity-ai-developer-edition/synthetic-data
docker compose up -d
docker compose logs  # Verify services are running
```
Service runs at: http://localhost:8095

✅ **Python 3.11+** — REQUIRED
- Verify: `python3 --version`

⏱️ **Setup Time**: ~10 minutes (first time, Docker images are ~1GB)

### Status Check
```
Cmd+Shift+P → "Protegrity: Status Check"
```
Should show: ✅ Synthetic Data API: Connected

---

## How to Use

1. Define your data schema (field names, types, number of rows)
2. Run the generate-synthetic-data command from the Command Palette
3. The plugin calls the Synthetic Data API — **no code required**
4. Download your synthetic dataset

## Example

**Schema input:**
```json
{
  "fields": [
    {"name": "first_name", "type": "string"},
    {"name": "email", "type": "email"},
    {"name": "age", "type": "integer", "min": 18, "max": 80},
    {"name": "salary", "type": "float", "min": 30000, "max": 150000}
  ],
  "rows": 100
}
```

**Output (sample):**
```json
[
  {"first_name": "Alice", "email": "alice.x@demo.org", "age": 34, "salary": 72450.50},
  {"first_name": "Bob", "email": "bob.y@demo.org", "age": 27, "salary": 55200.00}
]
```

## Common Issues

| Issue | Solution |
|-------|----------|
| ❌ "Cannot connect to Synthetic Data API" | Run: `cd synthetic-data && docker compose up -d` |
| ❌ "Port 8095 in use" | Stop conflicting service on that port |
| ❌ "Out of disk space" | Synthetic data images need ~1GB: `docker system prune` |

## Full Prerequisites Guide

📖 See [PREREQUISITES.md](../PREREQUISITES.md#generate-synthetic-data-command) for complete setup.
