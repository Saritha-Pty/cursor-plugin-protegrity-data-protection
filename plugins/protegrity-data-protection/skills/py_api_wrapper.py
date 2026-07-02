#!/usr/bin/env python3
"""Minimal Python wrapper to call Protegrity HTTP endpoints.
Reads endpoints from plugins/protegrity-data-protection/config.json (relative path)
or from environment variables:
  PROTEGRITY_CLASSIFICATION_ENDPOINT
  PROTEGRITY_PROTECTION_ENDPOINT
  PROTEGRITY_GUARDRAIL_ENDPOINT

Usage:
  python3 py_api_wrapper.py classify "text to classify"
  python3 py_api_wrapper.py protect "text to protect" "superuser" "name"
  python3 py_api_wrapper.py guardrail '[{"role":"user","content":"..."}]'

Note: This module uses the 'requests' library. Install with:
  pip install requests
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
            cfg = json.load(f).get('protegrity', {})
            return cfg
    except Exception:
        return {}

CFG = load_config()

def classification_endpoint():
    return os.environ.get('PROTEGRITY_CLASSIFICATION_ENDPOINT') or CFG.get('classification_endpoint')

def protection_endpoint():
    return os.environ.get('PROTEGRITY_PROTECTION_ENDPOINT') or CFG.get('protection_endpoint')

def guardrail_endpoint():
    return os.environ.get('PROTEGRITY_GUARDRAIL_ENDPOINT') or CFG.get('semantic_guardrail_endpoint')

def classify(text):
    url = classification_endpoint()
    if not url:
        raise RuntimeError('classification endpoint not configured')
    resp = requests.post(url, json={'text': text})
    resp.raise_for_status()
    return resp.json()

def protect(data, policy_user='superuser', data_element='name'):
    """Protect sensitive data using Protegrity tokenization.
    
    Args:
        data: The text/data to protect
        policy_user: Policy user (default: 'superuser')
        data_element: Data element type (default: 'name')
    
    Returns:
        Protected token response from API
    
    Raises:
        RuntimeError: If endpoint not configured or auth credentials missing
    """
    url = protection_endpoint()
    if not url:
        raise RuntimeError('protection endpoint not configured')
    
    email = os.environ.get('DEV_EDITION_EMAIL')
    password = os.environ.get('DEV_EDITION_PASSWORD')
    api_key = os.environ.get('DEV_EDITION_API_KEY')
    
    if not email or not password or not api_key:
        raise RuntimeError('Missing required environment variables: DEV_EDITION_EMAIL, DEV_EDITION_PASSWORD, DEV_EDITION_API_KEY')
    
    payload = {
        'data': data,
        'policy_user': policy_user,
        'data_element': data_element,
        'email': email,
        'password': password,
        'api_key': api_key
    }
    
    resp = requests.post(url, json=payload)
    resp.raise_for_status()
    return resp.json()

def guardrail(messages):
    url = guardrail_endpoint()
    if not url:
        raise RuntimeError('semantic guardrail endpoint not configured')
    resp = requests.post(url, json={'messages': messages})
    resp.raise_for_status()
    return resp.json()

def _cli():
    if len(sys.argv) < 3:
        print('Usage: py_api_wrapper.py <classify|protect|guardrail> <input> [policy_user] [data_element]')
        sys.exit(2)
    cmd = sys.argv[1]
    inp = sys.argv[2]
    policy_user = sys.argv[3] if len(sys.argv) > 3 else 'superuser'
    data_element = sys.argv[4] if len(sys.argv) > 4 else 'name'
    
    if cmd == 'classify':
        out = classify(inp)
        print(json.dumps(out, indent=2))
    elif cmd == 'protect':
        out = protect(inp, policy_user, data_element)
        print(json.dumps(out, indent=2))
    elif cmd == 'guardrail':
        try:
            messages = json.loads(inp)
        except Exception:
            messages = [{'role': 'user', 'content': inp}]
        out = guardrail(messages)
        print(json.dumps(out, indent=2))
    else:
        print('Unknown command', cmd)
        sys.exit(2)

if __name__ == '__main__':
    _cli()
