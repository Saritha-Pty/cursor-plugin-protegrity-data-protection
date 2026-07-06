#!/usr/bin/env node
// CLI wrapper runner to call api-wrapper functions from shell or scripts.
// Usage:
//   node wrapper-runner.js classify "text to classify"
//   node wrapper-runner.js protect "text to protect" "superuser" "name"
//   node wrapper-runner.js unprotect "<token>" "superuser" "name"
//   node wrapper-runner.js guardrail '[{"role":"user","content":"..."}]'

const path = require('path');
const wrapper = require(path.join(__dirname, 'api-wrapper'));

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: wrapper-runner.js <classify|protect|unprotect|guardrail> <input> [policy_user] [data_element]');
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
    } else if (cmd === 'protect') {
      const res = wrapper.protect(input, policyUser, dataElement);
      console.log(JSON.stringify(res, null, 2));
    } else if (cmd === 'unprotect') {
      const res = wrapper.unprotect(input, policyUser, dataElement);
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
