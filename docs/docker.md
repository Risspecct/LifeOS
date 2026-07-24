# LifeOS Containerization & Docker Documentation

This document explains the Docker configuration, multi-stage image builds, container responsibilities, network bridges, port layouts, and container environment variables for the LifeOS application.

---

## High-Level Architecture Overview

LifeOS uses a dual-container layout run via Docker Compose. The setup builds and runs both the React web client and the Java Spring Boot service in isolated environments.

```
                  Client Browser (External)
                           │
             ┌─────────────┴─────────────┐
             ▼ (Port 5173)               ▼ (Port 8080)
      ┌──────────────┐            ┌──────────────┐
      │  lifeos-     │            │  lifeos-     │
      │  frontend    │            │  backend     │
      │  (Nginx:80)  │            │  (Java:8080) │
      └──────────────┘            └──────────────┘
             │ (Web API requests via browser redirect)
             └───────────────────────────►
```

---

## 1. Backend Container Configuration

- **Source Location**: `backend/Dockerfile`
- **Docker Image Base**: `eclipse-temurin:21-jre`
- **Build Strategy**: Multi-stage build to isolate the build tools (Maven) from the runtime environment.

### Multi-stage Build Phases
1. **Compilation Phase (`builder`)**:
   - Uses `maven:3.9.11-eclipse-temurin-21` as the build environment.
   - Copies `pom.xml` and downloads dependencies (`mvn dependency:go-offline`) to cache dependency layers.
   - Copies Java sources from `src/` and compiles the production JAR (`mvn clean package -DskipTests`), generating the output artifact at `/app/target/lifeos-backend.jar`.
2. **Runtime Execution Phase**:
   - Spawns a clean `eclipse-temurin:21-jre` runtime container (reducing image footprint and attack surface).
   - Copies the compiled `lifeos-backend.jar` as `/app/app.jar`.
   - Exposes container port `8080`.
   - Launches the JVM process via the entrypoint: `["java", "-jar", "app.jar"]`.

---

## 2. Frontend Container Configuration

- **Source Location**: `frontend/Dockerfile`
- **Docker Image Base**: `nginx:alpine`
- **Build Strategy**: Multi-stage build to compile Vite assets and serve them using a high-performance web server (Nginx).

### Multi-stage Build Phases
1. **Compilation Phase (`builder`)**:
   - Uses `node:22-alpine` to compile assets.
   - Installs packages via `npm install` based on lockfiles.
   - Accepts the build argument `VITE_API_URL` and binds it as an environment variable (`ENV VITE_API_URL`). This builds the backend API endpoint URL directly into the compiled JavaScript bundle.
   - Runs `npm run build` to compile code into HTML, CSS, and JS artifacts in `/app/dist`.
2. **Static Server Phase**:
   - Uses `nginx:alpine` as the runtime server.
   - Copies compiled production assets from the builder stage `/app/dist` to `/usr/share/nginx/html`.
   - Replaces Nginx default configurations with a custom server mapping config (`frontend/nginx.conf`).
   - Exposes container port `80`.

### Custom Nginx Config (`frontend/nginx.conf`)
Because React Router handles routing on the client side, accessing paths directly (e.g. `http://localhost:5173/dashboard`) would cause Nginx to return a 404 error if it searched for that directory statically.
The custom Nginx configuration resolves this by mapping requests to check for static files first, falling back to serving `index.html` to let React Router handle routing on the client side:
```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 3. Docker Compose Orchestration (`docker-compose.yml`)

The root `docker-compose.yml` configures service mappings, port redirections, and dependencies.

### Services Defined

#### 1. `backend`
- **Build Context**: `./backend`
- **Container Name**: `lifeos-backend`
- **Environment variables**: Loads configurations directly from the `.env` file at the root.
- **Port Mapping**: Map host port `8080` to container port `8080` (`8080:8080`).
- **Restart Policy**: `unless-stopped` (always restarts unless intentionally halted).

#### 2. `frontend`
- **Build Context**: `./frontend`
- **Build Arguments**: Passes `VITE_API_URL: http://localhost:8080` to the compiler.
- **Container Name**: `lifeos-frontend`
- **Dependency Constraint**: Depends on the `backend` container (`depends_on`).
- **Port Mapping**: Map host port `5173` to container port `80` (`5173:80`). This serves Nginx traffic on the standard development port.
- **Restart Policy**: `unless-stopped`.

### Networking and Communications
- Docker Compose automatically creates a default network bridge.
- Both containers are mounted on the same network bridge, enabling direct container-to-container calls using service hostnames (e.g., `http://backend:8080` could be called from inside the frontend container if required).
- *Note*: Because the React SPA executes inside the client's browser (external to the Docker bridge network), the `VITE_API_URL` build parameter must point to the public-facing backend host URL (e.g., `http://localhost:8080`) rather than the internal container hostname (`http://backend:8080`).
