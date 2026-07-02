# Use the plugin directly (no MCP)

This project now supports calling Protegrity DEV edition or local Docker services directly.

How to run locally:
1. Ensure services are reachable on ports 8580 (data) and 8581 (admin)
2. Set environment variables as needed:
   - SKIP_MCP=true
   - Optionally: DEV_EDITION_API_KEY, DEV_EDITION_URL, DEV_EDITION_ADMIN_URL
3. Start your app:
   SKIP_MCP=true npm start

If you prefer cloud DEV edition:
1. Set DEV_EDITION_API_KEY and DEV_EDITION_URL/DEV_EDITION_ADMIN_URL
2. Start the app.

If your Node version < 18: install node-fetch:
  npm install node-fetch@2
and update src/apiClient.ts import accordingly.
