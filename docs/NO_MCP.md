# Running the plugin without MCP

This repo has been updated to remove the MCP servers and call Protegrity DEV edition (or local Docker services) directly.

Modes:
- Local Docker (default ports): Connects to services assumed to be reachable at:
  - Data API: http://localhost:8580
  - Admin API: http://localhost:8581
- Cloud DEV edition: use DEV_EDITION_API_KEY, DEV_EDITION_URL, DEV_EDITION_ADMIN_URL

Environment variables:
- SKIP_MCP=true  — required/used to indicate direct mode (already the default after this change).
- DEV_EDITION_API_KEY — optional; if present, used in Authorization header.
- DEV_EDITION_URL — optional; overrides local data URL (e.g. https://dev.example.com:8580)
- DEV_EDITION_ADMIN_URL — optional; overrides admin/status endpoint (e.g. https://dev.example.com:8581)

Docker quickstart (example)
1. Start the required Protegrity containers (example; replace with your images):
   docker run -d -p 8580:8580 --name protegrity-data protegrity/dev-edition-data:latest
   docker run -d -p 8581:8581 --name protegrity-admin protegrity/dev-edition-admin:latest

2. Run the plugin:
   SKIP_MCP=true npm start
   Or set DEV_EDITION_API_KEY/DEV_EDITION_URL if using cloud.

Notes:
- All MCP-related codepaths were removed. Skills now call the direct API client under src/apiClient.ts.
- If you used an orchestration that previously started MCP, stop and remove those containers/services.
