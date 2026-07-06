#!/usr/bin/env python3
"""Python wrapper for Protegrity plugin operations.

- classify/guardrail use local REST endpoints from config or env.
- protect/unprotect use the official Protegrity AI Developer Edition SDK
  (PyPI package: protegrity-ai-developer-python, import name: appython)
  and DEV_EDITION_* env vars.
"""

import os
import sys
import json
from pathlib import Path

try:
    import requests
except ImportError:
    print('Missing dependency: requests. Install with pip install requests', file=sys.stderr)
    sys.exit(2)


def load_config():
    cfg_file = Path(__file__).resolve().parents[1] / 'config.json'
    try:
        with open(cfg_file, 'r', encoding='utf-8') as f:
            return json.load(f).get('protegrity', {})
    except Exception:
        return {}


CFG = load_config()


def classification_endpoint():
    return os.environ.get('PROTEGRITY_CLASSIFICATION_ENDPOINT') or CFG.get('classification_endpoint')


def guardrail_endpoint():
    return os.environ.get('PROTEGRITY_GUARDRAIL_ENDPOINT') or CFG.get('semantic_guardrail_endpoint')


def classify(text):
    url = classification_endpoint()
    if not url:
        raise RuntimeError('classification endpoint not configured')
    resp = requests.post(url, json={'text': text})
    resp.raise_for_status()
    return resp.json()


def classify_tabular(csv_text):
    """Classify sensitive data in tabular/CSV content."""
    url = classification_endpoint()
    if not url:
        raise RuntimeError('classification endpoint not configured')
    resp = requests.post(url, json={'data': csv_text, 'format': 'tabular'})
    resp.raise_for_status()
    return resp.json()


def _extract_sdk_token(result):
    if isinstance(result, dict):
        for key in ('protected_token', 'token', 'protected_data', 'value', 'result'):
            if key in result and result[key] is not None:
                return {'protected_token': result[key], 'raw': result}
        return {'raw': result}
    if isinstance(result, str):
        return {'protected_token': result}
    return {'raw': result}


# ---------------------------------------------------------------------------
# Problem 1 fix: helpers that use the real SDK API — Protector().create_session()
# Problem 2 fix: no blanket except/pass — real errors are surfaced
# Optional: TLS-aware error message for known Protegrity Dev Edition issue
# ---------------------------------------------------------------------------

def _require_dev_edition_env():
    missing = [v for v in ('DEV_EDITION_EMAIL', 'DEV_EDITION_PASSWORD', 'DEV_EDITION_API_KEY')
               if not os.environ.get(v)]
    if missing:
        raise RuntimeError('Missing required environment variables: ' + ', '.join(missing))


def _get_session(policy_user):
    """Authenticate with the appython SDK and return a session for the given user."""
    _require_dev_edition_env()
    try:
        from appython import Protector
    except ImportError:
        raise RuntimeError(
            'Missing dependency: protegrity-ai-developer-python (import appython). '
            'Install with: pip install protegrity-ai-developer-python'
        )
    try:
        return Protector().create_session(policy_user)
    except Exception as exc:
        # Optional TLS-aware error message (Problem 1 optional fix)
        msg = str(exc)
        if 'ssl' in msg.lower() or 'certificate' in msg.lower() or 'tls' in msg.lower():
            raise RuntimeError(
                'Auth endpoint TLS cert mismatch — likely a Protegrity Dev Edition server '
                'misconfiguration. Check with Protegrity support.\nOriginal error: ' + msg
            ) from exc
        raise


def protect(data, policy_user='superuser', data_element='name'):
    """Protect data via the official appython SDK: Protector -> session -> protect."""
    session = _get_session(policy_user)
    return _extract_sdk_token(session.protect(data, data_element))


# ---------------------------------------------------------------------------
# Problem 3 fix: add unprotect function (was missing, causing broken CLI command)
# ---------------------------------------------------------------------------

