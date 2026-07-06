const { EventEmitter } = require('events');

jest.mock('node-fetch', () => jest.fn());
jest.mock('child_process', () => ({ spawn: jest.fn() }));

const fetch = require('node-fetch');
const { spawn } = require('child_process');
const wrapper = require('../skills/api-wrapper');

function makeChildProcess(stdoutPayload = '') {
  const child = new EventEmitter();
  child.stdout = new EventEmitter();
  child.stderr = new EventEmitter();
  process.nextTick(() => {
    if (stdoutPayload) {
      child.stdout.emit('data', Buffer.from(stdoutPayload));
    }
    child.emit('close', 0);
  });
  return child;
}

describe('api-wrapper new operations', () => {
  beforeEach(() => {
    fetch.mockReset();
    spawn.mockReset();
    process.env.PROTEGRITY_CLASSIFICATION_ENDPOINT = 'http://localhost:8580/pty/data-discovery/v2.0/classify';
    process.env.PROTEGRITY_ANONYMIZATION_ENDPOINT = 'http://localhost:8085/pty/anonymization/v3';
    process.env.PROTEGRITY_SYNTHETIC_DATA_ENDPOINT = 'http://localhost:8095/pty/syntheticdata/v2';
    process.env.DEV_EDITION_EMAIL = 'user@example.com';
    process.env.DEV_EDITION_PASSWORD = 'password';
    process.env.DEV_EDITION_API_KEY = 'key';
  });

  test('classifyTabular sends tabular format payload', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true })
    });

    const res = await wrapper.classifyTabular('name,email\nAlice,a@example.com');

    expect(res).toEqual({ ok: true });
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8580/pty/data-discovery/v2.0/classify',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ data: 'name,email\nAlice,a@example.com', format: 'tabular' })
      })
    );
  });

  test('anonymize calls anonymization endpoint', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ anonymized: true })
    });

    const res = await wrapper.anonymize('John Smith', 'redact');

    expect(res).toEqual({ anonymized: true });
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8085/pty/anonymization/v3',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ data: 'John Smith', method: 'redact' })
      })
    );
  });

  test('syntheticData appends /generate path', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ rows: [] })
    });

    const schema = { fields: [{ name: 'email', type: 'email' }] };
    const res = await wrapper.syntheticData(schema);

    expect(res).toEqual({ rows: [] });
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8095/pty/syntheticdata/v2/generate',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ schema })
      })
    );
  });

  test('unprotect uses python wrapper unprotect command', async () => {
    spawn.mockReturnValue(makeChildProcess(JSON.stringify({ unprotected: 'John Smith' })));

    const result = await wrapper.unprotect('<token>', 'superuser', 'name');

    expect(result).toEqual({ unprotected: 'John Smith' });
    expect(spawn).toHaveBeenCalledWith(
      'python3',
      expect.arrayContaining([expect.stringContaining('py_api_wrapper.py'), 'unprotect', '<token>', 'superuser', 'name']),
      expect.any(Object)
    );
  });
});
