# System Architecture

This document explains how LifeOS is assembled at a system level: the browser client, REST API, WebSocket broker, security flow, business modules, and PostgreSQL database.

## Overview

LifeOS uses a decoupled client-server architecture. The frontend is a React single-page application built with Vite. The backend is a Spring Boot modular monolith that exposes REST APIs, handles authentication, runs domain services, publishes WebSocket notifications, and persists data through Spring Data JPA.

```mermaid
graph TD
    User["Student in Browser"] --> React["React SPA"]
    React --> Router["React Router"]
    React --> Axios["Axios Client"]
    React --> Stomp["STOMP Client"]
    Axios --> Security["Spring Security Filter Chain"]
    Security --> Controllers["REST Controllers"]
    Controllers --> Services["Domain Services"]
    Services --> Repositories["JPA Repositories"]
    Repositories --> Database[("PostgreSQL")]
    Services --> Realtime["NotificationRealtimeService"]
    Stomp --> Broker["Spring Simple STOMP Broker"]
    Realtime --> Broker
    Broker --> React
```

## Core Components

| Component | Implementation | Responsibility |
| --- | --- | --- |
| Frontend SPA | `frontend/src` | Pages, protected routing, dashboard, task workspace, profile, social, notifications, and API clients. |
| REST API | `backend/src/main/java/users/java/LifeOS` | Domain endpoints for auth, tasks, labels, notes, profile, friends, stats, insights, dashboard, and notifications. |
| Security | `auth.config`, `auth.filters`, `auth.oauth` | JWT validation, stateless Spring Security, credentials login, and Google OAuth exchange. |
| WebSockets | `websocket` | STOMP endpoint `/ws`, JWT-authenticated `CONNECT`, and private notification queues. |
| Persistence | JPA entities and repositories | PostgreSQL-backed data model for users, profiles, tasks, labels, notes, activity, friends, stats, and notifications. |
| AI integration | `taskgeneration` | Google Gemini-backed task draft generation. |

## Request Lifecycle

Protected HTTP requests use the same bearer token model across domains.

```mermaid
sequenceDiagram
    autonumber
    participant UI as React UI
    participant Axios as Axios Client
    participant Filter as JwtAuthenticationFilter
    participant Security as SecurityContext
    participant Controller as REST Controller
    participant Service as Domain Service
    participant Repo as JPA Repository
    participant DB as PostgreSQL

    UI->>Axios: Trigger API action
    Axios->>Filter: HTTP request with Authorization: Bearer token
    Filter->>Filter: Extract and validate JWT
    Filter->>Security: Set authenticated principal
    Security->>Controller: Continue request
    Controller->>Service: Delegate business operation
    Service->>Repo: Query or persist entities
    Repo->>DB: SQL through Hibernate
    DB-->>Repo: Result set
    Repo-->>Service: Entity or projection
    Service-->>Controller: DTO or view model
    Controller-->>Axios: JSON response
    Axios-->>UI: Update UI state
```

## Backend Component Interaction

The backend follows a package-by-domain structure. Within each domain, controllers delegate to services, services coordinate repositories and domain helpers, and mappers shape entities into DTOs or views.

```mermaid
graph LR
    Controller["Controller"] --> DTO["Request DTO / Query Params"]
    DTO --> Service["Service"]
    Service --> DomainLogic["Domain Rules"]
    Service --> Repository["Repository"]
    Repository --> Entity["JPA Entity"]
    Entity --> Database[("PostgreSQL")]
    Service --> Mapper["Mapper / Response Builder"]
    Mapper --> Response["Response DTO / View"]
```

## JWT Authentication Flow

Credentials-based login creates the same JWT session format that OAuth exchange eventually produces.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE as React Frontend
    participant Auth as AuthController
    participant Manager as AuthenticationManager
    participant Users as UserDetailsService
    participant JWT as JwtService
    participant DB as PostgreSQL

    User->>FE: Submit email and password
    FE->>Auth: POST /api/auth/login
    Auth->>Manager: Authenticate credentials
    Manager->>Users: Load user by email
    Users->>DB: Read user account
    DB-->>Users: User record
    Manager-->>Auth: Authentication success
    Auth->>JWT: Generate signed JWT
    JWT-->>Auth: Token with subject and userId claim
    Auth-->>FE: JWT response
    FE->>FE: Store token under lifeos_jwt_token
