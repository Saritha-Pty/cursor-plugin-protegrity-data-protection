// Example: replace MCP code with direct api client usage.

import apiClient from '../src/apiClient';
import { config } from '../src/config';

// previous code likely referenced an MCP client; remove that import and code.

// New direct protect handler
export async function handleProtectSkill(input: any) {
  // Validate input...
  try {
    const result = await apiClient.protect({
      // map input to API payload as required by your Protegrity endpoints
      data: input.text,
      // other metadata...
    });
    return result;
  } catch (err) {
    // handle error (log, rethrow, return plugin-friendly error)
    throw err;
  }
}
