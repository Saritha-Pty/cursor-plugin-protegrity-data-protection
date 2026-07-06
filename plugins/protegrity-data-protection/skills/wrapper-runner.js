#!/usr/bin/env node
// CLI wrapper runner to call api-wrapper functions from shell or scripts.
// Usage:
//   node wrapper-runner.js classify "text to classify"
//   node wrapper-runner.js classify-tabular "csv,data"
//   node wrapper-runner.js protect "text to protect" "superuser" "name"
//   node wrapper-runner.js unprotect "<token>" "superuser" "name"
//   node wrapper-runner.js guardrail '[{"role":"user","content":"..."}]'
//   node wrapper-runner.js anonymize "data" "redact"
//   node wrapper-runner.js synthetic-data '{"fields":[{"name":"x","type":"string"}]}'

const path = require('path');
const wrapper = require(path.join(__dirname, 'api-wrapper'));

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage:');
    console.error('  wrapper-runner.js classify <input>');
    console.error('  wrapper-runner.js classify-tabular <input>');
    console.error('  wrapper-runner.js protect <input> [policy_user] [data_element]');
    console.error('  wrapper-runner.js unprotect <input> [policy_user] [data_element]');
    console.error('  wrapper-runner.js guardrail <input>');
    console.error('  wrapper-runner.js anonymize <input> [method]');
    console.error('  wrapper-runner.js synthetic-data <input>');
    process.exit(2);
  }
  const cmd = args[0];
  const input = args[1];
  const policyUser = args[2] || 'superuser';
  const dataElement = args[3] || 'name';

  try {
    if (cmd === 'classify') {
      const res = await wrapper.classify(input);
      console.log(JSON.stringify(res, null, 2));
    } else if (cmd === 'classify-tabular') {
      const res = await wrapper.classifyTabular(input);
      console.log(JSON.stringify(res, null, 2));
    } else if (cmd === 'protect') {
      const res = await wrapper.protect(input, policyUser, dataElement);
      console.log(JSON.stringify(res, null, 2));
    } else if (cmd === 'unprotect') {
      const res = await wrapper.unprotect(input, policyUser, dataElement);
      console.log(JSON.stringify(res, null, 2));
    } else if (cmd === 'guardrail') {
      let messages;
      try {
        messages = JSON.parse(input);
      } catch (e) {
        // allow single-message shorthand
        messages = [{ role: 'user', content: input }];
      }
      const res = await wrapper.guardrailScan(messages);
      console.log(JSON.stringify(res, null, 2));
    } else if (cmd === 'anonymize') {
      const method = args[2] || 'redact';
      const res = await wrapper.anonymize(input, method);
      console.log(JSON.stringify(res, null, 2));
    } else if (cmd === 'synthetic-data') {
      let schema;
      try {
        schema = JSON.parse(input);
      } catch (e) {
        schema = { fields: [{ name: input, type: 'string' }] };
      }
      const res = await wrapper.syntheticData(schema);
      console.log(JSON.stringify(res, null, 2));
    } else {
      console.error('Unknown command', cmd);
      process.exit(2);
    }
  } catch (err) {
    console.error('Error:', err && err.message ? err.message : err);
    process.exit(1);
  }
}

main();
