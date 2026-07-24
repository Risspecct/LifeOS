# Project Structure

This document explains the repository layout and the purpose of major backend, frontend, documentation, and infrastructure files.

## Repository Layout

```text
LifeOS/
|-- backend/             Spring Boot backend application
|-- frontend/            React + Vite frontend application
|-- docs/                Project documentation
|-- Assets/              Screenshots used in documentation
|-- docker-compose.yml   Local Docker orchestration
|-- package.json         Root Node metadata
|-- package-lock.json    Root npm lockfile
|-- LICENSE              MIT license
`-- README.md            Public project landing page
```

## Backend Structure

```text
backend/
|-- src/
|   |-- main/
|   |   |-- java/users/java/LifeOS/
|   |   |   |-- auth/
|   |   |   |-- task/
|   |   |   |-- student/
|   |   |   |-- friend/
|   |   |   |-- notification/
|   |   |   |-- websocket/
|   |   |   `-- ...
|   |   `-- resources/application.properties
|   `-- test/java/users/java/LifeOS/
|-- Dockerfile
|-- HELP.md
|-- mvnw
|-- mvnw.cmd
`-- pom.xml
```

### Backend Package Responsibilities

| Package | Purpose |
| --- | --- |
| `auth` | JWT, Spring Security, OAuth, credentials authentication, and principals. |
| `task` | Task CRUD, filtering, stats, labels, and prioritization. |
| `taskgeneration` | Gemini-backed task draft generation. |
| `student` | Student profiles and discovery. |
| `user` | Account-level user APIs and persistence. |
| `friend` | Friend relationships and friend request lifecycle. |
| `feed` | Friend activity feed aggregation. |
| `leaderboard` | Ranking views by scope. |
| `activity` | Activity records and activity timeline responses. |
| `insights` | Productivity analytics data. |
| `stats` | Points, streaks, counters, and rebuild/update workflows. |
| `level` | Level progression and milestone data. |
| `rewards` | Reward point calculations. |
| `dashboard` | Aggregated dashboard response. |
| `notification` | Notification persistence and read-state APIs. |
| `websocket` | STOMP configuration and private notification delivery. |
| `branch` | Academic branch metadata. |
| `demo` | Optional generated demo data. |
| `exceptions` | Shared exception and error response handling. |
| `util` | Shared JPA timestamp base entity. |

## Frontend Structure

```text
frontend/
|-- src/
|   |-- api/
|   |-- auth/
|   |-- components/
|   |-- config/
|   |-- features/
|   |-- hooks/
|   |-- pages/
|   |-- routes/
|   |-- services/
|   |-- utils/
|   |-- App.jsx
|   |-- index.css
|   `-- main.jsx
|-- Dockerfile
|-- nginx.conf
|-- package.json
|-- tailwind.config.js
|-- vercel.json
`-- vite.config.js
```

### Frontend Directory Responsibilities

| Directory | Purpose |
| --- | --- |
| `api` | Axios client and REST modules for backend domains. |
| `auth` | Auth context, loading screen, and protected route guard. |
| `components` | Feature-scoped reusable UI components. |
| `config` | API base URL configuration through Vite environment variables. |
| `features` | Feature-specific service helpers. |
| `hooks` | Reusable React hooks for data loading and UI state. |
| `pages` | Route-level page components. |
| `routes` | React Router route definitions. |
| `services` | WebSocket, notifications, connections, and activity service clients. |
| `utils` | Constants, date helpers, validation, error handling, and task helpers. |

## Documentation Structure

```text
docs/
|-- README.md
|-- architecture.md
|-- backend.md
|-- frontend.md
|-- authentication.md
|-- api.md
|-- database.md
|-- websocket.md
|-- docker.md
|-- deployment.md
|-- project-structure.md
`-- engineering-decisions.md
```

The docs are organized by system concern rather than by file type. Use [docs/README.md](README.md) as the navigation hub.

## Infrastructure Files

| File | Purpose |
| --- | --- |
| `docker-compose.yml` | Builds and runs frontend and backend containers locally. |
| `backend/Dockerfile` | Multi-stage backend build and Java runtime image. |
| `frontend/Dockerfile` | Multi-stage frontend build and Nginx static runtime image. |
| `frontend/nginx.conf` | React Router fallback for containerized frontend hosting. |
| `frontend/vercel.json` | SPA route rewrite for Vercel deployments. |

## Related Documentation

- [Repository README](../README.md)
- [Backend Guide](backend.md)
- [Frontend Guide](frontend.md)
- [Docker](docker.md)
- [Deployment](deployment.md)

## Conclusion

The repository is split by deployable application first, then by domain or runtime responsibility. That makes it easy to find backend rules, frontend workflows, deployment configuration, and supporting documentation without scanning unrelated code.
