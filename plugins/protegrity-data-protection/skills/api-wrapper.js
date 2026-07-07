// Wrapper to call Protegrity APIs from plugin code.
// Classification, semantic guardrail, synthetic data, and anonymization use
// local/override HTTP endpoints.
// Protection uses the official Protegrity SDK via the Python wrapper (appython).

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const { spawn } = require('child_process');

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

async function protect(data, policyUser = 'superuser', dataElement = 'name') {
  const email = process.env.DEV_EDITION_EMAIL;
  const password = process.env.DEV_EDITION_PASSWORD;
  const apiKey = process.env.DEV_EDITION_API_KEY;

  if (!email || !password || !apiKey) {
    throw new Error('Missing required environment variables: DEV_EDITION_EMAIL, DEV_EDITION_PASSWORD, DEV_EDITION_API_KEY');
  }

  const pyWrapperPath = path.join(__dirname, 'py_api_wrapper.py');

  return new Promise((resolve, reject) => {
    const child = spawn('python3', [pyWrapperPath, 'protect', String(data), String(policyUser), String(dataElement)], {
      env: process.env
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', (err) => {
      reject(new Error(`failed to start Python wrapper: ${err.message}`));
    });

    child.on('close', (code) => {
      if (code !== 0) {
        const detail = (stderr || stdout || '').trim();
        reject(new Error(`protection call failed (exit ${code})${detail ? ` - ${detail}` : ''}`));
        return;
      }

      try {
        const parsed = JSON.parse(stdout);
        resolve(parsed);
      } catch (e) {
        reject(new Error(`failed to parse protection response: ${e.message}`));
      }
    });
  });
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

async function generateSyntheticData(schema, count = 10, options = {}) {
  const url = process.env.PROTEGRITY_SYNTHETIC_ENDPOINT || cfg.synthetic_data_endpoint;
  if (!url) throw new Error('synthetic data endpoint not configured');
  const resp = await fetch(`${url}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ schema, count, format: 'json', preserve_distributions: true, ...options })
  });
  if (!resp.ok) throw new Error(`synthetic data call failed: ${resp.status}`);
  return resp.json();
}

async function anonymize(text, method = 'pseudonymization', entityTypes = null) {
  const url = process.env.PROTEGRITY_ANONYMIZATION_ENDPOINT || cfg.anonymization_endpoint;
  if (!url) throw new Error('anonymization endpoint not configured');
  const body = { text, method };
  if (entityTypes) body.entity_types = entityTypes;
  const resp = await fetch(`${url}/anonymize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!resp.ok) throw new Error(`anonymization call failed: ${resp.status}`);
  return resp.json();
}

async function checkServiceHealth(serviceUrl) {
  try {
    const base = serviceUrl.replace(/\/pty\/.*$/, '');
    const resp = await fetch(`${base}/health`, { method: 'GET' });
    return { reachable: true, status: resp.status, ok: resp.ok };
  } catch (e) {
    return { reachable: false, error: e.message };
  }
}

async function statusCheck() {
  const results = {
    services: {},
    credentials: {},
    availableCommands: []
  };

  // Check Docker services
  const services = [
    { name: 'Data Discovery', url: process.env.PROTEGRITY_CLASSIFICATION_ENDPOINT || cfg.classification_endpoint, port: 8580 },
    { name: 'Semantic Guardrail', url: process.env.PROTEGRITY_GUARDRAIL_ENDPOINT || cfg.semantic_guardrail_endpoint, port: 8581 },
    { name: 'Synthetic Data', url: process.env.PROTEGRITY_SYNTHETIC_ENDPOINT || cfg.synthetic_data_endpoint, port: 8095 },
    { name: 'Anonymization', url: process.env.PROTEGRITY_ANONYMIZATION_ENDPOINT || cfg.anonymization_endpoint, port: 8085 }
  ];

  for (const svc of services) {
    if (!svc.url) {
      results.services[svc.name] = { status: 'not configured', ok: false };
      continue;
    }
    const health = await checkServiceHealth(svc.url);
    results.services[svc.name] = health;
  }

  // Check API credentials
  const creds = ['DEV_EDITION_EMAIL', 'DEV_EDITION_PASSWORD', 'DEV_EDITION_API_KEY'];
  const credStatus = creds.reduce((acc, k) => { acc[k] = !!process.env[k]; return acc; }, {});
  results.credentials = credStatus;
  const allCredsSet = creds.every(k => credStatus[k]);

  const discoveryOk = results.services['Data Discovery'] && results.services['Data Discovery'].ok;
  const guardrailOk = results.services['Semantic Guardrail'] && results.services['Semantic Guardrail'].ok;
  const syntheticOk = results.services['Synthetic Data'] && results.services['Synthetic Data'].ok;
  const anonymizationOk = results.services['Anonymization'] && results.services['Anonymization'].ok;

  if (discoveryOk) {
    results.availableCommands.push('Analyze Data Sensitivity', 'Redact Sensitive Data', 'Find and Redact', 'Privacy Reviewer Agent');
  }
  if (allCredsSet) {
    results.availableCommands.push('Protect Text', 'Unprotect Text');
  }
  if (discoveryOk && allCredsSet) {
    results.availableCommands.push('Find and Protect');
  }
  if (guardrailOk) {
    results.availableCommands.push('Scan Conversation Risk');
  }
  if (syntheticOk) {
    results.availableCommands.push('Generate Synthetic Data');
  }
  if (anonymizationOk) {
    results.availableCommands.push('Anonymize Data');
  }

  return results;
}

module.exports = { classify, protect, guardrailScan, generateSyntheticData, anonymize, statusCheck };
