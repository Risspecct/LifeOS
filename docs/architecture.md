# LifeOS System Architecture

This document describes the high-level architecture, communication protocols, authentication lifecycles, and request execution paths for the LifeOS application.

---

## High-Level Architecture

LifeOS uses a decoupled client-server architecture:
- **Frontend SPA**: A single-page application built with React, Vite, and Tailwind CSS.
- **Backend Service**: A modular monolith built with Java 21, Spring Boot, and Spring Security.
- **Database**: A PostgreSQL database for persistent relational storage.
- **Real-time Engine**: Native WebSockets running the STOMP message protocol.

```mermaid
graph TD
    Browser["Web Browser (User Interface)"]
    React["React SPA (Client-side UI & State)"]
    Axios["Axios (REST API Client)"]
    STOMP["STOMP / WebSockets (Real-time Broker client)"]
    SpringBoot["Spring Boot App (Backend Server)"]
    Postgres["PostgreSQL Database"]

    Browser <--> React
    React <--> Axios
    React <--> STOMP
    Axios <--> SpringBoot
    STOMP <--> SpringBoot
    SpringBoot <--> Postgres
```

---

## Authentication Lifecycle (JWT)

LifeOS uses stateless JWT-based authorization. When users register or log in with credentials, they receive a JWT that must be sent in the `Authorization` header of subsequent API calls.

```mermaid
sequenceDiagram
    autonumber
    actor User as Student
    participant FE as React Frontend
    participant Filter as Security Filter (JwtAuthenticationFilter)
    participant AuthC as AuthController
    participant AuthM as AuthenticationManager
    participant JwtS as JwtService
    participant DB as PostgreSQL Database

    User->>FE: Enters email & password, clicks login
    FE->>Filter: POST /api/auth/login
    Note over Filter: Path /api/auth/** is permitted in SecurityConfig. Passes through.
    Filter->>AuthC: Invokes login(LoginDto)
    AuthC->>AuthM: authenticate(UsernamePasswordAuthenticationToken)
    AuthM->>DB: Loads user details & validates Bcrypt hash
    DB-->>AuthM: User details matching
    AuthM-->>AuthC: Authentication successful
    AuthC->>JwtS: generateToken(User)
    JwtS-->>AuthC: JWT Token (String)
    AuthC-->>FE: Return LoginResponse (JWT Token + User details)
    FE->>FE: Store JWT in LocalStorage (token key)
    Note over FE, User: Redirects to /dashboard
```

---

## Google OAuth2 Exchange Flow

LifeOS implements social authentication using Google Sign-In, integrated into the Spring Security OAuth2 login filter chain. Rather than sending credentials directly to the frontend, a secure redirection-exchange protocol is implemented.

```mermaid
sequenceDiagram
    autonumber
    actor User as Student
    participant FE as React Frontend
    participant SpringSec as Spring Security (OAuth2 Login)
    participant Google as Google Auth Servers
    participant Success as CustomOAuth2SuccessHandler
    participant CodeS as OAuthCodeService
    participant Exchange as OAuthExchangeController
    participant JwtS as JwtService
    participant DB as PostgreSQL Database

    User->>FE: Clicks "Sign in with Google"
    FE->>SpringSec: Redirect to /oauth2/authorization/google
    SpringSec->>Google: Redirects to Google consent screen
    Google-->>User: Show consent prompt
    User->>Google: Grant permissions
    Google-->>SpringSec: Redirect with Auth Authorization Code to /login/oauth2/code/google
    SpringSec->>Google: Exchange code for Access Token
    Google-->>SpringSec: Google Access Token & User Profile Info
    SpringSec->>DB: Check if user exists (creates if missing in CustomOAuth2UserService)
    SpringSec->>Success: Trigger onAuthenticationSuccess
    Success->>CodeS: Generate temporary OAuth Exchange Code (valid 5 min)
    CodeS-->>Success: One-time Code
    Success-->>FE: Redirect client to /oauth-success?code=<code>
    FE->>FE: Read "code" query param
    FE->>Exchange: POST /api/auth/oauth/exchange with {"code": "<code>"}
    Exchange->>CodeS: Consume & validate code
    CodeS-->>Exchange: Returns userId
    Exchange->>DB: Retrieve User details
    Exchange->>JwtS: generateToken(User)
    JwtS-->>Exchange: JWT Token
    Exchange-->>FE: Return OAuthExchangeResponse with {"token": "<jwt>"}
    FE->>FE: Complete Login (save token in LocalStorage)
```

---

## WebSocket Notification Lifecycle

Real-time capabilities (like instant friend alerts or milestone notifications) run over STOMP WebSockets. A custom Spring Message `ChannelInterceptor` extracts the JWT to authorize connection handshakes before subscription.

```mermaid
sequenceDiagram
    autonumber
    actor User as Student
    participant FE as React Frontend
    participant WS as WebSocket Config / STOMP Broker
    participant Interceptor as JwtChannelInterceptor
    participant JwtS as JwtService
    participant Realtime as NotificationRealtimeService

    FE->>WS: Connect to /ws (Authorization Bearer Header)
    WS->>Interceptor: Intercept CONNECT Command
    Interceptor->>JwtS: Extract & validate JWT
    JwtS-->>Interceptor: Valid username
    Interceptor->>WS: Authenticate user details session
    WS-->>FE: CONNECTED ACK
    FE->>WS: Subscribe to /user/queue/notifications
    Note over FE: Listening for real-time notifications
    Note over Realtime, WS: Event occurs (e.g. friend request accepted)
    Realtime->>WS: sendPrivateNotification(userId, NotificationPayload)
    WS-->>FE: Pushes Notification payload on /user/queue/notifications
    FE->>User: Shows UI toast / increments notification badge
```

---

## Request Lifecycle (Spring Boot)

Every API request targeting a protected route passes through a structured execution pipeline:

```mermaid
graph TD
    Client["Client App (React Axios)"] --> CORS["CORS & CSRF Filters"]
    CORS --> SecurityFilter["JwtAuthenticationFilter (Verify JWT in Header)"]
    SecurityFilter --> Context["SecurityContextHolder (Set Auth details)"]
    Context --> Controller["Controller (e.g. TaskController)"]
    Controller --> Validation["JSR 380 Validation (@Valid DTO)"]
    Validation --> Service["Service layer (@Service, @Transactional)"]
    Service --> Repository["Repository layer (Spring Data JPA)"]
    Repository --> DB["PostgreSQL Database"]
    DB --> Repository
    Repository --> Service
    Service --> Mapper["MapStruct Mapper (Entity -> DTO View)"]
    Mapper --> Controller
    Controller --> ClientResponse["ResponseEntity (JSON Payload + Status)"]
    ClientResponse --> Client
```

1. **CORS & Security Configurations**: Validates request headers and checks allowed origins.
2. **JwtAuthenticationFilter**: If an `Authorization` header is present with a `Bearer ` token, it extracts and validates the token. If valid, the security context is updated.
3. **Security Context Guard**: Matches the request URI against the filter chain configuration. If the path requires authentication, it asserts that the authentication token is present in the session context.
4. **Controller Handling**: Routes requests to the designated mapping methods, executing JSR-380 binding validations (`@Valid`) on incoming bodies.
5. **Business Services**: Controllers delegate logic to services, running within transactional boundaries (`@Transactional`).
6. **Persistence Repositories**: Services execute DB actions using Spring Data JPA.
7. **Mapping Layer**: Maps internal Database Entities to clean View DTOs using MapStruct converters.
8. **REST Response**: The controller returns a `ResponseEntity` serializing the DTO as a JSON body back to the client.
