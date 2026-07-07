#!/usr/bin/env node
// CLI wrapper runner to call api-wrapper functions from shell or scripts.
// Usage:
//   node wrapper-runner.js classify "text to classify"
//   node wrapper-runner.js protect "text to protect" "superuser" "name"
//   node wrapper-runner.js unprotect "<token>" "superuser" "name"
//   node wrapper-runner.js guardrail '[{"role":"user","content":"..."}]'
//   node wrapper-runner.js synthetic '[{"name":"email","type":"EMAIL_ADDRESS"}]' 10
//   node wrapper-runner.js anonymize "text with PII" "pseudonymization"
//   node wrapper-runner.js status

const path = require('path');
const wrapper = require(path.join(__dirname, 'api-wrapper'));
const { spawn } = require('child_process');

function callPyWrapper(args) {
  return new Promise((resolve, reject) => {
    const pyScript = path.join(__dirname, 'py_api_wrapper.py');
    const child = spawn('python3', [pyScript, ...args], { env: process.env });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => { stdout += d.toString(); });
    child.stderr.on('data', (d) => { stderr += d.toString(); });
    child.on('error', (e) => reject(new Error(`failed to start Python wrapper: ${e.message}`)));
    child.on('close', (code) => {
      if (code !== 0) {
        const detail = (stderr || stdout || '').trim();
        reject(new Error(`Python wrapper exited ${code}${detail ? ` — ${detail}` : ''}`));
        return;
      }
      try { resolve(JSON.parse(stdout)); } catch (e) { reject(new Error(`failed to parse response: ${e.message}`)); }
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Usage: wrapper-runner.js <classify|protect|unprotect|guardrail|synthetic|anonymize|status> <input> [extra args...]');
    process.exit(2);
  }
  const cmd = args[0];
  const input = args[1];
  const arg3 = args[2] || 'superuser';
  const arg4 = args[3] || 'name';

  try {
    if (cmd === 'classify') {
      const res = await wrapper.classify(input);
      console.log(JSON.stringify(res, null, 2));
    } else if (cmd === 'protect') {
      const res = await callPyWrapper(['protect', input, arg3, arg4]);
      console.log(JSON.stringify(res, null, 2));
    } else if (cmd === 'unprotect') {
      const res = await callPyWrapper(['unprotect', input, arg3, arg4]);
      console.log(JSON.stringify(res, null, 2));
    } else if (cmd === 'guardrail') {
      let messages;
      try {
        messages = JSON.parse(input);
      } catch (e) {
        messages = [{ role: 'user', content: input }];
      }
      const res = await wrapper.guardrailScan(messages);
      console.log(JSON.stringify(res, null, 2));
    } else if (cmd === 'synthetic') {
      let schema;
      try {
        schema = JSON.parse(input);
      } catch (e) {
        console.error('synthetic: input must be a JSON array of schema fields');
        process.exit(2);
      }
      const count = parseInt(arg3, 10) || 10;
      const res = await wrapper.generateSyntheticData(schema, count);
      console.log(JSON.stringify(res, null, 2));
    } else if (cmd === 'anonymize') {
      const method = arg3 !== 'superuser' ? arg3 : 'pseudonymization';
      const entityTypes = arg4 ? arg4.split(',') : null;
      const res = await wrapper.anonymize(input, method, entityTypes);
      console.log(JSON.stringify(res, null, 2));
    } else if (cmd === 'status') {
      const res = await wrapper.statusCheck();
      // Pretty-print status
      console.log('\n╔══════════════════════════════════════════════════════╗');
      console.log('║         Protegrity Developer Edition — Status        ║');
      console.log('╚══════════════════════════════════════════════════════╝\n');
      console.log('🐳 Docker Services');
      for (const [name, info] of Object.entries(res.services)) {
        const icon = info.ok ? '  ✅' : '  ❌';
        const statusText = info.ok ? 'RUNNING' : (info.reachable ? `HTTP ${info.status}` : 'OFFLINE');
        console.log(`${icon} ${name.padEnd(22)} → ${statusText}`);
      }
      console.log('\n🔑 API Credentials');
      for (const [key, set] of Object.entries(res.credentials)) {
        console.log(`  ${set ? '✅' : '❌'} ${key.padEnd(28)} → ${set ? 'Set' : 'NOT SET'}`);
      }
      console.log('\n📋 Available Commands');
      if (res.availableCommands.length === 0) {
        console.log('  ❌ No commands available — start services or configure credentials');
      } else {
        res.availableCommands.forEach(c => console.log(`  ✅ ${c}`));
      }
      console.log(`\n${res.availableCommands.length} command(s) available.\n`);
      console.log(JSON.stringify(res, null, 2));
    } else {
      console.error('Unknown command:', cmd);
      console.error('Available: classify, protect, unprotect, guardrail, synthetic, anonymize, status');
      process.exit(2);
    }
  } catch (err) {
    console.error('❌ Error:', err && err.message ? err.message : err);
    process.exit(1);
  }
}

main();
