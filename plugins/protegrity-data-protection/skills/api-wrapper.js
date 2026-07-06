// Wrapper to call Protegrity APIs from plugin code.
// Classification and guardrail calls go to local Docker services (ports 8580/8581).
// Protect/unprotect uses the appython SDK via a Python subprocess — the SDK's
// hosted URL is internal; no localhost:8090 endpoint is used.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const fetch = require('node-fetch');

function loadConfig() {
  const cfgPath = path.join(__dirname, '..', 'config.json');
  try {
    const raw = fs.readFileSync(cfgPath, 'utf8');
    return JSON.parse(raw).protegrity || {};
  } catch (e) {
    return {};
  }
}

const cfg = loadConfig();

async function classify(text) {
  const url = process.env.PROTEGRITY_CLASSIFICATION_ENDPOINT || cfg.classification_endpoint;
  if (!url) throw new Error('classification endpoint not configured');
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (!resp.ok) throw new Error(`classification call failed: ${resp.status}`);
  return resp.json();
}

/**
 * Protect data via the appython SDK by delegating to py_api_wrapper.py.
 * Requires DEV_EDITION_EMAIL, DEV_EDITION_PASSWORD, DEV_EDITION_API_KEY env vars
 * and the protegrity-ai-developer-python package to be installed.
 */
function protect(data, policyUser = 'superuser', dataElement = 'name') {
  const pyWrapper = path.join(__dirname, 'py_api_wrapper.py');
  const out = execFileSync('python3', [
    pyWrapper, 'protect',
    '--input_data', data,
    '--policy_user', policyUser,
    '--data_element', dataElement
  ], { encoding: 'utf8', env: process.env });
  return JSON.parse(out);
}

/**
 * Unprotect a token via the appython SDK by delegating to py_api_wrapper.py.
 * Requires the same DEV_EDITION_* env vars and package as protect().
 */
function unprotect(token, policyUser = 'superuser', dataElement = 'name') {
  const pyWrapper = path.join(__dirname, 'py_api_wrapper.py');
  const out = execFileSync('python3', [
    pyWrapper, 'unprotect',
    '--input_data', token,
    '--policy_user', policyUser,
    '--data_element', dataElement
  ], { encoding: 'utf8', env: process.env });
  return JSON.parse(out);
}

async function guardrailScan(messages) {
  const url = process.env.PROTEGRITY_GUARDRAIL_ENDPOINT || cfg.semantic_guardrail_endpoint;
  if (!url) throw new Error('semantic guardrail endpoint not configured');
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  });
  if (!resp.ok) throw new Error(`guardrail call failed: ${resp.status}`);
  return resp.json();
}

module.exports = { classify, protect, unprotect, guardrailScan };
