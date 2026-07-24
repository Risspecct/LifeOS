# LifeOS Documentation

This directory is the documentation hub for LifeOS. It is organized for three common readers: visitors evaluating the project, developers preparing to work on it, and maintainers returning to the codebase later.

## Start Here

| Document | Purpose |
| --- | --- |
| [Repository README](../README.md) | Public project overview, features, setup, screenshots, and roadmap. |
| [System Architecture](architecture.md) | High-level design, request lifecycle, authentication flows, WebSocket flows, and deployment topology. |
| [Engineering Decisions](engineering-decisions.md) | Rationale, alternatives, trade-offs, and future improvements behind major implementation choices. |

## Architecture

| Document | Covers |
| --- | --- |
| [System Architecture](architecture.md) | Client-server architecture, request lifecycle, component interaction, and Mermaid diagrams. |
| [Project Structure](project-structure.md) | Backend package organization, frontend folder organization, and ownership boundaries. |
| [Engineering Decisions](engineering-decisions.md) | Why the current architecture and technology choices exist. |

## Backend

| Document | Covers |
| --- | --- |
| [Backend Guide](backend.md) | Spring Boot module layout, service boundaries, DTOs, mappers, and core backend systems. |
| [Database](database.md) | JPA entities, table relationships, PostgreSQL usage, and ER diagram. |
| [API Guide](api.md) | API organization, authentication rules, Swagger usage, and endpoint domains. |
| [Authentication](authentication.md) | JWT lifecycle, Spring Security chain, credential auth, and Google OAuth exchange. |
| [WebSockets](websocket.md) | STOMP endpoint, JWT connection authentication, private notification queues, and client lifecycle. |

## Frontend

| Document | Covers |
| --- | --- |
| [Frontend Guide](frontend.md) | React routing, protected routes, AuthContext, Axios client, hooks, services, and page structure. |
| [Project Structure](project-structure.md) | Frontend source tree and file responsibility map. |
| [WebSockets](websocket.md) | Frontend STOMP client behavior and notification subscription flow. |

## Authentication

| Document | Covers |
| --- | --- |
| [Authentication](authentication.md) | JWT issuance and validation, Google OAuth flow, CORS, and security configuration. |
| [API Guide](api.md) | Which API domains are public and which require Bearer tokens. |
| [Database](database.md) | User, student profile, and authentication-provider persistence details. |

## API

| Document | Covers |
| --- | --- |
| [API Guide](api.md) | API module map and Swagger UI access. |
| [Backend Guide](backend.md) | Controller, service, repository, and DTO conventions. |

## Database

| Document | Covers |
| --- | --- |
| [Database](database.md) | PostgreSQL persistence model and entity relationships. |
| [Backend Guide](backend.md) | JPA repository and service-layer usage. |
| [Deployment](deployment.md) | Managed PostgreSQL deployment and environment variables. |

## WebSockets

| Document | Covers |
| --- | --- |
| [WebSockets](websocket.md) | STOMP broker setup, `/ws`, `/user/queue/notifications`, and JWT channel interception. |
| [Authentication](authentication.md) | Shared JWT validation model. |
| [Deployment](deployment.md) | Production WebSocket and HTTPS troubleshooting. |

## Docker

| Document | Covers |
| --- | --- |
| [Docker](docker.md) | Backend and frontend Dockerfiles, Compose services, networking, and production considerations. |
| [Deployment](deployment.md) | Render, Vercel, Neon, build variables, and release workflow. |

## Deployment

| Document | Covers |
| --- | --- |
| [Deployment](deployment.md) | Render backend deployment, Vercel frontend deployment, Neon PostgreSQL, environment variables, and troubleshooting. |
| [Docker](docker.md) | Container build behavior and local orchestration. |
| [Authentication](authentication.md) | OAuth redirect and CORS details needed for production. |

## Project Structure

| Document | Covers |
| --- | --- |
| [Project Structure](project-structure.md) | Repository tree, backend packages, frontend directories, and documentation/assets layout. |
| [Backend Guide](backend.md) | Backend package responsibilities. |
| [Frontend Guide](frontend.md) | Frontend runtime structure and routing. |

## Documentation Maintenance

When changing project behavior, update the closest document and cross-link any affected systems. Prefer repository-relative links, keep headings in a consistent hierarchy, and avoid duplicating generated Swagger content by hand.

## Related Documentation

- [Repository README](../README.md)
- [Engineering Decisions](engineering-decisions.md)
- [Deployment](deployment.md)

## Conclusion

The documentation set is intended to be navigable from any entry point. Use this index as the stable map, then follow related-document links at the bottom of each guide for deeper context.
