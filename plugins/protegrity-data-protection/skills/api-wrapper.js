// Wrapper to call Protegrity APIs from plugin code.
// This is a minimal JS module used by skills to call classification and guardrail endpoints.

const fs = require('fs');
const path = require('path');
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

module.exports = { classify, guardrailScan };
