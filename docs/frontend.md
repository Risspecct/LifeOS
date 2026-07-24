# LifeOS Frontend Architecture & Developer Documentation

This document describes the design patterns, folder structure, routing, authentication state management, API layer, and real-time WebSocket communication in the LifeOS React SPA.

---

## Folder & Component Structure

The frontend codebase is organized to separate API calling layers, visual presentation components, reusable React hooks, routing layout definitions, and utility scripts.

```
frontend/src/
├── api/                  # Axios configuration and backend endpoint services
├── auth/                 # React Context and ProtectedRoute authorization guard
├── components/           # Feature-scoped modular UI components
│   ├── activity/
│   ├── connections/
│   ├── dashboard/
│   ├── form/
│   ├── layout/
│   ├── leaderboard/
│   ├── level/
│   ├── navigation/
│   ├── notes/
│   ├── notifications/
│   ├── profile/
│   ├── tasks/
│   └── ui/
├── config/               # API base URL configuration mapping
├── features/             # Business features logic and structures
├── hooks/                # Custom React hooks (auth, tasks, labels, etc.)
├── pages/                # Page-level components matched directly to routing paths
├── routes/               # AppRoutes layout router definitions
├── services/             # Client controllers (WebSockets STOMP broker, notifications)
├── utils/                # Constants, date formatters, and error helpers
├── App.jsx               # App container wrapping routing and global toast state
├── index.css             # Tailwind directive rules and theme definitions
└── main.jsx              # React DOM mounting entrypoint
```

---

## Application Routing & Guards

LifeOS handles client-side routing using `react-router-dom` (v6). Routes are partitioned into **Public Routes**, **Profile-Setup Guards**, and **Fully-Protected Page Routes**.

### 1. Routes Mapping Configuration (`routes/AppRoutes.jsx`)
- **Public access paths**: `/login`, `/signup`, and `/oauth-success` are open to all visitors. Unmatched routes fall back automatically to `/signup`.
- **Pre-profile paths**: `/profile-setup` is protected by authorization checks but allows students who have not completed their profile setup to access it.
- **App Shell protected paths**: The dashboard, task manager, settings, leaderboards, connections, activity, and notes details require authorization *and* a completed student profile.

### 2. Authorization Guarding Component (`auth/ProtectedRoute.jsx`)
Guarding is controlled at the layout level using `ProtectedRoute`:
- **Uninitialized State**: While loading credentials, an `AuthLoadingScreen` is displayed.
- **Unauthenticated Session**: Users lacking tokens are redirected to `/login` with location states preserved.
- **Profile Check Redirects**:
  - If a route requires a profile and the user hasn't set one up (`requireProfile={true}` and `!hasProfile`), they are redirected to `/profile-setup`.
  - If a route does *not* require a profile (like `/profile-setup`) and the user has completed their profile, they are redirected to the homepage dashboard (`/`).

---

## State Management & Authentication Flow

Global session credentials and user profile states are maintained in a unified React Context.

### 1. Context Structure (`auth/AuthContext.jsx`)
The `AuthContext` provides the following reactive states:
- `token`: The current JWT token string.
- `isAuthenticated`: A boolean indicating if a token is present (`Boolean(token)`).
- `profile`: Student profile data object.
- `hasProfile`: Indicates if a database profile exists.
- `profileChecked`: Boolean flagging whether profile verification completed.
- `profileLoading`: Fetching status spinner flag.
- `isInitialized`: Signals if initial LocalStorage token validation completes.

### 2. Context Actions
- `setAuthFromToken(token)`: Persists token in LocalStorage and updates state.
- `clearAuth()`: Discards tokens from LocalStorage, resets contexts, and redirects.
- `refreshProfileStatus()`: Makes an API call to fetch profile data. Handled as a promise catching `404` errors (triggering profile-setup redirects) and `401/403` credentials errors (logging out).

---

## API Layer & Axios Middleware

API calls are coordinated through a centralized Axios client instance (`api/axiosClient.js`).

### 1. Axios Base Configuration
- Resolves server base URL through Vite meta variables: `import.meta.env.VITE_API_URL`.
- Configured with `withCredentials: true` and default JSON headers.

### 2. Request Interceptor
- Intercepts outgoing requests, loads any present JWT token from LocalStorage (`AUTH_TOKEN_KEY`), and injects it as a Bearer string in the headers:
  `config.headers['Authorization'] = 'Bearer <token>'`
- Logs requests in development mode for debugging.

### 3. Response Interceptor
- Automatically detects `401 Unauthorized` or `403 Forbidden` statuses. If it intercepts these codes, and the request was *not* targeting login/registration, it wipes the LocalStorage token and redirects the browser page to `/login`.
- Rejects promises to propagate specific errors to the calling UI components.

---

## WebSocket & Notification Services

LifeOS integrates real-time notifications (friend requests, activity alerts) via STOMP WebSockets over native transport channels.

### 1. Connection Lifecycle (`services/websocketService.js`)
- **Protocol Resolution**: Derives a WebSocket connection URL by transforming standard HTTP protocols (e.g. `http://localhost:8080/ws` becomes `ws://localhost:8080/ws`).
- **Client Client Initialization**: Uses `@stomp/stompjs` client instances.
- **Authorization Handshake**: Injects the Bearer JWT token directly into the CONNECT headers.
- **Subscription broker mapping**:
  Upon connection validation, subscribes the active user to a user-specific private queue:
  `/user/queue/notifications`
  Received messages are parsed from JSON strings and passed to dynamic callbacks (e.g. Toast notifications or header badges).

### 2. Disconnection
- Handled when logging out or closing pages via `disconnectWebSocket()`, calling `deactivate()` on the active STOMP broker client.
