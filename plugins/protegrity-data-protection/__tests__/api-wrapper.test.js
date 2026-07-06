'use strict';

// Mock node-fetch before requiring the module under test
jest.mock('node-fetch');
const fetch = require('node-fetch');
const { Response } = jest.requireActual('node-fetch');

// Mock child_process.execFileSync so tests don't spawn real Python processes
jest.mock('child_process');
const { execFileSync } = require('child_process');

const path = require('path');
const WRAPPER_PATH = path.join(__dirname, '..', 'skills', 'api-wrapper');

// Mock fs so config.json can be controlled per test
jest.mock('fs');
const fs = require('fs');

// Default: return a config with no endpoints so we control endpoint resolution
// via env vars only. Individual tests can override this.
fs.readFileSync.mockReturnValue(JSON.stringify({ protegrity: {} }));

// Require the wrapper after mocks are in place
const wrapper = require(WRAPPER_PATH);

beforeEach(() => {
  jest.clearAllMocks();
  // Re-apply the default fs mock after clearAllMocks resets it
  fs.readFileSync.mockReturnValue(JSON.stringify({ protegrity: {} }));
  delete process.env.PROTEGRITY_CLASSIFICATION_ENDPOINT;
  delete process.env.PROTEGRITY_GUARDRAIL_ENDPOINT;
});

// ---------------------------------------------------------------------------
// classify()
// ---------------------------------------------------------------------------
describe('classify()', () => {
  it('calls the classification endpoint and returns parsed JSON', async () => {
    process.env.PROTEGRITY_CLASSIFICATION_ENDPOINT = 'http://localhost:8580/classify';
    const mockPayload = { entities: [{ type: 'PERSON', score: 0.99 }] };
    fetch.mockResolvedValueOnce(new Response(JSON.stringify(mockPayload), { status: 200 }));

    const result = await wrapper.classify('John Smith');

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8580/classify',
      expect.objectContaining({ method: 'POST' })
    );
    expect(result).toEqual(mockPayload);
  });

  it('throws when no classification endpoint is configured', async () => {
    // No env var and config returns empty protegrity object
    await expect(wrapper.classify('some text')).rejects.toThrow('classification endpoint not configured');
  });

  it('throws when the HTTP response is not ok', async () => {
    process.env.PROTEGRITY_CLASSIFICATION_ENDPOINT = 'http://localhost:8580/classify';
    fetch.mockResolvedValueOnce(new Response('Server Error', { status: 500 }));

    await expect(wrapper.classify('text')).rejects.toThrow('classification call failed: 500');
  });
});

// ---------------------------------------------------------------------------
// protect()
// ---------------------------------------------------------------------------
describe('protect()', () => {
  it('delegates to the Python subprocess and parses its JSON output', () => {
    const sdkResult = { protected_token: 'tok_abc123', status: 'success' };
    execFileSync.mockReturnValueOnce(JSON.stringify(sdkResult));

    const result = wrapper.protect('John Smith', 'superuser', 'name');

    expect(execFileSync).toHaveBeenCalledTimes(1);
    const [cmd, args] = execFileSync.mock.calls[0];
    expect(cmd).toBe('python3');
    expect(args).toContain('protect');
    expect(args).toContain('--input_data');
    expect(args).toContain('John Smith');
    expect(args).toContain('--policy_user');
    expect(args).toContain('superuser');
    expect(args).toContain('--data_element');
    expect(args).toContain('name');
    expect(result).toEqual(sdkResult);
  });

  it('uses default policyUser and dataElement when omitted', () => {
    execFileSync.mockReturnValueOnce(JSON.stringify({ protected_token: 'tok' }));
    wrapper.protect('test');
    const [, args] = execFileSync.mock.calls[0];
    expect(args).toContain('superuser');
    expect(args).toContain('name');
  });
});

// ---------------------------------------------------------------------------
// unprotect()
// ---------------------------------------------------------------------------
describe('unprotect()', () => {
  it('delegates to the Python subprocess and parses its JSON output', () => {
    const sdkResult = { original_value: 'John Smith', status: 'success' };
    execFileSync.mockReturnValueOnce(JSON.stringify(sdkResult));

    const result = wrapper.unprotect('tok_abc123', 'superuser', 'name');

    expect(execFileSync).toHaveBeenCalledTimes(1);
    const [cmd, args] = execFileSync.mock.calls[0];
    expect(cmd).toBe('python3');
    expect(args).toContain('unprotect');
    expect(args).toContain('--input_data');
    expect(args).toContain('tok_abc123');
    expect(result).toEqual(sdkResult);
  });
});

// ---------------------------------------------------------------------------
// guardrailScan()
// ---------------------------------------------------------------------------
describe('guardrailScan()', () => {
  it('calls the guardrail endpoint and returns parsed JSON', async () => {
    process.env.PROTEGRITY_GUARDRAIL_ENDPOINT = 'http://localhost:8581/scan';
    const mockPayload = { risk_score: 0.1, action: 'allow' };
    fetch.mockResolvedValueOnce(new Response(JSON.stringify(mockPayload), { status: 200 }));

    const messages = [{ role: 'user', content: 'Hello' }];
    const result = await wrapper.guardrailScan(messages);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8581/scan',
      expect.objectContaining({ method: 'POST' })
    );
    expect(result).toEqual(mockPayload);
  });

  it('throws when no guardrail endpoint is configured', async () => {
    await expect(wrapper.guardrailScan([])).rejects.toThrow('semantic guardrail endpoint not configured');
  });

  it('throws when the HTTP response is not ok', async () => {
    process.env.PROTEGRITY_GUARDRAIL_ENDPOINT = 'http://localhost:8581/scan';
    fetch.mockResolvedValueOnce(new Response('Bad Request', { status: 400 }));
    await expect(wrapper.guardrailScan([])).rejects.toThrow('guardrail call failed: 400');
  });
});
