# LifeOS

[![Backend](https://img.shields.io/badge/Spring%20Boot-4.0.6-6DB33F?logo=springboot&logoColor=white)](#tech-stack)
[![Frontend](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](#tech-stack)
[![DB](https://img.shields.io/badge/PostgreSQL-supported-4169E1?logo=postgresql&logoColor=white)](#tech-stack)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)](#tech-stack)

LifeOS is a comprehensive student productivity and accountability platform designed to make academic work structured, visible, and easier to act on. It integrates task management, smart priority computation, progress tracking, and lightweight social motivation into a unified, calm dashboard workspace.

Rather than relying on noisy social notifications or generic lists, LifeOS aligns around a core loop:
**Capture Work $\rightarrow$ Prioritize Key Action Items $\rightarrow$ Display Progression Streaks $\rightarrow$ Foster Social Accountability.**

---

## Implemented Features

Every feature listed below is fully implemented and operational within the codebase:

1. **JWT Authentication & Security**: Complete credentials registration and login using stateless Spring Security, JWT token issuance, verification, and centralized exception handling.
2. **Google OAuth2 Sign-In**: Integration with Google login redirecting to a custom success handler, generating one-time exchange tokens to issue standard JWT sessions on the client.
3. **Student Profile System**: Multi-field student profiles containing college, department branch, bio, and social links, supporting academic discoverability search.
4. **Task Management**: Full CRUD for tasks, with status states, types, and deadline scheduling.
5. **Smart Prioritization**: Computation engine calculating urgency scores for active tasks based on due date proximity, manual priorities, and focus label importance weights.
6. **Focus Labels**: Custom categories with weight levels assigned by users, affecting priority algorithms.
7. **Study Notes**: Rich markdown study notes that can be created independently or attached to specific tasks.
8. **Connections & Friendships**: Discovery search, outgoing/incoming requests, friend removals, and friend list indexing.
9. **Leaderboards**: Rankings sorted by user points and streaks, filterable by scope (Global, Friends-only, and College-wide).
10. **Activity Tracking & Timelines**: Logging actions to generate heatmaps, analytics trends, and chronological activity feeds.
11. **Real-time WebSockets Notifications**: STOMP protocol notifications pushing alerts (like friend requests) to online clients immediately.
12. **AI-Powered Task Generation**: Google Gemini API client integration drafting structured tasks based on description prompts.
13. **Unified Dashboard**: Aggregated workspace endpoint compiling profile summaries, streak milestones, prioritized tasks, upcoming deadlines, and recent activities in a single REST call.

---

## Tech Stack

### Backend
- **Java 21**
- **Spring Boot 4.0.6**
- **Spring Security** (Stateless authentication, OAuth2 Client)
- **Spring Data JPA** (Hibernate ORM, PostgreSQL dialect)
- **JWT (jjwt)** (Token parsing and creation)
- **MapStruct** (Compile-time DTO-to-entity mappings)
- **SpringDoc OpenAPI / Swagger** (Endpoint cataloging)
- **Google Gemini API Client** (AI integration)

### Frontend
- **React 18**
- **Vite** (Compilation and dev server tooling)
- **React Router v6** (Client-side routing)
- **Axios** (REST API client middleware)
- **Tailwind CSS** (Styling theme framework)
- **@stomp/stompjs** (STOMP WebSocket broker client)

### DevOps & Infrastructure
- **Docker** & **Docker Compose**
- **Nginx** (Serving React assets and redirecting routes inside the client container)
- **PostgreSQL** (Relational database)

---

## Project Structure

This directory tree represents the actual codebase structure:

```
LifeOS/
├── backend/               # Spring Boot Backend Code
│   ├── src/               # Java Sources & Resources
│   ├── Dockerfile         # Multi-stage Java Builder & JRE Runner
│   └── pom.xml            # Maven Dependency Manifest
├── frontend/              # React Frontend Code
│   ├── src/               # JS/JSX Components, Pages, Hooks & API layer
│   ├── Dockerfile         # Vite static builder & Nginx runner
│   ├── nginx.conf         # Custom Nginx SPA Routing mapping
│   ├── tailwind.config.js # Tailwind styling theme
│   └── package.json       # Node Dependency Manifest
├── docs/                  # Comprehensive Documentation Suite
│   ├── architecture.md    # Systems Architecture & Communication Diagrams
│   ├── backend.md         # Backend Modular Packages & Code Layout
│   ├── frontend.md        # Frontend Layout & Global Auth Context States
│   ├── docker.md          # Containerization Details
│   ├── deployment.md      # Production Deployments Guidelines
│   └── api.md             # Complete REST API Specifications
├── docker-compose.yml     # Local orchestration manager
├── LICENSE                # License details
└── README.md              # Project Overview & Quickstart
```

---

## Environment Variables

Configure these variables inside your local `.env` or container platform settings:

### Database & JPA Configuration
- `DB_URL`: The JDBC database connection string (e.g. `jdbc:postgresql://host:port/database`).
- `DB_USERNAME`: Database login username.
- `DB_PASSWORD`: Database login password.
- `DDL_AUTO`: Hibernate schema sync strategy (defaults to `update`, set to `validate` in production).
- `SHOW_SQL`: Prints SQL queries in output logs (defaults to `true`, set to `false` in production).

### Security & Token Settings
- `JWT_SECRET`: High-entropy secret key used to sign and verify JWT tokens.
- `JWT_EXPIRATION`: Token lifespan in milliseconds (defaults to `60000000`).

### Google OAuth2 Settings
- `GOOGLE_CLIENT_ID`: The Client ID acquired from Google Cloud Console.
- `GOOGLE_CLIENT_SECRET`: The Client Secret acquired from Google Cloud Console.

### AI Integration
- `GEMINI_API_KEY`: API Key to connect to Google Gemini services.
- `GEMINI_MODEL`: Gemini AI model variant (defaults to `gemini-2.5-flash`).

### Application Origins
- `FRONTEND_URL`: Public domain URL of the frontend React app, used by the backend to map CORS policies (defaults to `http://localhost:5173`).

### Seeder Settings (Local Development)
- `DEMO_ENABLED`: Enables database seeding with mock data on startup (defaults to `false`).
- `DEMO_USERS`: Number of user profiles to generate when demo is enabled (defaults to `40`).
- `TASKS_PER_USER`: Number of mock tasks to generate per user (defaults to `25`).
- `MAX_FRIENDS`: Maximum number of random friend requests per user (defaults to `8`).
- `RANDOM_SEED`: Random seed value for reproducible mock data generation (defaults to `42`).

---

## Running Locally

### Prerequisites
- Java 21 JDK
- Node.js (v22+)
- PostgreSQL instance running locally

### Running Services Independently

#### 1. Start Backend
Navigate to the `backend` directory, override application variables in `src/main/resources/application.properties` or set them in your environment, and run:
- **On Linux/macOS**:
  ```bash
  ./mvnw spring-boot:run
  ```
- **On Windows (PowerShell/CMD)**:
  ```bash
  ./mvnw.cmd spring-boot:run
  ```

#### 2. Start Frontend
Navigate to the `frontend` directory, ensure a `.env.development` exists with `VITE_API_URL=http://localhost:8080`, and run:
```bash
npm install
npm run dev
```

---

## Running with Docker Compose

Docker Compose coordinates the backend, frontend, and environment variables dynamically.

### 1. Build Containers
Compiles the Maven JAR and Vite static assets inside build containers:
```bash
docker compose build
```

### 2. Start Services
Launches the backend and Nginx frontend in the background:
```bash
docker compose up -d
```
The application will be accessible at:
- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:8080`

### 3. Stop Services
Stops running containers and clears internal networks:
```bash
docker compose down
```

---

## Deployment Summary

1. **Database**: Create a PostgreSQL instance with a provider (e.g. Neon, AWS RDS) and verify SSL.
2. **Backend**: Host the backend container on a Docker platform. Map the ports and assign the required environment variables.
3. **Google OAuth**: Add your server domains into Google Console's Redirect URIs (`https://api-domain.com/login/oauth2/code/google`) and Origins (`https://app-domain.com`).
4. **Frontend Build**: Compile static files with the environment variable `VITE_API_URL` pointing to the public backend domain, then host them with a static provider (e.g. Vercel) or a containerized instance of Nginx.
5. **SSL**: Map custom domains and enforce HTTPS to enable secure APIs, OAuth callback handshakes, and secure WebSockets (`wss://`).

*For a detailed walkthrough, see [deployment.md](file:///c:/Users/Rishi/Desktop/Program%20related/Projects/LifeOS/docs/deployment.md).*

---

## License

This project is licensed under the MIT License.
