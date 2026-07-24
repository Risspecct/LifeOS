# LifeOS Production Deployment Guide

This guide details the deployment checklist, configuration guidelines, environment setups, and troubleshooting steps for running LifeOS in a production environment.

---

## Production Deployment Checklist

### 1. Database Provisioning
- LifeOS requires a **PostgreSQL** instance (version 15+ recommended).
- Ensure the database allows SSL connections (e.g. Neon, AWS RDS, Supabase, or Railway PG).
- Record the connection parameters: JDBC URL, database username, and database password.

### 2. Google OAuth Credentials Configuration
Before deploying, you must register your application in the **Google Cloud Console** under the API & Services Credentials section:
1. Create an OAuth 2.0 Client ID for a Web Application.
2. Add **Authorized JavaScript Origins**:
   - `https://<your-frontend-domain>` (and `http://localhost:5173` for testing).
3. Add **Authorized Redirect URIs**:
   - `https://<your-backend-domain>/login/oauth2/code/google`
4. Retrieve the generated Client ID and Client Secret.

### 3. Backend Deployment
- **Hosting Options**: Deploy the backend Docker container (using `backend/Dockerfile`) on platforms like **Railway**, **Render**, **AWS ECS**, **Heroku**, or a custom **VPS**.
- **Variables**: Ensure all environment variables are mapped in the container dashboard (see Environment Variables list below).

### 4. Frontend Deployment
- **Hosting Options**:
  - *Static Hosting*: Serve built assets from `dist` using **Vercel**, **Netlify**, **Cloudflare Pages**, or **AWS S3 + CloudFront**.
  - *Containerized*: Deploy the Nginx frontend container (using `frontend/Dockerfile`) to Railway, Render, or a VPS.
- **Build Configuration**:
  - **CRITICAL**: The environment variable `VITE_API_URL` must be set *before* or *during* the build phase. This compiles the backend endpoint URL into the production bundle. For static hosts (e.g. Vercel), add this variable in the Build Settings UI.

### 5. Domain & HTTPS Setup
- Map custom domains to both the frontend and backend.
- Enforce **HTTPS** using SSL certificates (e.g. Let's Encrypt, Cloudflare SSL, or provider-managed certificates).
- HTTPS is mandatory for:
  - Secure transport of credentials and authorization JWT headers.
  - Handling Google OAuth redirect callback handshakes.
  - Authorizing secure WebSockets (`wss://`) routing.

---

## Production Environment Variables

### Backend Variables

| Variable Name | Required | Default | Description |
| :--- | :---: | :---: | :--- |
| `DB_URL` | **Yes** | — | JDBC connection string. Must start with `jdbc:postgresql://` |
| `DB_USERNAME` | **Yes** | — | Database connection user name |
| `DB_PASSWORD` | **Yes** | — | Database connection user password |
| `JWT_SECRET` | **Yes** | — | High-entropy random string (at least 256-bit hexadecimal key) |
| `JWT_EXPIRATION` | No | `60000000` | Token expiration period in milliseconds |
| `GOOGLE_CLIENT_ID` | **Yes** | — | Google Cloud OAuth Client ID |
| `GOOGLE_CLIENT_SECRET`| **Yes**| — | Google Cloud OAuth Client Secret |
| `GEMINI_API_KEY` | **Yes** | — | Google Gemini API key for task drafts suggestions |
| `GEMINI_MODEL` | No | `gemini-2.5-flash` | Gemini model variant |
| `FRONTEND_URL` | No | `http://localhost:5173` | Production origin URL of your React frontend app (used for CORS mapping) |
| `DDL_AUTO` | No | `update` | Hibernate schema sync mode. For production, set to `validate` or `none` |
| `SHOW_SQL` | No | `true` | Print database transactions in output. Set `false` in production |
| `DEMO_ENABLED` | No | `false` | Seeding of demo dataset on startup. Ensure this is set to `false` in production |

### Frontend Variables

| Variable Name | Required | Default | Description |
| :--- | :---: | :---: | :--- |
| `VITE_API_URL` | **Yes** | — | Public URL of the backend API (e.g. `https://api.lifeos.com`). Must be set at build time |

---

## Common Deployment Issues & Troubleshooting

### 1. CORS Policy Violations
- **Symptom**: Console outputs error: *"Access to XMLHttpRequest at '...' from origin '...' has been blocked by CORS policy"*.
- **Fix**: Check that the backend environment variable `FRONTEND_URL` matches your production frontend domain exactly (including `https://` and without a trailing slash).

### 2. OAuth Redirect URI Mismatch
- **Symptom**: Google Login returns error code `400: redirect_uri_mismatch`.
- **Fix**: Open the Google Cloud Console and verify that the backend domain callback is listed in the OAuth client configuration. The redirect URI must look exactly like:
  `https://api-domain.com/login/oauth2/code/google`
  *Note*: The `/login/oauth2/code/google` path is mapped automatically by Spring Security's OAuth client filter.

### 3. Broken WebSocket Connection (`ws://` vs `wss://`)
- **Symptom**: Chat alerts fail to load, showing connection timeout error in the browser console.
- **Fix**: In production, browsers block insecure websocket requests from HTTPS pages (Mixed Content blocks). Ensure the client points to `wss://` (handled automatically in `websocketService.js` if the `VITE_API_URL` is set to `https://`).
- **Proxy Configuration**: If you run a custom Nginx reverse proxy or cloud balancer, ensure the proxy is configured to forward connection upgrades:
  ```nginx
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
  ```

### 4. Failed Code Exchange (OAuth Success Loop)
- **Symptom**: Google redirects to the frontend `/oauth-success` page, but the user is immediately redirected back to `/login` with an authentication error.
- **Fix**: This happens if the frontend fails to make the POST request to `/api/auth/oauth/exchange`. Check that the backend container has outbound network connectivity, that the database is reachable, and that the database user can create rows in the `users` table.
