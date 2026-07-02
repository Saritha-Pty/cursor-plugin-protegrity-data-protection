// Central configuration for direct DEV_EDITION / Docker usage.
// If DEV_EDITION_* env vars are present, they are preferred.
// SKIP_MCP forces direct mode (we remove MCP entirely).
export const config = {
  // DEV_EDITION (cloud) settings — set these to use cloud mode.
  devEditionApiKey: process.env.DEV_EDITION_API_KEY || '',
  devEditionUrl: process.env.DEV_EDITION_URL || '',       // e.g. https://dev-edition.example.com:8580
  devEditionAdminUrl: process.env.DEV_EDITION_ADMIN_URL || '', // e.g. https://dev-edition-admin.example.com:8581

  // Local docker service defaults (used when DEV_EDITION_* not set)
  defaultLocalDataUrl: process.env.LOCAL_DATA_URL || 'http://localhost:8580',
  defaultLocalAdminUrl: process.env.LOCAL_ADMIN_URL || 'http://localhost:8581',

  // Force direct mode. When true we do not use any MCP or proxy layer.
  skipMCP: (process.env.SKIP_MCP === 'true') || !!process.env.DEV_EDITION_API_KEY || !!process.env.DEV_EDITION_URL,
};
