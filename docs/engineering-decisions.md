# Engineering Decisions

This document records the major architectural and technical decisions visible in the LifeOS implementation. It focuses on why the system is shaped the way it is, what trade-offs the choices create, and where future changes may make sense.

## Overall Project Architecture

### Decision

LifeOS is implemented as a decoupled React frontend and Spring Boot backend, with PostgreSQL as the persistence layer.

### Motivation

The application has a rich browser UI and a backend with authentication, persistence, prioritization, social features, notifications, and AI integration. Separating the SPA from the API lets each side use tools suited to its responsibilities.

### Alternatives Considered

A server-rendered monolith would simplify deployment but make the interactive dashboard, task workspace, route guards, and real-time client state less natural. A microservice architecture would create more operational overhead than the current project needs.

### Trade-offs

The split improves frontend/backend clarity and deployment flexibility, but it introduces CORS, build-time API configuration, OAuth redirect coordination, and separate hosting concerns.

### Future Improvements

If the application grows, the backend can remain a modular monolith while extracting only truly independent services later, such as notifications or analytics.

## Spring Boot Backend

### Decision

Use Spring Boot as the backend framework.

### Motivation

The implementation needs mature support for REST APIs, security, OAuth2 login, JPA, validation, WebSockets, scheduling, and dependency injection. Spring Boot provides these pieces in one ecosystem.

### Alternatives Considered

Node/Express or NestJS could serve the API, but the current codebase benefits from Spring Security, Spring Data JPA, typed Java domain code, and built-in WebSocket support.

### Trade-offs

Spring Boot is heavier than minimalist frameworks and requires more configuration knowledge. In exchange, it provides production-oriented primitives for authentication, persistence, and modular backend design.

### Future Improvements

Add stronger test coverage around service boundaries and consider API metadata annotations for richer generated Swagger documentation.

## React and Vite Frontend

### Decision

Use React 18 with Vite for the frontend SPA.

### Motivation

LifeOS has route-protected pages, reusable dashboard/task/profile components, hooks, and client-side state that fit React's component model. Vite keeps local development and production builds straightforward.

### Alternatives Considered

Next.js could provide a full-stack framework and server rendering, but the current app is an authenticated dashboard where most content is client-rendered after login. A plain server-rendered app would be less ergonomic for the current interaction model.

### Trade-offs

The SPA requires explicit fallback rewrites in Vercel and Nginx. It also embeds `VITE_API_URL` at build time, so frontend deployments must be rebuilt when the backend URL changes.

### Future Improvements

Add frontend tests and linting, and consider route-level code splitting if bundle size becomes an issue.

## PostgreSQL and Neon-Compatible Deployment

### Decision

Use PostgreSQL through Spring Data JPA, configured by environment variables and compatible with managed providers such as Neon.

### Motivation

The data model is relational: users own profiles, tasks, labels, notes, activity, notifications, stats, and social relationships. PostgreSQL handles these relationships well and supports JSONB metadata for notifications.

### Alternatives Considered

A document database could store flexible task or notification data, but the implementation relies on relational ownership and joins. An embedded database would simplify local demos but would not match production needs.

### Trade-offs

PostgreSQL requires managed database setup, connection configuration, and schema management. JPA keeps repository code productive, but production schema evolution will eventually need migrations.

### Future Improvements

Introduce Flyway or Liquibase and set production schema management to validation-only after migrations are in place.

## Modular Monolith Backend Organization

### Decision

Organize backend code by product domain rather than by global technical layer.

### Motivation

Packages such as `task`, `student`, `friend`, `notification`, and `dashboard` make feature ownership easier to understand. Controllers, services, repositories, entities, and DTOs stay near the concepts they serve.

### Alternatives Considered

A global `controllers`, `services`, and `repositories` layout would be familiar, but it can force maintainers to jump across unrelated directories for a single feature.

### Trade-offs

Some cross-domain dependencies still exist, especially in dashboard, rewards, stats, and social features. The benefit is that most feature changes remain local to one package.

### Future Improvements

Document package boundaries in code-level ADRs if the backend grows, and watch for domains that become too coupled.

## JWT Authentication

### Decision

Use stateless JWT authentication for protected APIs.

### Motivation

The decoupled SPA/API model works naturally with bearer tokens. Stateless tokens also simplify backend deployment because normal API requests do not depend on server-side HTTP session storage.

### Alternatives Considered

Server-side sessions could reduce token exposure in browser storage but require cookie/session infrastructure. OAuth-only login would exclude credentials-based registration. Refresh tokens are not currently implemented.

### Trade-offs

JWTs reduce server session state, but token storage and expiration handling become important frontend concerns. The current frontend stores tokens in local storage.

### Future Improvements

Add refresh-token support or a more hardened storage strategy if longer sessions or a stricter threat model become requirements.

## Google OAuth Exchange Code

### Decision

Use Spring Security OAuth2 login, then redirect the frontend with a temporary exchange code that is consumed for the final application JWT.

### Motivation

