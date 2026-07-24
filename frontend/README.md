# LifeOS Frontend

This directory contains the React + Vite frontend for LifeOS.

## Overview

The frontend is a single-page application that provides the authenticated LifeOS workspace: dashboard, task management, notes, profile setup, activity insights, leaderboards, connections, settings, and real-time notification UI.

## Technology Stack

- React 18
- Vite
- React Router
- Axios
- Tailwind CSS
- `@stomp/stompjs`

## Configuration

Create a local environment file such as `.env.development`:

```env
VITE_API_URL=http://localhost:8080
```

`VITE_API_URL` must point to the backend API origin and is read at build time.

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production build is written to `dist/`.

## Deployment Notes

- `vercel.json` rewrites all routes to `index.html` for React Router support on Vercel.
- `Dockerfile` builds the Vite app and serves static files with Nginx.
- `nginx.conf` provides the same SPA fallback behavior for containerized hosting.

## Related Documentation

- [Main README](../README.md)
- [Frontend Guide](../docs/frontend.md)
- [Authentication](../docs/authentication.md)
- [WebSockets](../docs/websocket.md)
- [Deployment](../docs/deployment.md)

## Conclusion

The frontend owns the browser experience and delegates persistence, authorization, scoring, notifications, and aggregation to the Spring Boot backend.
