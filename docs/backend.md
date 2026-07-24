# LifeOS Backend Architecture & Developer Documentation

This document describes the architectural layout, package structures, module responsibilities, components, and security setup of the LifeOS Spring Boot backend monolith.

---

## Package & Project Structure

The LifeOS backend follows a **domain-driven feature structure**. Instead of partitioning classes into generic horizontal layers (e.g., placing all controllers in a global `controllers` package), code is grouped by operational business domains (e.g., `task`, `student`, `friend`, `stats`). This isolates domain context and simplifies code navigation.

The main codebase is rooted at the package `users.java.LifeOS` under `src/main/java`.

### Domain Packages Map
- **`auth`**: Security configurations, OAuth2 login handlers, user details services, and JWT helpers.
- **`user`**: User identity accounts, credentials database layer, and general settings.
- **`student`**: Student profiles (associated branch, college, bio) and discovery searches.
- **`branch`**: Academic departments / branch entities and startup metadata seeds.
- **`task`**: Core task CRUD operations, filters, specifications, and data views.
- **`task.label`**: Focus labels, customization weights, and default seeder configurations.
- **`task.prioritization`**: Priority scoring algorithm and explanations engine.
- **`note`**: Task-linked study notes and annotations.
- **`activity`**: Behavior analytics logs, timeline endpoints, and heatmap data.
- **`stats`**: Points accumulation, completions stats, and recalculation engines.
- **`stats.streak`**: Consecutive daily activity streak tracking and schedulers.
- **`level`**: XP calculation, milestone progress, and academic leveling-up rules.
- **`rewards`**: Action points calculator and reward dispatch.
- **`friend` & `friend.request`**: Friends management, requests validations, and relationships status.
- **`feed`**: Aggregated social feed of friends' activities.
- **`dashboard`**: Single-call workspace aggregator compiling current user status.
- **`insights`**: Activity analytics, weekly trends, and category distribution computations.
- **`notification`**: User notifications database layer, mark-read APIs, and schedulers.
- **`websocket`**: Real-time STOMP WebSockets config and authorization channel interceptors.
- **`taskgeneration`**: AI tasks seeder integrating with the Google Gemini API client.
- **`exceptions`**: Centralized API exception handler and custom application exceptions.
- **`util`**: Shared helper entities (e.g., JPA audit logging base class).

---

## Component Layers Design

Within each package, LifeOS adheres to a clean separation of concerns using Spring MVC design layers:

### 1. Database Entities
Relational data schemas mapped to Java classes via Jakarta Persistence (JPA).
- Most entity classes extend `BaseEntity` (located in `users.java.LifeOS.util`), which provides automatic auditing fields (`createdAt`, `updatedAt`) through Spring Data JPA auditing.
- Primary keys are annotated with `@Id` and generated using identity sequences.

### 2. JPA Repositories
Data access interfaces extending `JpaRepository` or custom JPA Specifications (like `TaskSpecification`).
- Handle database operations using built-in methods or declarative queries (`@Query`).

### 3. Business Services
Core logic resides within service components annotated with `@Service`.
- Services coordinate data transitions, enforce business requirements (e.g. validating friend request limits), and operate within transaction boundaries using `@Transactional`.

### 4. Data Transfer Objects (DTOs) & Views
Immutability models representing request inputs and response payloads.
- **`*Dto`**: Used to capture incoming requests, bound to JSR-380 validation annotations (`@Valid`, `@NotBlank`, `@Size`).
- **`*View` / `*Response`**: Output DTO representations customized for the client UI to prevent leakage of internal database structures.

### 5. Object Mappers
Performance mapping layers converting internal Entities to client DTOs.
- Handled cleanly using **MapStruct** (interfaces suffixed with `*Mapper` compiled into optimized conversion classes).

### 6. Rest Controllers
Endpoints exposing endpoints using `@RestController` and `@RequestMapping`.
- Controllers handle HTTP status bindings, path/query variables parsing, inputs validation checks, and delegate actions to services.

---

## Core Operational Modules

### 1. Authentication & Identity Context
- **Security Chain (`auth.config.SecurityConfig`)**: Exposes public login, registration, websocket, and Swagger endpoints while enforcing bearer token verification on all other paths.
- **JWT Authorization (`auth.filters.JwtAuthenticationFilter`)**: Intercepts requests, extracts JWT bearer tokens, validates claims via `JwtService`, and populates the `SecurityContextHolder`.
- **Google OAuth2 Login**:
  - `CustomOAuth2UserService` maps Google user attributes.
  - `CustomOAuth2SuccessHandler` generates a temporary OAuth code and redirects to the frontend with it.
  - `OAuthExchangeController` exposes a public endpoint to consume the code and issue the long-lived JWT.

### 2. Task Prioritization Engine
LifeOS calculates a priority score ($S$) for active tasks using `TaskPriorityCalculator`. The system weights the following attributes:
- **Deadlines**: Tasks nearing their due dates receive higher scores. Overdue tasks trigger additional score boosts.
- **Manual Priority**: Explicit priorities (e.g. High, Medium, Low) scale the base priority.
- **Label Weight**: Labels carry numeric priority values configured by the student, affecting the task ranking.
- **Calculated Results**: The algorithm produces a `SmartPriorityLevel` and a list of human-readable explanations (`PriorityResult`) clarifying why the task is ranked at that position.

### 3. Gamification System (Streaks, Levels & Rewards)
- **Streaks (`stats.streak.StreakService`)**: Daily job checking for recent user activity. If the user completes a task or logs in, the streak is maintained; otherwise, it is reset.
- **Levels (`level.LevelService`)**: XP increases on task completions. Level thresholds are determined in `LevelProgressionService` using exponential growth curves.
- **Rewards (`rewards.RewardService`)**: Actions (like completing tasks, maintaining streaks) trigger points dispatch via `RewardCalculator` which maps directly to the active `UserStats`.

### 4. AI-Powered Task Generation
- **Gemini Client (`taskgeneration.gemini.GeminiClient`)**: Dispatches tasks generation requests to Google's Gemini models using an API key environment variable.
- **Prompt Construction (`taskgeneration.ai.TaskGenerationPromptBuilder`)**: Accepts student focus inputs and structures prompts instructing Gemini to output structured JSON matching `GeneratedTaskDraft`.

### 5. WebSockets Message Broker
- **STOMP Configuration (`websocket.WebSocketConfig`)**: Maps the connection endpoint `/ws` and enables a simple message broker routing traffic on `/topic` and `/queue`.
- **JWT Handshake Interceptor (`websocket.JwtChannelInterceptor`)**: Extracts JWT credentials from STOMP connection headers during the initial WebSocket handshake to authenticate the user session.