```

## Google OAuth Flow

LifeOS uses Spring Security OAuth2 login with a custom success handler. The success handler redirects the frontend with a temporary exchange code instead of putting the final JWT in the redirect URL.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE as React Frontend
    participant Spring as Spring OAuth2 Login
    participant Google as Google OAuth
    participant UserService as CustomOAuth2UserService
    participant Success as CustomOAuth2SuccessHandler
    participant Code as OAuthCodeService
    participant Exchange as OAuthExchangeController
    participant JWT as JwtService

    User->>FE: Click Google sign-in
    FE->>Spring: Navigate to /oauth2/authorization/google
    Spring->>Google: Redirect to Google consent
    Google-->>Spring: Callback to /login/oauth2/code/google
    Spring->>UserService: Load or create local user
    Spring->>Success: Authentication success
    Success->>Code: Create short-lived exchange code
    Success-->>FE: Redirect to /oauth-success?code=...
    FE->>Exchange: POST /api/auth/oauth/exchange
    Exchange->>Code: Consume exchange code
    Exchange->>JWT: Generate application JWT
    Exchange-->>FE: Return token
```

## WebSocket Communication

WebSocket notifications reuse JWT identity during the STOMP `CONNECT` frame. The backend binds the authenticated principal to the session and sends private notifications through `/user/queue/notifications`.

```mermaid
sequenceDiagram
    autonumber
    participant FE as React STOMP Client
    participant WS as /ws Endpoint
    participant Interceptor as JwtChannelInterceptor
    participant JWT as JwtService
    participant Broker as Simple Broker
    participant Service as NotificationRealtimeService

    FE->>WS: CONNECT with Authorization header
    WS->>Interceptor: Intercept CONNECT frame
    Interceptor->>JWT: Validate token
    JWT-->>Interceptor: Email subject is valid
    Interceptor->>WS: Set authenticated principal
    WS-->>FE: CONNECTED
    FE->>Broker: Subscribe /user/queue/notifications
    Service->>Broker: convertAndSendToUser(email, /queue/notifications, payload)
    Broker-->>FE: Private notification payload
```

## Deployment Architecture

The repository supports independent frontend, backend, and database deployment. Current files support Vercel-style SPA rewrites for the frontend, Docker image builds for both apps, and PostgreSQL through environment variables.

```mermaid
graph TD
    Browser["Browser"] --> Vercel["Frontend Host (Vercel or Nginx Container)"]
    Browser --> Render["Backend Host (Render or Docker Platform)"]
    Vercel --> Browser
    Render --> Neon[("PostgreSQL / Neon")]
    Render --> GoogleOAuth["Google OAuth"]
    Render --> Gemini["Google Gemini API"]
    Browser --> WebSocket["wss:// backend /ws"]
    WebSocket --> Render
```

## Architectural Boundaries

- The frontend owns client-side routing, presentation state, route guards, API orchestration, and user-facing workflows.
- The backend owns authentication, authorization, persistence, business rules, score calculation, notification creation, and data aggregation.
- PostgreSQL owns durable relational state.
- Swagger/OpenAPI is generated from the running backend rather than hand-maintained as duplicated endpoint documentation.

## Related Documentation

- [Backend Guide](backend.md)
- [Frontend Guide](frontend.md)
- [Authentication](authentication.md)
- [WebSockets](websocket.md)
- [Database](database.md)
- [Engineering Decisions](engineering-decisions.md)

## Conclusion

LifeOS is intentionally structured as a deployable full-stack system rather than a single-process prototype. Its strongest architectural throughline is separation of concerns: a browser-based SPA, a domain-oriented Spring Boot API, stateless identity, real-time notifications, and PostgreSQL persistence.
