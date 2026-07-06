#!/usr/bin/env python3
"""Python wrapper for Protegrity plugin operations.

- classify/guardrail use local REST endpoints from config or env.
- protect uses official Protegrity AI Developer Edition SDK (PyPI package:
  protegrity-ai-developer-python, import name: appython) and DEV_EDITION_* env vars.
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


def _extract_sdk_token(result):
    if isinstance(result, dict):
        for key in ('protected_token', 'token', 'protected_data', 'value', 'result'):
            if key in result and result[key] is not None:
                return {'protected_token': result[key], 'raw': result}
        return {'raw': result}
    if isinstance(result, str):
        return {'protected_token': result}
    return {'raw': result}


def protect(data, policy_user='superuser', data_element='name'):
    """Protect sensitive data using official appython SDK and DEV_EDITION_* env vars."""
    email = os.environ.get('DEV_EDITION_EMAIL')
    password = os.environ.get('DEV_EDITION_PASSWORD')
    api_key = os.environ.get('DEV_EDITION_API_KEY')

    if not email or not password or not api_key:
        raise RuntimeError('Missing required environment variables: DEV_EDITION_EMAIL, DEV_EDITION_PASSWORD, DEV_EDITION_API_KEY')

    try:
        import appython
    except ImportError:
        raise RuntimeError('Missing dependency: protegrity-ai-developer-python (import appython). Install with: pip install protegrity-ai-developer-python')

    # Try common client entrypoints/method names to stay compatible with SDK revisions.
    candidates = []

    if hasattr(appython, 'Client'):
        try:
            candidates.append(appython.Client(email=email, password=password, api_key=api_key))
        except Exception:
            pass
    if hasattr(appython, 'AppythonClient'):
        try:
            candidates.append(appython.AppythonClient(email=email, password=password, api_key=api_key))
        except Exception:
            pass

    # Module-level fallback calls
    module_level_methods = [
        'protect',
        'protect_data',
        'tokenize',
        'tokenize_data',
    ]

    method_names = [
        'protect',
        'protect_data',
        'tokenize',
        'tokenize_data',
    ]

    kwargs = {
        'input_data': data,
        'policy_user': policy_user,
        'data_element': data_element,
    }

    # 1) Try object methods on discovered clients
    for client in candidates:
        for method_name in method_names:
            method = getattr(client, method_name, None)
            if callable(method):
                try:
                    result = method(**kwargs)
                    return _extract_sdk_token(result)
                except TypeError:
                    # Some SDK versions may use positional params
                    try:
                        result = method(data, policy_user, data_element)
                        return _extract_sdk_token(result)
                    except Exception:
                        pass
                except Exception:
                    pass

    # 2) Try module-level methods
    for method_name in module_level_methods:
        method = getattr(appython, method_name, None)
        if callable(method):
            try:
                result = method(**kwargs)
                return _extract_sdk_token(result)
            except TypeError:
                try:
                    result = method(data, policy_user, data_element)
                    return _extract_sdk_token(result)
                except Exception:
                    pass
            except Exception:
                pass

    raise RuntimeError('Unable to invoke protect via appython SDK. Verify installed SDK version and method names.')


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