Redirecting the final JWT in a URL would expose it in browser history and logs. A short-lived exchange code narrows that exposure and lets the frontend obtain the normal application JWT through a POST request.

### Alternatives Considered

The backend could redirect directly with the JWT or use cookie-based sessions. Direct JWT redirects are simpler but less careful with token exposure. Cookie sessions would change the stateless API model.

### Trade-offs

The exchange-code approach adds an extra endpoint and cache-backed lifecycle. In the current implementation, `OAuthCodeService` uses Caffeine with a 2-minute expiration and maximum size of 1000 codes.

### Future Improvements

For multi-instance backend deployments, move exchange-code storage to a shared external store or ensure sticky routing during OAuth completion.

## WebSocket Notifications Instead of Polling

### Decision

Use STOMP over WebSockets for real-time notification delivery.

### Motivation

Friend requests, acceptances, and notification changes benefit from immediate delivery. WebSockets avoid repeated polling while users are online.

### Alternatives Considered

Polling notification endpoints would be easier to deploy and scale but less responsive and more wasteful. Server-Sent Events could handle one-way delivery but would not align as directly with the STOMP broker pattern already supported by Spring.

### Trade-offs

WebSockets require connection lifecycle handling, JWT authentication on `CONNECT`, and proxy support for upgrade headers. The current simple broker is appropriate for a small deployment but is not a durable external message bus.

### Future Improvements

Use an external broker if horizontal scaling or durable real-time delivery becomes necessary.

## Docker Adoption

### Decision

Provide Dockerfiles for both backend and frontend, plus Docker Compose for local orchestration.

### Motivation

Container builds make the backend and frontend portable across local machines and deployment platforms. Multi-stage builds keep build dependencies out of runtime images.

### Alternatives Considered

Running both apps directly on the host is simpler during development but less reproducible. A single combined image would reduce services but blur frontend/backend deployment boundaries.

### Trade-offs

The frontend must be built with the correct public `VITE_API_URL`, and Docker networking can be confusing because browser requests do not originate inside the Compose network.

### Future Improvements

Add documented image tags, container health checks, and CI image build validation.

## Render, Vercel, and Managed PostgreSQL Deployment

### Decision

Document deployment as a separated backend container, frontend static host, and managed PostgreSQL database.

### Motivation

The repository already supports this split through Dockerfiles, Vercel rewrites, and environment-driven database configuration.

### Alternatives Considered

A VPS could host all services together, but it would require more manual operations. A platform-specific monorepo deployment could simplify one target but reduce portability.

### Trade-offs

Separate deployment improves fit for each layer, but requires coordinating frontend API URL, backend CORS origin, OAuth redirect URIs, and HTTPS.

### Future Improvements

Add a deployment checklist with real production URLs once a public demo environment exists.

## AI-Assisted Task Generation

### Decision

Use a Gemini-backed AI client behind an internal `AiClient` abstraction.

### Motivation

The product includes task draft generation from prompts. Keeping the model call behind an interface separates task-generation service behavior from the concrete provider client.

### Alternatives Considered

The controller could call Gemini directly, but that would couple HTTP routes to provider details and make testing harder.

### Trade-offs

The abstraction adds a small amount of indirection. In return, the service can evolve if prompt building or provider selection changes.

### Future Improvements

Add fallback behavior, validation of generated drafts, and tests around prompt construction and malformed model output.

## Environment Variable Management

### Decision

Configure runtime and build behavior through environment variables.

### Motivation

Database credentials, OAuth credentials, JWT secrets, Gemini keys, frontend origins, and deployment URLs vary by environment and must not be hardcoded.

### Alternatives Considered

Checked-in property files would simplify local startup but would be unsafe for secrets and brittle across deployments.

### Trade-offs

Developers need a correctly populated local environment. Deployment platforms must also keep frontend build-time variables and backend runtime variables aligned.

### Future Improvements

Add `.env.example` and validation on startup for required variables.

## Features Intentionally Deferred or Incomplete

### Decision

Keep some production-maturity work as future improvement rather than claiming it is complete.

### Motivation

The repository contains substantial application functionality, but there is no visible CI pipeline, migration framework, public demo URL, or production monitoring configuration.

### Alternatives Considered

The documentation could present these as existing features, but that would be inaccurate and misleading.

### Trade-offs

Being explicit about gaps may look less polished than claiming full production maturity, but it gives future maintainers a clear roadmap.

### Future Improvements

Add CI/CD, migrations, monitoring, structured logging, a public demo deployment, and broader automated test coverage.

## Related Documentation

- [System Architecture](architecture.md)
- [Backend Guide](backend.md)
- [Frontend Guide](frontend.md)
- [Authentication](authentication.md)
- [Docker](docker.md)
- [Deployment](deployment.md)

## Conclusion

LifeOS favors pragmatic full-stack architecture: a separate SPA and API, a modular monolith backend, relational persistence, stateless authentication, and focused real-time messaging. The important trade-off is coordination across layers, especially around environment variables, OAuth, CORS, and deployment URLs.
