// Wrapper to call Protegrity APIs from plugin code.
// Classification and semantic guardrail use local/override HTTP endpoints.
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

module.exports = { classify, protect, guardrailScan };
