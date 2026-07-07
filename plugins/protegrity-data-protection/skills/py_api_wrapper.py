#!/usr/bin/env python3
"""Python wrapper for Protegrity plugin operations.

- classify/guardrail/synthetic/anonymize use local REST endpoints from config or env.
- protect/unprotect use the official Protegrity AI Developer Edition SDK
  (PyPI package: protegrity-ai-developer-python, import name: appython)
  and DEV_EDITION_* env vars.
- status: checks all service endpoints and credentials.
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


def synthetic_data_endpoint():
    return os.environ.get('PROTEGRITY_SYNTHETIC_ENDPOINT') or CFG.get('synthetic_data_endpoint')


def anonymization_endpoint():
    return os.environ.get('PROTEGRITY_ANONYMIZATION_ENDPOINT') or CFG.get('anonymization_endpoint')


def classify(text):
    url = classification_endpoint()
    if not url:
        raise RuntimeError('classification endpoint not configured')
    resp = requests.post(url, json={'text': text})
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


def generate_synthetic_data(schema, count=10, options=None):
    """Generate synthetic data records using the Protegrity Synthetic Data API."""
    url = synthetic_data_endpoint()
    if not url:
        raise RuntimeError('synthetic data endpoint not configured')
    payload = {
        'schema': schema,
        'count': count,
        'format': 'json',
        'preserve_distributions': True,
    }
    if options:
        payload.update(options)
    resp = requests.post(f'{url}/generate', json=payload)
    resp.raise_for_status()
    return resp.json()


def anonymize(text, method='pseudonymization', entity_types=None):
    """Anonymize text using the Protegrity Anonymization API."""
    url = anonymization_endpoint()
    if not url:
        raise RuntimeError('anonymization endpoint not configured')
    payload = {'text': text, 'method': method}
    if entity_types:
        payload['entity_types'] = entity_types
    resp = requests.post(f'{url}/anonymize', json=payload)
    resp.raise_for_status()
    return resp.json()


def status_check():
    """Check all Protegrity service endpoints and credentials.

    Returns a dict with service health, credential status, and available commands.
    """
    results = {'services': {}, 'credentials': {}, 'available_commands': []}

    service_map = {
        'Data Discovery': classification_endpoint(),
        'Semantic Guardrail': guardrail_endpoint(),
        'Synthetic Data': synthetic_data_endpoint(),
        'Anonymization': anonymization_endpoint(),
    }

    for name, url in service_map.items():
        if not url:
            results['services'][name] = {'ok': False, 'reason': 'not configured'}
            continue
        try:
            base = url.split('/pty/')[0] if '/pty/' in url else url.rsplit('/', 3)[0]
            health = requests.get(f'{base}/health', timeout=5)
            results['services'][name] = {'ok': health.ok, 'status': health.status_code}
        except Exception as exc:
            results['services'][name] = {'ok': False, 'reason': str(exc)}

    creds = ['DEV_EDITION_EMAIL', 'DEV_EDITION_PASSWORD', 'DEV_EDITION_API_KEY']
    for k in creds:
        results['credentials'][k] = bool(os.environ.get(k))
    all_creds = all(results['credentials'].values())

    discovery_ok = results['services'].get('Data Discovery', {}).get('ok', False)
    guardrail_ok = results['services'].get('Semantic Guardrail', {}).get('ok', False)
    synthetic_ok = results['services'].get('Synthetic Data', {}).get('ok', False)
    anon_ok = results['services'].get('Anonymization', {}).get('ok', False)

    if discovery_ok:
        results['available_commands'].extend([
            'Analyze Data Sensitivity', 'Redact Sensitive Data',
            'Find and Redact', 'Privacy Reviewer Agent',
        ])
    if all_creds:
        results['available_commands'].extend(['Protect Text', 'Unprotect Text'])
    if discovery_ok and all_creds:
        results['available_commands'].append('Find and Protect')
    if guardrail_ok:
        results['available_commands'].append('Scan Conversation Risk')
    if synthetic_ok:
        results['available_commands'].append('Generate Synthetic Data')
    if anon_ok:
        results['available_commands'].append('Anonymize Data')

    return results


def _cli():
    if len(sys.argv) < 2:
        print('Usage: py_api_wrapper.py <classify|protect|unprotect|guardrail|synthetic|anonymize|status> <input> [extra args...]')
        sys.exit(2)

    cmd = sys.argv[1]

    if cmd == 'status':
        out = status_check()
        print(json.dumps(out, indent=2))
        return

    if len(sys.argv) < 3:
        print(f'Usage: py_api_wrapper.py {cmd} <input> [extra args...]')
        sys.exit(2)

    inp = sys.argv[2]
    policy_user = sys.argv[3] if len(sys.argv) > 3 else 'superuser'
    data_element = sys.argv[4] if len(sys.argv) > 4 else 'name'

    if cmd == 'classify':
        out = classify(inp)
        print(json.dumps(out, indent=2))
    elif cmd == 'protect':
        out = protect(inp, policy_user, data_element)
        print(json.dumps(out, indent=2))
    elif cmd == 'unprotect':
        out = unprotect(inp, policy_user, data_element)
        print(json.dumps(out, indent=2))
    elif cmd == 'guardrail':
        try:
            messages = json.loads(inp)
        except Exception:
            messages = [{'role': 'user', 'content': inp}]
        out = guardrail(messages)
        print(json.dumps(out, indent=2))
    elif cmd == 'synthetic':
        try:
            schema = json.loads(inp)
        except Exception:
            print('synthetic: input must be a JSON array of schema fields', file=sys.stderr)
            sys.exit(2)
        count = int(sys.argv[3]) if len(sys.argv) > 3 else 10
        out = generate_synthetic_data(schema, count)
        print(json.dumps(out, indent=2))
    elif cmd == 'anonymize':
        method = sys.argv[3] if len(sys.argv) > 3 else 'pseudonymization'
        entity_types = sys.argv[4].split(',') if len(sys.argv) > 4 else None
        out = anonymize(inp, method, entity_types)
        print(json.dumps(out, indent=2))
    else:
        print('Unknown command:', cmd)
        print('Available: classify, protect, unprotect, guardrail, synthetic, anonymize, status')
        sys.exit(2)


if __name__ == '__main__':
    _cli()
