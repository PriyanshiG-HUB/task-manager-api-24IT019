# Task Management System & Developer Portfolio (Practicals 1–13)

[![CI Pipeline](https://github.com/PriyanshiG-HUB/task-manager-api-24IT019/actions/workflows/ci.yml/badge.svg)](https://github.com/PriyanshiG-HUB/task-manager-api-24IT019/actions/workflows/ci.yml)
![Node Version](https://img.shields.io/badge/Node.js-v22-green.svg)
![React Version](https://img.shields.io/badge/React-v19-blue.svg)
![Database](https://img.shields.io/badge/Database-MongoDB%20%2F%20Mongoose-brightgreen.svg)
![Docker](https://img.shields.io/badge/Containerized-Docker%20Compose-blue.svg)
![License](https://img.shields.io/badge/License-Academic%20Use-orange.svg)

A complete, production-grade full-stack web application combining a **React 19 single-page portfolio & task client** with a modular **Node.js, Express, MongoDB RESTful API**. Developed as a cumulative laboratory project for the **Advanced Web Development Frameworks (ITUE301)** course, progressing across 13 specialized engineering practicals.

---

## Student Information

- **Student Name:** Priyanshi Gajiwala
- **Enrollment Number:** 24IT019
- **Course Title:** Advanced Web Development Frameworks
- **Course Code:** ITUE301
- **Academic Year:** 2026–2027
- **GitHub Repository:** [https://github.com/PriyanshiG-HUB/task-manager-api-24IT019](https://github.com/PriyanshiG-HUB/task-manager-api-24IT019)

---

## Master Table of Contents (Practicals 1–13)

- [System Architecture & Technology Stack](#system-architecture--technology-stack)
- [Quick Start: Running the Project](#quick-start-running-the-project)
- [Practical 1 — Component Hierarchy & Responsive Portfolio UI](#practical-1--component-hierarchy--responsive-portfolio-ui)
- [Practical 2 — State Management, Controlled Forms & Routing](#practical-2--state-management-controlled-forms--routing)
- [Practical 3 — External REST API Integration & Dynamic State](#practical-3--external-rest-api-integration--dynamic-state)
- [Practical 4 — Node.js & Express RESTful API with In-Memory CRUD](#practical-4--nodejs--express-restful-api-with-in-memory-crud)
- [Practical 5 — MongoDB Integration & Schema Modeling with Mongoose](#practical-5--mongodb-integration--schema-modeling-with-mongoose)
- [Practical 6 — Layered Architecture & Controller-Service-Model Refactoring](#practical-6--layered-architecture--controller-service-model-refactoring)
- [Practical 7 — User Authentication & JWT Middleware Execution Pipeline](#practical-7--user-authentication--jwt-middleware-execution-pipeline)
- [Practical 8 — Frontend Performance Optimization & Lazy Loading](#practical-8--frontend-performance-optimization--lazy-loading)
- [Practical 9 — In-Memory Caching & Database Query Optimization](#practical-9--in-memory-caching--database-query-optimization)
- [Practical 10 — Asynchronous Processing & Event-Driven Architecture](#practical-10--asynchronous-processing--event-driven-architecture)
- [Practical 11 — Full-Stack Containerization with Docker & Compose](#practical-11--full-stack-containerization-with-docker--compose)
- [Practical 12 — CI/CD Pipeline with GitHub Actions & Automated Testing](#practical-12--cicd-pipeline-with-github-actions--automated-testing)
- [Practical 13 — AI API Integration with OpenAI & Responsible AI](#practical-13--ai-api-integration-with-openai--responsible-ai)
- [Automated Test Suite Verification (42 Tests)](#automated-test-suite-verification-42-tests)

---

## System Architecture & Technology Stack

The project implements a modern decoupled architecture:

```text
┌────────────────────────────────────────────────────────┐
│                   CLIENT APPLICATION                   │
│   React 19 + TypeScript + Vite + Tailwind CSS v4       │
│  (Port 5173 / Multi-stage Nginx Container in Prod)     │
└───────────────────────────┬────────────────────────────┘
                            │
                            │ HTTP / JSON (CORS enabled)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   BACKEND API SERVER                   │
│         Node.js 22 + Express 5 (Port 5000)             │
├────────────────────────────────────────────────────────┤
│ 1. Request Logging & Body Parsing Middleware           │
│ 2. JWT Authentication Barrier (auth.middleware.js)     │
│ 3. Per-Task AI Rate Limiting (aiRateLimit.middleware)  │
│ 4. Cache-Aside Layer with node-cache (cache.js)        │
│ 5. Layered Controllers, Services, and Event Emitters   │
└───────────────┬────────────────────────┬───────────────┘
                │                        │
       Mongoose │               OpenAI   │ API
            ODM │                    SDK │ (gpt-4o-mini)
                ▼                        ▼
┌────────────────────────┐      ┌────────────────────────┐
│    MONGODB DATABASE    │      │   OPENAI CLOUD API     │
│ MongoDB 7.0 / Port 27017      │ Generative AI Engine   │
│ Named Volume: mongo_data      │ (Graceful Fallback)    │
└────────────────────────┘      └────────────────────────┘
```

### Core Technologies
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, React Router DOM v7, Framer Motion, React Icons.
- **Backend:** Node.js 22 (CommonJS), Express.js 5, Mongoose 9, `bcryptjs`, `jsonwebtoken`, `node-cache`, `dotenv`, `cors`, OpenAI SDK.
- **Testing:** Node.js native test runner (`node:test`, `node:assert/strict`).
- **DevOps & CI/CD:** Docker, Docker Compose, Multi-stage builds, GitHub Actions.

---

## Quick Start: Running the Project

### Option A: Local Development (Recommended)

1. **Start MongoDB:**
   ```powershell
   net start MongoDB
   # Or start via services.msc
   ```

2. **Start Backend API (Terminal 1):**
   ```powershell
   npm run dev
   # Server runs at http://localhost:5000
   # Health check at http://localhost:5000/api/v1/health
   ```

3. **Start Frontend Client (Terminal 2):**
   ```powershell
   cd frontend
   npm run dev
   # Vite development server runs at http://localhost:5173
   ```

### Option B: Docker Compose (All-in-One Container Stack)

Launch Docker Desktop, then execute in the root directory:
```powershell
docker compose up --build -d
```
- Frontend: `http://localhost:5173`
- Backend Health: `http://localhost:5000/api/v1/health`
- MongoDB: `localhost:27017`

To stop the containers:
```powershell
docker compose down
```

---

## Practical 1 — Component Hierarchy & Responsive Portfolio UI

### Objective
Design and implement a responsive personal developer portfolio web application utilizing modern component-based architecture in React, modular layout composition, and utility-first styling.

### Key Implementation Details
- **Component Breakdown:** Created reusable layout components ([`Navbar.tsx`](frontend/src/components/layout/Navbar.tsx), [`Footer.tsx`](frontend/src/components/layout/Footer.tsx), [`Layout.tsx`](frontend/src/components/layout/Layout.tsx)) and page sections ([`Hero.tsx`](frontend/src/components/home/Hero.tsx), [`AboutPreview.tsx`](frontend/src/components/home/AboutPreview.tsx), [`FeaturedProjects.tsx`](frontend/src/components/home/FeaturedProjects.tsx), [`QuickStats.tsx`](frontend/src/components/home/QuickStats.tsx)).
- **Design System:** Implemented responsive design tokens using **Tailwind CSS v4** with CSS variables for dark and light surface palettes.
- **Micro-Interactions:** Added fluid page entry transitions, scroll tracking, and card hover effects using **Framer Motion**.

### Learning Outcomes
- Mastered React functional component composition and props passing.
- Established clean separation between presentation cards and layout containers.

---

## Practical 2 — State Management, Controlled Forms & Routing

### Objective
Implement controlled form components, real-time reactive state management with React hooks, and multi-page client-side routing.

### Key Implementation Details
- **Controlled Contact Form ([`Contact.tsx`](frontend/src/pages/Contact.tsx)):** Form fields (`name`, `email`, `message`) synchronized directly with React `useState`.
- **Live Reactive Preview:** Renders an interactive live message card updating in real time as the user types.
- **Dynamic Character Counter:** Tracks message character length and validates against minimum and maximum thresholds.
- **Theme Switcher:** Dark/light mode state toggle with `localStorage` persistence.
- **Client-Side Routing ([`frontend/src/router/index.tsx`](frontend/src/router/index.tsx)):** Multi-page navigation across `/`, `/about`, `/projects`, `/experience`, `/contact`, and a dedicated 404 fallback page ([`NotFound.tsx`](frontend/src/pages/NotFound.tsx)).

### Learning Outcomes
- Understood unidirectional data flow and controlled vs. uncontrolled form elements.
- Implemented client-side SPA routing without page reloads.

---

## Practical 3 — External REST API Integration & Dynamic State

### Objective
Integrate an external third-party REST API asynchronously into React, managing request lifecycles, loading indicators, error boundaries, and search filters.

### Key Implementation Details
- **GitHub REST API Integration ([`useGitHub.ts`](frontend/src/hooks/useGitHub.ts), [`Projects.tsx`](frontend/src/pages/Projects.tsx)):** Fetches real repositories from `https://api.github.com/users/PriyanshiG-HUB/repos` using modern `async/await` and `fetch`.
- **Lifecycle Management with `useEffect`:** Invokes the API request strictly on initial mount with an empty dependency array `[]` to prevent infinite network request loops.
- **State Lifecycle:** Manages `repos`, `loading`, `error`, and `searchQuery` via `useState`.
- **Loading & Error Handling:**
  - Centered animated spinner component ([`Spinner.tsx`](frontend/src/components/Spinner.tsx)) during active network fetch.
  - User-friendly error banner ([`ErrorMessage.tsx`](frontend/src/components/ErrorMessage.tsx)) with an interactive **"Retry Request"** button.
- **Real-Time Search Filtering:** Case-insensitive search input dynamically filtering repositories by name and description.
- **Modular Cards ([`RepoCard.tsx`](frontend/src/components/RepoCard.tsx)):** Displays repository stars (⭐ `stargazers_count`), description, language, and GitHub links.

### Learning Outcomes
- Handled asynchronous side-effects, network errors, rate limits, and dynamic list rendering.

---

## Practical 4 — Node.js & Express RESTful API with In-Memory CRUD

### Objective
Develop a foundational RESTful API backend using Node.js and Express.js implementing full CRUD capabilities, custom middleware pipelines, and centralized error handling.

### Key Implementation Details
- **In-Memory Store:** Managed collection of task resources with auto-incrementing IDs.
- **REST Endpoints:**
  - `GET /tasks` — Fetch all tasks (HTTP 200).
  - `POST /tasks` — Create task with payload validation (HTTP 201).
  - `PUT /tasks/:id` — Update existing task by ID (HTTP 200 / 404).
  - `DELETE /tasks/:id` — Delete task by ID (HTTP 200 / 404).
- **Custom Middleware Execution:**
  - Request logger middleware outputting HTTP method, URL, and ISO timestamp.
  - Content-Type enforcement middleware rejecting non-JSON requests on `POST`/`PUT` with HTTP 400.
  - Task ID parameter validation middleware checking numeric format.
  - Centralized 404 route not found handler and global 500 error handler.

### Learning Outcomes
- Gained fundamental understanding of HTTP request-response cycles, status codes, and middleware chaining in Express.

---

## Practical 5 — MongoDB Integration & Schema Modeling with Mongoose

### Objective
Replace in-memory data structures with persistent document database storage using MongoDB and Mongoose Object Data Modeling (ODM).

### Key Implementation Details
- **Database Connection ([`src/config/db.js`](src/config/db.js)):** Configured robust Mongoose connection logic using connection pooling, environment-driven URI (`MONGO_URI`), and process termination handlers.
- **Mongoose Schema & Model ([`src/models/Task.js`](src/models/Task.js)):**
  ```javascript
  const taskSchema = new mongoose.Schema(
    {
      title: { type: String, required: [true, "Title is required"], trim: true, maxlength: 100 },
      description: { type: String, trim: true },
      completed: { type: Boolean, default: false },
      priority: { type: String, enum: ["low", "medium", "high"], default: "medium" }
    },
    { timestamps: true }
  );
  ```
- **Database Persistence:** Converted CRUD operations from memory mutations to Mongoose model queries (`find()`, `create()`, `findByIdAndUpdate()`, `findByIdAndDelete()`).
- **Validation:** Mongoose built-in schema validators enforcing required fields, string trimming, and enumeration constraints.

### Learning Outcomes
- Designed NoSQL document schemas, handled MongoDB connection lifecycles, and utilized Mongoose validation.

---

## Practical 6 — Layered Architecture & Controller-Service-Model Refactoring

### Objective
Refactor monolithic server code into an enterprise-grade **Controller-Service-Model (CSM)** layered architecture with API versioning and standardized responses.

### Key Implementation Details
- **Architectural Separation:**
  - **Routes ([`src/routes/task.routes.js`](src/routes/task.routes.js)):** HTTP path mapping and middleware attachments. Mounted at versioned prefix `/api/v1/tasks` (with backwards compatibility at `/tasks`).
  - **Controllers ([`src/controllers/task.controller.js`](src/controllers/task.controller.js)):** Extracts parameters from `req`, delegates to services, and returns formatted HTTP responses.
  - **Services ([`src/services/task.service.js`](src/services/task.service.js)):** Pure business logic, query construction, and database operations.
  - **Models ([`src/models/Task.js`](src/models/Task.js)):** Mongoose document schemas and database interfaces.
- **Centralized Response Standardization ([`src/utils/response.js`](src/utils/response.js)):** Uniform JSON format across all endpoints:
  ```json
  { "success": true, "message": "...", "data": { ... } }
  { "success": false, "message": "...", "details": { ... } }
  ```
- **Error Handling Middleware ([`src/middleware/error.middleware.js`](src/middleware/error.middleware.js)):** Catches Mongoose CastErrors (invalid ObjectIDs), validation errors, duplicate key violations (E11000), and generic server errors.

### Learning Outcomes
- Implemented Separation of Concerns (SoC) and clean enterprise backend structure.

---

## Practical 7 — User Authentication & JWT Middleware Execution Pipeline

### Objective
Secure the application using stateless **JSON Web Token (JWT)** authentication, password hashing using `bcryptjs`, authentication middleware guards, and connect the React frontend with the secure backend.

### Key Implementation Details
- **User Schema ([`src/models/User.js`](src/models/User.js)):** Unique normalized lowercase `email` and hashed `password`.
- **Authentication Service ([`src/services/auth.service.js`](src/services/auth.service.js)):**
  - Registration: Hashes passwords with salt rounds = 10 using `bcrypt.hash()`.
  - Login: Validates credentials with `bcrypt.compare()` and generates signed JWTs with expiration (`expiresIn: "1h"`).
- **JWT Verification Middleware ([`src/middleware/auth.middleware.js`](src/middleware/auth.middleware.js)):**
  - Validates incoming `Authorization: Bearer <token>` header.
  - Verifies token signature using `JWT_SECRET` and attaches decoded user payload to `req.user`.
- **Task Route Protection:** Guarded task routes to ensure operations execute in the context of authenticated sessions.
- **Frontend Integration ([`Login.tsx`](frontend/src/pages/Login.tsx), [`Register.tsx`](frontend/src/pages/Register.tsx), [`Tasks.tsx`](frontend/src/pages/Tasks.tsx)):**
  - Token management in browser `localStorage`.
  - Protected route wrappers and automatic session-expiry redirection.

### Learning Outcomes
- Mastered secure password hashing, stateless token-based authorization, and full-stack JWT lifecycle.

---

## Practical 8 — Frontend Performance Optimization & Lazy Loading

### Objective
Optimize React single-page application load time and runtime responsiveness through route-based code splitting and on-demand chunk delivery using `React.lazy()` and `React.Suspense`.

### Key Implementation Details
- **Route-Level Code Splitting ([`frontend/src/router/index.tsx`](frontend/src/router/index.tsx)):** Converted static page imports into dynamic imports using `React.lazy(() => import(...))` across all 14 routes.
- **Debounced Suspense Fallback:** Implemented a specialized `PageLoader` fallback with a ~300ms debounce delay. Eliminates annoying visual spinner flicker on fast connections while presenting an accessible loading state on slow networks.
- **Measured Performance Gains:**
  - Eliminated monolithic bundle download on initial page visit.
  - Reduced initial JavaScript payload by over **60%**.
  - Improved First Contentful Paint (FCP) and Time to Interactive (TTI).
- **Comprehensive Documentation:** Full audit and bundle analysis recorded in [`docs/practical-8-performance.md`](docs/practical-8-performance.md).

### Learning Outcomes
- Understood dynamic module imports, bundler chunking (Vite/Rollup), and lazy loading strategies in modern SPAs.

---

## Practical 9 — In-Memory Caching & Database Query Optimization

### Objective
Implement an in-memory Cache-Aside architecture to accelerate read queries, minimize redundant database round-trips, and maintain cache consistency through automated invalidation on data mutations.

### Key Implementation Details
- **Cache Configuration ([`src/config/cache.js`](src/config/cache.js)):** Configured `node-cache` with a default Time-To-Live (`stdTTL: 60s`) and automated check periods.
- **Cache-Aside Strategy in Task Service ([`src/services/task.service.js`](src/services/task.service.js)):**
  1. `GET /tasks`: Checks for cached key `"all_tasks"`. If HIT, returns immediately from RAM. If MISS, executes MongoDB query, stores result in cache, and returns.
  2. `GET /tasks/:id`: Checks cache key `"task_<id>"`. Serves HIT from memory; otherwise queries database and sets key.
- **Automated Cache Invalidation:**
  - Creating a task (`POST /tasks`) invalidates `"all_tasks"`.
  - Updating a task (`PUT /tasks/:id`) invalidates both `"all_tasks"` and `"task_<id>"`.
  - Deleting a task (`DELETE /tasks/:id`) purges both keys.
- **Debug & Monitoring API ([`src/routes/cache.routes.js`](src/routes/cache.routes.js)):**
  - `GET /api/v1/cache/stats` — Real-time cache metrics (hits, misses, key count).
  - `DELETE /api/v1/cache` — Manual cache flush endpoint.
- **Benchmark Results:** Response times reduced from **~85ms (MongoDB query)** down to **~2ms (Cache HIT)** — an approximate **97% latency reduction**. Full report in [`docs/practical-9-caching.md`](docs/practical-9-caching.md).

### Learning Outcomes
- Mastered the Cache-Aside pattern, cache invalidation strategies, and real-time cache analytics.

---

## Practical 10 — Asynchronous Processing & Event-Driven Architecture

### Objective
Implement non-blocking, asynchronous background processing using Node.js's native `EventEmitter` pattern to decouple core HTTP request-response cycles from secondary side-effects.

### Key Implementation Details
- **Event Bus Definition ([`src/events/events.js`](src/events/events.js)):** Instantiated centralized `taskEvents` emitter with increased max listeners.
- **Event Listeners ([`src/events/listeners.js`](src/events/listeners.js)):**
  - `task-created`: Triggers asynchronous simulated notifications and audit logging.
  - `task-updated`: Logs state transitions and modified fields.
  - `task-deleted`: Records audit log entry with deleted task ID and title.
- **Non-Blocking Architecture:**
  - HTTP responses return immediately to the client without waiting for secondary notifications.
  - Immediate execution deferral (`setImmediate`) ensures notification handlers run in subsequent event loop iterations.
- **Fault-Tolerant Error Handling:** Controlled notification failures (e.g. simulated network gateway timeouts) are caught and logged without crashing the server or affecting API responses.
- **Asynchronous Contact Inquiries ([`src/models/Message.js`](src/models/Message.js), [`src/routes/message.routes.js`](src/routes/message.routes.js)):** Persists contact messages asynchronously to MongoDB with background notification events.
- **Full Report:** Documented in [`docs/practical-10-event-driven.md`](docs/practical-10-event-driven.md).

### Learning Outcomes
- Mastered pub/sub patterns in Node.js, event loop tick deferral, and building fault-tolerant asynchronous services.

---

## Practical 11 — Full-Stack Containerization with Docker & Compose

### Objective
Containerize the entire full-stack application (frontend, backend, database) using production-optimized multi-stage Dockerfiles and orchestrate multi-container deployment using Docker Compose.

### Key Implementation Details
- **Backend Dockerfile ([`Dockerfile`](Dockerfile)):**
  - Based on `node:22-alpine` for minimal attack surface and lightweight image size.
  - Layer caching: copies `package.json` and `package-lock.json` before source code.
  - Deterministic production install via `npm ci --omit=dev`.
- **Frontend Multi-Stage Dockerfile ([`frontend/Dockerfile`](frontend/Dockerfile)):**
  - **Stage 1 (Build):** `node:22-alpine` runs `npm ci` and executes Vite build with dynamic `VITE_API_BASE_URL` build argument.
  - **Stage 2 (Production Server):** `nginx:alpine` serves compiled static assets with custom [`nginx.conf`](frontend/nginx.conf) supporting SPA client-side routing fallback (`try_files $uri /index.html`).
- **Docker Compose Orchestration ([`docker-compose.yml`](docker-compose.yml)):**
  - **mongodb:** MongoDB 7.0 container with named volume `mongo_data:/data/db` for permanent data persistence.
  - **backend:** Configured with environment variables, healthchecks (`db.adminCommand('ping')`), and network dependency (`depends_on: condition: service_healthy`).
  - **frontend:** Published on port `5173`.
  - **app-network:** Isolated bridge network enabling DNS-based service resolution (`mongodb://mongodb:27017/task_manager`).
- **Security & Efficiency:** Comprehensive [`.dockerignore`](.dockerignore) excluding local `node_modules`, `.env`, `.git`, and test artifacts.

### Learning Outcomes
- Mastered multi-stage Docker builds, container networking, healthchecks, volume persistence, and full-stack orchestration.

---

## Practical 12 — CI/CD Pipeline with GitHub Actions & Automated Testing

### Objective
Establish an automated **Continuous Integration (CI)** pipeline using GitHub Actions that triggers on every push to the `main` branch, running the entire test suite on a clean Linux virtual environment.

### Key Implementation Details
- **Workflow Location:** [`.github/workflows/ci.yml`](.github/workflows/ci.yml).
- **Triggers:** Push to `main` branch and manual trigger via `workflow_dispatch`.
- **Pipeline Environment:**
  - Runner: `ubuntu-latest`.
  - Node.js: Version `22` with npm package cache.
  - Database Service: Automated `mongo:6.0` Docker container running on port `27017` on the runner.
  - Steps: Checkout repository &rarr; Setup Node.js &rarr; `npm install` &rarr; `npm test`.
- **Meaningful Automated Endpoint Tests ([`tests/endpoints.test.js`](tests/endpoints.test.js)):**
  1. `GET /api/v1/health` &rarr; Asserts HTTP 200, `status: "ok"`, database connected.
  2. `GET /api/v1/tasks` (unauthenticated) &rarr; Asserts HTTP 401, `Authentication token required`.
  3. `POST /api/v1/messages` (invalid body) &rarr; Asserts HTTP 400, `Name is required`.
- **Controlled Failure & Recovery Demonstration (Lab Requirement):**
  - **Deliberate Failure:** Changed expected health status from `200` to `201` in commit `test: demonstrate failing CI pipeline`. Pushed to `main` &rarr; GitHub Actions failed with a **Red Cross**, verifying that broken tests correctly fail the build.
  - **Correction:** Restored assertion back to `200` in commit `test: fix assertion and restore passing CI`. Pushed to `main` &rarr; GitHub Actions completed with a **Green Checkmark**.
- **Status Badge:** Live build status badge integrated at the top of this README.

### Learning Outcomes
- Mastered CI/CD concepts, GitHub Actions workflow authoring, automated testing in virtual runners, and service containerization.

---

## Practical 13 — AI API Integration with OpenAI & Responsible AI

### Objective
Integrate an AI-powered task description generator into the Task Management application using the official OpenAI Node.js SDK and `gpt-4o-mini`, implementing backend-only security, per-task rate limiting, graceful degradation, and responsible AI practices.

### Key Implementation Details
- **Secure Server-Side Configuration ([`src/config/openai.js`](src/config/openai.js)):**
  - Instantiates OpenAI SDK client strictly on the backend.
  - Loads `OPENAI_API_KEY` from server `.env`. Key is **never exposed** to the browser, never bundled into frontend assets, and excluded from git/docker.
  - Applies a 10-second request timeout.
- **AI Service with Graceful Degradation ([`src/services/ai.service.js`](src/services/ai.service.js)):**
  - System prompt generates concise, professional, 1–2 sentence actionable descriptions based on task title.
  - If the API key is missing or invalid, or if OpenAI quota/credits are exhausted (HTTP 429), or if a network error occurs, the service **gracefully degrades** without crashing.
  - Returns fallback response:
    ```json
    {
      "success": true,
      "description": "",
      "fallback": true,
      "message": "AI description generation is temporarily unavailable. Please write your description manually."
    }
    ```
- **Per-Task Rate Limiting ([`src/middleware/aiRateLimit.middleware.js`](src/middleware/aiRateLimit.middleware.js)):**
  - Enforces a limit of **1 generation request per task title per 60 seconds** per user (`${userId}:${normalizedTitle}`).
  - Consecutive requests within 60s return HTTP 429 with `Retry-After: <seconds>`.
  - Independent usage: rate limits on one title do not block other tasks.
- **React Frontend Integration ([`Tasks.tsx`](frontend/src/pages/Tasks.tsx)):**
  - **"✨ Generate description with AI"** button with spinning loading indicator.
  - Suggestion populates the standard description textarea and remains **100% editable** by the user before saving.
  - Prominent UI disclaimer:
    > *"AI-generated suggestion. Please review and edit before saving. AI-generated content may be inaccurate."*
- **Responsible AI & Data Privacy:**
  - Strict user control: AI output is purely advisory; tasks are never saved automatically.
  - Data minimization: only the task title is transmitted.
  - Strictly prohibited data list: Passwords, tokens, financial details, personal IDs, health data.
- **Automated Mock Test Suite ([`tests/ai.test.js`](tests/ai.test.js)):**
  - 12 automated unit and integration tests using mocked OpenAI responses, verifying all success, fallback, validation, and rate limit states without consuming real API credits.

### Learning Outcomes
- Mastered secure third-party AI integration, rate limiting, graceful failure handling, and ethical AI deployment.

---

## Automated Test Suite Verification (42 Tests)

The repository includes a comprehensive automated test suite powered by Node's built-in test runner (`node:test`).

To execute all tests locally:
```powershell
npm test
```

### Actual Test Execution Output:
```text
TAP version 13
# Subtest: Practical 9 — In-Memory Caching & Debug API Suite
  ok 1 - H. Authentication: should reject unauthenticated request with 401
  ok 2 - H. Authentication: should reject request with invalid Bearer token with 401
  ok 3 - A. GET /tasks with empty cache: should query database and record MISS
  ok 4 - B. GET /tasks subsequent request: should serve from cache and record HIT
  ok 5 - C. POST /tasks: should create task and invalidate cache
  ok 6 - F. GET /tasks/:id: first request = MISS, second request = HIT
  ok 7 - D. PUT /tasks/:id: should update task and invalidate cache
  ok 8 - E. DELETE /tasks/:id: should delete task and invalidate cache
  ok 9 - G. Cache Stats: GET /api/v1/cache/stats returns metrics
  ok 10 - Debug: DELETE /api/v1/cache clears cache
# Subtest: Practical 10 — Event-Driven Architecture Suite
  ok 1 - 1. Security: unauthenticated task creation rejected with 401
  ok 2 - 2. Validation: task creation without title rejected with 400
  ok 3 - 3. Event Emission: task-created is emitted with title, id, and user
  ok 4 - 4. Async Notification: notification logged asynchronously without blocking HTTP response
  ok 5 - 5. Validation: task update with empty title rejected with 400
  ok 6 - 6. Event Emission: task-updated is emitted with previous and updated state
  ok 7 - 7. Cache Invalidation: task-updated invalidates cache
  ok 8 - 8. Deletion & Cache: successful deletion returns 200 and invalidates cache
  ok 9 - 9. Event Emission: task-deleted is emitted after deletion
  ok 10 - 10. Negative Case: failed deletion does not emit task-deleted event
  ok 11 - 11. Error Handling: controlled failure caught and logged without crashing server
# Subtest: Contact Inquiries Suite
  ok 1 - Validation: should reject message without name with 400
  ok 2 - Validation: should reject message with invalid email with 400
  ok 3 - Validation: should reject message without body with 400
  ok 4 - Persistence: should persist message to MongoDB via POST /messages
  ok 5 - Security: should reject unauthenticated GET /messages with 401
  ok 6 - Retrieval: should return messages list for authenticated request with 200
# Subtest: Practical 12 — CI Core Endpoint Integration Suite
  ok 1 - Health Endpoint: GET /health should return HTTP 200 and healthy status
  ok 2 - Security Endpoint: GET /tasks without token should return HTTP 401
  ok 3 - Validation Endpoint: POST /messages with missing name should return HTTP 400
# Subtest: Practical 13 — AI API Integration & Graceful Degradation Suite
  ok 1 - 1. Mock Success: should return clean AI description on successful provider response
  ok 2 - 2. Missing Key Fallback: should return fallback response when client is null
  ok 3 - 3. Provider Auth Failure: should catch 401 error and return fallback without throwing
  ok 4 - 4. Provider Timeout or Network Error: should handle network timeout gracefully
  ok 5 - 5. Security: unauthenticated request to /ai/generate-description should return 401
  ok 6 - 6. Validation: request with empty title should return 400
  ok 7 - 7. Validation: request with missing title field should return 400
  ok 8 - 8. Validation: request with title exceeding 200 characters should return 400
  ok 9 - 9. Fallback & Safe Handling: valid authenticated request returns 200 with fallback response
  ok 10 - 10. Security: response should never leak OPENAI_API_KEY or internal secrets
  ok 11 - 11. Rate Limiting: repeated requests for same task title within 60s should return 429
  ok 12 - 12. Rate Limit Isolation: different task titles are not blocked by cooldown
1..5
# tests 42
# suites 7
# pass 42
# fail 0
# cancelled 0
# duration_ms 21745.31
```

---

## Author & Academic Information

- **Student Name:** Priyanshi Gajiwala
- **Enrollment Number:** 24IT019
- **Course:** Advanced Web Development Frameworks (ITUE301)
- **Institution:** Department of Information Technology
- **Repository:** [https://github.com/PriyanshiG-HUB/task-manager-api-24IT019](https://github.com/PriyanshiG-HUB/task-manager-api-24IT019)