def unprotect(data, policy_user='superuser', data_element='name'):
    """Reverse a protected token back to the original value."""
    session = _get_session(policy_user)
    return {'unprotected': session.unprotect(data, data_element)}


def guardrail(messages):
    url = guardrail_endpoint()
    if not url:
        raise RuntimeError('semantic guardrail endpoint not configured')
    resp = requests.post(url, json={'messages': messages})
    resp.raise_for_status()
    return resp.json()


def anonymize(data, method='redact'):
    """Anonymize sensitive fields in data using the local Anonymization API."""
    url = os.environ.get('PROTEGRITY_ANONYMIZATION_ENDPOINT') or CFG.get('anonymization_endpoint')
    if not url:
        raise RuntimeError(
            'Anonymization endpoint not configured.\n'
            '  Start the service: cd anonymization && docker compose up -d && cd ..\n'
            '  Or set PROTEGRITY_ANONYMIZATION_ENDPOINT env var.'
        )
    resp = requests.post(url, json={'data': data, 'method': method})
    resp.raise_for_status()
    return resp.json()


def synthetic_data(schema):
    """Generate synthetic data from a schema using the local Synthetic Data API."""
    url = os.environ.get('PROTEGRITY_SYNTHETIC_DATA_ENDPOINT') or CFG.get('synthetic_data_endpoint')
    if not url:
        raise RuntimeError(
            'Synthetic Data endpoint not configured.\n'
            '  Start the service: cd synthetic-data && docker compose up -d && cd ..\n'
            '  Or set PROTEGRITY_SYNTHETIC_DATA_ENDPOINT env var.'
        )
    resp = requests.post(url + '/generate', json={'schema': schema})
    resp.raise_for_status()
    return resp.json()


def _cli():
    if len(sys.argv) < 3:
        print('Usage:')
        print('  py_api_wrapper.py classify <input>')
        print('  py_api_wrapper.py classify-tabular <input>')
        print('  py_api_wrapper.py protect <input> [policy_user] [data_element]')
        print('  py_api_wrapper.py unprotect <input> [policy_user] [data_element]')
        print('  py_api_wrapper.py guardrail <input>')
        print('  py_api_wrapper.py anonymize <input> [method]')
        print('  py_api_wrapper.py synthetic-data <input>')
        sys.exit(2)

    cmd = sys.argv[1]
    inp = sys.argv[2]
    policy_user = sys.argv[3] if len(sys.argv) > 3 else 'superuser'
    data_element = sys.argv[4] if len(sys.argv) > 4 else 'name'

    if cmd == 'classify':
        out = classify(inp)
        print(json.dumps(out, indent=2))
    elif cmd == 'classify-tabular':
        out = classify_tabular(inp)
        print(json.dumps(out, indent=2))
    elif cmd == 'protect':
        out = protect(inp, policy_user, data_element)
        print(json.dumps(out, indent=2))
    elif cmd == 'unprotect':
        # Problem 3 fix: wire unprotect into CLI dispatch
        out = unprotect(inp, policy_user, data_element)
        print(json.dumps(out, indent=2))
    elif cmd == 'guardrail':
        try:
            messages = json.loads(inp)
        except Exception:
            messages = [{'role': 'user', 'content': inp}]
        out = guardrail(messages)
        print(json.dumps(out, indent=2))
    elif cmd == 'anonymize':
        method = sys.argv[3] if len(sys.argv) > 3 else 'redact'
        out = anonymize(inp, method)
        print(json.dumps(out, indent=2))
    elif cmd == 'synthetic-data':
        try:
            schema = json.loads(inp)
        except Exception:
            schema = {'fields': [{'name': inp, 'type': 'string'}]}
        out = synthetic_data(schema)
        print(json.dumps(out, indent=2))
    else:
        print('Unknown command', cmd)
        sys.exit(2)


if __name__ == '__main__':
    _cli()
