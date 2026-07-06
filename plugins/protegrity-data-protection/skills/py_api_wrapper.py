#!/usr/bin/env python3
"""Python wrapper to call Protegrity APIs.

- Classification (PII detection): calls the local Docker service at
  http://localhost:8580 (or PROTEGRITY_CLASSIFICATION_ENDPOINT).
- Protect / Unprotect (tokenization): uses the official appython SDK
  (pip install protegrity-ai-developer-python).  Credentials are read
  from environment variables DEV_EDITION_EMAIL, DEV_EDITION_PASSWORD,
  DEV_EDITION_API_KEY.  No localhost endpoint is involved.
- Guardrail (conversation risk): calls the local Docker service at
  http://localhost:8581 (or PROTEGRITY_GUARDRAIL_ENDPOINT).

Usage:
  python3 py_api_wrapper.py classify "text to classify"
  python3 py_api_wrapper.py protect --input_data "John Smith" --policy_user superuser --data_element name
  python3 py_api_wrapper.py unprotect --input_data "<token>" --policy_user superuser --data_element name
  python3 py_api_wrapper.py guardrail '[{"role":"user","content":"..."}]'

Dependencies:
  pip install requests protegrity-ai-developer-python
"""

import argparse
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
            cfg = json.load(f).get('protegrity', {})
            return cfg
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

def _get_sdk_client():
    """Instantiate the appython SDK client using DEV_EDITION_* env vars."""
    try:
        from appython import Protegrity  # protegrity-ai-developer-python
    except ImportError:
        raise RuntimeError(
            'Missing dependency: protegrity-ai-developer-python. '
            'Install with: pip install protegrity-ai-developer-python'
        )

    email = os.environ.get('DEV_EDITION_EMAIL')
    password = os.environ.get('DEV_EDITION_PASSWORD')
    api_key = os.environ.get('DEV_EDITION_API_KEY')

    if not email or not password or not api_key:
        raise RuntimeError(
            'Missing required environment variables: '
            'DEV_EDITION_EMAIL, DEV_EDITION_PASSWORD, DEV_EDITION_API_KEY'
        )

    init_kwargs = dict(email=email, api_key=api_key)
    init_kwargs['password'] = password
    return Protegrity(**init_kwargs)

def protect(input_data, policy_user='superuser', data_element='name'):
    """Protect sensitive data using the appython SDK (tokenization).

    Args:
        input_data: The text/data to protect.
        policy_user: Policy user (default: 'superuser').
        data_element: Data element type (default: 'name').

    Returns:
        dict with the protected token returned by the SDK.
    """
    client = _get_sdk_client()
    return client.protect(
        input_data=input_data,
        policy_user=policy_user,
        data_element=data_element,
    )

def unprotect(input_data, policy_user='superuser', data_element='name'):
    """Unprotect a token back to the original value using the appython SDK.

    Args:
        input_data: The protected token to reverse.
        policy_user: Policy user used when the token was created.
        data_element: Data element type used when the token was created.

    Returns:
        dict with the original (unprotected) value returned by the SDK.
    """
    client = _get_sdk_client()
    return client.unprotect(
        input_data=input_data,
        policy_user=policy_user,
        data_element=data_element,
    )

def guardrail(messages):
    url = guardrail_endpoint()
    if not url:
        raise RuntimeError('semantic guardrail endpoint not configured')
    resp = requests.post(url, json={'messages': messages})
    resp.raise_for_status()
    return resp.json()

def _cli():
    if len(sys.argv) < 2:
        print(
            'Usage: py_api_wrapper.py <classify|protect|unprotect|guardrail> ...\n'
            '  classify   <text>\n'
            '  protect    --input_data <text> [--policy_user <user>] [--data_element <elem>]\n'
            '  unprotect  --input_data <token> [--policy_user <user>] [--data_element <elem>]\n'
            '  guardrail  <json-messages-or-plain-text>'
        )
        sys.exit(2)

    cmd = sys.argv[1]

    if cmd == 'classify':
        if len(sys.argv) < 3:
            print('Usage: py_api_wrapper.py classify <text>', file=sys.stderr)
            sys.exit(2)
        out = classify(sys.argv[2])
        print(json.dumps(out, indent=2))

    elif cmd in ('protect', 'unprotect'):
        parser = argparse.ArgumentParser(prog=f'py_api_wrapper.py {cmd}')
        parser.add_argument('--input_data', required=True, help='Data to protect/unprotect')
        parser.add_argument('--policy_user', default='superuser', help='Policy user (default: superuser)')
        parser.add_argument('--data_element', default='name', help='Data element type (default: name)')
        args = parser.parse_args(sys.argv[2:])
        fn = protect if cmd == 'protect' else unprotect
        out = fn(args.input_data, args.policy_user, args.data_element)
        print(json.dumps(out, indent=2))

    elif cmd == 'guardrail':
        if len(sys.argv) < 3:
            print('Usage: py_api_wrapper.py guardrail <json-or-text>', file=sys.stderr)
            sys.exit(2)
        inp = sys.argv[2]
        try:
            messages = json.loads(inp)
        except Exception:
            messages = [{'role': 'user', 'content': inp}]
        out = guardrail(messages)
        print(json.dumps(out, indent=2))

    else:
        print(f'Unknown command: {cmd}', file=sys.stderr)
        sys.exit(2)

if __name__ == '__main__':
    _cli()
