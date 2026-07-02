// Simple API client that calls Protegrity DEV edition HTTP endpoints directly.
// Uses global fetch (Node 18+) — if you run on older Node, install node-fetch and uncomment the import.
// import fetch from 'node-fetch';

import { config } from './config';

function baseUrl() {
  if (config.devEditionUrl) return config.devEditionUrl.replace(/\/$/, '');
  return config.defaultLocalDataUrl.replace(/\/$/, '');
}

function adminBaseUrl() {
  if (config.devEditionAdminUrl) return config.devEditionAdminUrl.replace(/\/$/, '');
  return config.defaultLocalAdminUrl.replace(/\/$/, '');
}

function getAuthHeaders() {
  const headers: Record<string,string> = { 'Content-Type': 'application/json' };
  if (config.devEditionApiKey) headers['Authorization'] = `Bearer ${config.devEditionApiKey}`;
  return headers;
}

async function handleResponse(res: Response) {
  const text = await res.text();
  if (!res.ok) {
    let body = text;
    try { body = JSON.parse(text); } catch { /* ignore */ }
    throw new Error(`Protegrity API error ${res.status}: ${JSON.stringify(body)}`);
  }
  try { return JSON.parse(text); } catch { return text; }
}

export async function protect(payload: any) {
  const url = `${baseUrl()}/protect`;
  const res = await fetch(url, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(payload) });
  return handleResponse(res);
}

export async function reveal(payload: any) {
  const url = `${baseUrl()}/reveal`;
  const res = await fetch(url, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(payload) });
  return handleResponse(res);
}

export async function classify(payload: any) {
  const url = `${baseUrl()}/classify`;
  const res = await fetch(url, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(payload) });
  return handleResponse(res);
}

export async function status() {
  const url = `${adminBaseUrl()}/status`;
  const res = await fetch(url, { method: 'GET', headers: getAuthHeaders() });
  return handleResponse(res);
}

// Export a default client if you prefer.
export default {
  protect,
  reveal,
  classify,
  status,
};
