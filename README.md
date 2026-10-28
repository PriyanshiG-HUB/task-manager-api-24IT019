# Task Manager API — Layered Architecture & Authentication Pipeline

A production-ready RESTful Task Management API built using **Node.js, Express.js, MongoDB, Mongoose, bcryptjs, and JSON Web Tokens (JWT)**. Built on a modular layered architecture (Controller-Service-Model pattern) with centralized error handling, response standardization, API versioning, input validation, and JWT-based authentication middleware pipeline.

## Student Information

- **Student Name:** Priyanshi Gajiwala
- **Enrollment No.:** 24IT019
- **Course:** Advanced Web Development Frameworks
- **Course Code:** ITUE301
- **Practical:** 7 (Authentication and Middleware Pipeline), 8 (Performance Optimization and Lazy Loading), 9 (In-Memory Caching and Query Optimization), 10 (Asynchronous Processing with Event-Driven Architecture) & 11 (Full-Stack Containerization with Docker and Docker Compose)
- **Practical 8 Documentation:** [docs/practical-8-performance.md](docs/practical-8-performance.md)
- **Practical 9 Documentation:** [docs/practical-9-caching.md](docs/practical-9-caching.md)
- **Practical 10 Documentation:** [docs/practical-10-event-driven.md](docs/practical-10-event-driven.md)

---

## Technical Stack

- **Runtime:** Node.js (CommonJS)
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication & Security:** JSON Web Token (`jsonwebtoken`), Password Hashing (`bcryptjs`)
- **In-Memory Caching:** `node-cache`
- **Configuration:** dotenv
- **CORS:** cors

---

## Project Architecture & Middleware Pipeline

The application adheres to a clean layered architecture with an Express middleware execution pipeline:

```text
Client Request
      │
      ▼ (Authorization: Bearer <token>)
┌─────────────────────────┐
│     Auth Middleware     │  (src/middleware/auth.middleware.js)
│  (Verify JWT & req.user)│
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Validation Middleware  │  (src/middleware/validation.middleware.js)
│  (Validate req.body)    │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│       Controllers       │  (src/controllers/auth.controller.js / task.controller.js)
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│        Services         │  (src/services/auth.service.js / task.service.js)
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│         Models          │  (src/models/User.js / Task.js)
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│        MongoDB          │  (src/config/db.js)
└─────────────────────────┘
```

### Directory Structure

```text
task-manager-api-24IT019/
│
├── src/
│   ├── config/
│   │   └── db.js                       # MongoDB connection setup
│   │
│   ├── controllers/
│   │   ├── auth.controller.js          # Authentication HTTP handlers (register, login, me)
│   │   └── task.controller.js          # Task HTTP handlers
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js          # JWT verification & req.user assignment
│   │   ├── error.middleware.js         # Global error, duplicate key & 404 middleware
│   │   └── validation.middleware.js   # Request payload validation middleware
│   │
│   ├── models/
│   │   ├── Task.js                     # Task Mongoose schema & model
│   │   └── User.js                     # User Mongoose schema & model (email, password)
│   │
│   ├── routes/
│   │   ├── auth.routes.js              # Auth endpoints (/api/v1/auth)
│   │   └── task.routes.js              # Task endpoints (/api/v1/tasks)
│   │
│   ├── services/
│   │   ├── auth.service.js             # Auth business logic, bcrypt hashing & JWT generation
│   │   └── task.service.js             # Task business logic & database queries
│   │
│   ├── utils/
│   │   └── response.js                 # Standardized JSON response helpers
│   │
│   ├── app.js                          # Express app configuration & route mounting
│   └── server.js                       # HTTP server bootstrap & DB initialization
│
├── .env                                # Local environment variables (git-ignored)
├── .env.example                        # Template for environment variables
├── .gitignore
├── package.json
└── README.md
```

---

## Practical 7: Authentication & Middleware Pipeline

### 1. Overview
Practical 7 introduces secure user authentication and request validation without altering existing Task schema or breaking layered architecture.

- **Password Hashing:** Passwords are never stored in plain text. `bcryptjs` is used to hash passwords with a salt work factor of 10 (`bcrypt.hash(password, 10)`).
- **Stateless Authentication:** Upon successful login, the server signs a JSON Web Token (JWT) using `process.env.JWT_SECRET` containing the user payload (`id`, `email`) and a 1-hour expiration.
- **Middleware Pipeline:** Incoming protected requests are intercepted by `authMiddleware` which extracts and verifies the `Bearer <token>`. Valid requests populate `req.user` and pass execution to subsequent validators and controllers.
- **Input Validation:** Request schemas are validated in dedicated middleware (`validateRegister`, `validateLogin`, `validateTask`) before reaching services or MongoDB.

---

## Environment Variables

Configure `.env` using `.env.example`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/task_manager
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
```

> **Security Note:** `.env` is strictly git-ignored. `JWT_SECRET` must never be hardcoded or committed into version control.

---

## Installation & Setup

1. **Clone & Navigate:**
   ```bash
   cd task-manager-api
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start MongoDB:**
   Ensure MongoDB service is running locally on port `27017` or update `MONGO_URI`.

4. **Run the Server:**
   - Development Mode:
     ```bash
     npm run dev
     ```
   - Production Mode:
     ```bash
     npm start
     ```

---

## API Endpoints Reference

**Base URL:** `http://localhost:5000/api/v1`

### Authentication Endpoints (`/api/v1/auth`)

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | No | Register new user account with hashed password |
| `POST` | `/api/v1/auth/login` | No | Authenticate user credentials and return JWT token |
| `GET` | `/api/v1/auth/me` | Yes (`Bearer <token>`) | Fetch current authenticated user profile |

### Task Endpoints (`/api/v1/tasks`) — Protected

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/tasks` | Yes (`Bearer <token>`) | Get all tasks |
| `GET` | `/api/v1/tasks/:id` | Yes (`Bearer <token>`) | Get task by ID |
| `POST` | `/api/v1/tasks` | Yes (`Bearer <token>`) | Create a new task (Validates title) |
| `PUT` | `/api/v1/tasks/:id` | Yes (`Bearer <token>`) | Update task by ID (Validates title) |
| `DELETE` | `/api/v1/tasks/:id` | Yes (`Bearer <token>`) | Delete task by ID |

### System Endpoint

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | No | Check API system health & DB connectivity |

---

## Request & Response Examples

### 1. User Registration (`POST /api/v1/auth/register`)

**Headers:** `Content-Type: application/json`  
**Request Body:**
```json
{
  "email": "priyanshi@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "6aaa47e6571aef5879e36c58",
    "email": "priyanshi@example.com",
    "createdAt": "2026-09-16T07:40:22.341Z",
    "updatedAt": "2026-09-16T07:40:22.341Z"
  }
}
```

---

### 2. User Login (`POST /api/v1/auth/login`)

**Headers:** `Content-Type: application/json`  
**Request Body:**
```json
{
  "email": "priyanshi@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "6aaa47e6571aef5879e36c58",
      "email": "priyanshi@example.com",
      "createdAt": "2026-09-16T07:40:22.341Z",
      "updatedAt": "2026-09-16T07:40:22.341Z"
    }
  }
}
```

---

### 3. Get Current User Profile (`GET /api/v1/auth/me`)

**Headers:**
`Authorization: Bearer <JWT_TOKEN>`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User profile fetched successfully",
  "data": {
    "_id": "6aaa47e6571aef5879e36c58",
    "email": "priyanshi@example.com",
    "createdAt": "2026-09-16T07:40:22.341Z",
    "updatedAt": "2026-09-16T07:40:22.341Z"
  }
}
```

---

### 4. Protected Task Access (`GET /api/v1/tasks`)

**Without Token (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Authentication token required"
}
```

**With Valid Token (200 OK):**
`Authorization: Bearer <JWT_TOKEN>`
```json
{
  "success": true,
  "message": "Tasks fetched successfully",
  "data": [
    {
      "_id": "6aaa47e6571aef5879e36c59",
      "title": "Practical 7 Authentication",
      "description": "Testing JWT protected task creation",
      "completed": false,
      "priority": "high",
      "createdAt": "2026-09-16T07:40:22.638Z",
      "__v": 0
    }
  ]
}
```

---

### 5. Input Validation Failures (400 Bad Request)

- **Missing Title on Task Creation:**
```json
{
  "success": false,
  "message": "Task title is required"
}
```

- **Short Password on Registration:**
```json
{
  "success": false,
  "message": "Password must be at least 6 characters long"
}
```

---

## Practical 8 — Performance Optimization & Lazy Loading

Comprehensive frontend performance optimization, React route-based code splitting, `React.lazy()`, `Suspense`, bundle measurements, and Chrome DevTools Network analysis are documented in:

📄 **[docs/practical-8-performance.md](docs/practical-8-performance.md)**

---

## Practical 9 — In-Memory Caching & Query Optimization

Server-side in-memory caching using `node-cache` with strict post-write invalidation guarantees, cache hit/miss tracking, debug endpoints, and response-time measurements.

### Key Architectural Highlights:
- **Engine:** `node-cache` with a default TTL of 60 seconds (configurable via `CACHE_TTL` environment variable).
- **All-Tasks Cache:** `GET /api/v1/tasks` caches the task collection under the key `'all_tasks'`.
- **Single-Task Cache:** `GET /api/v1/tasks/:id` caches individual tasks under `'task_${taskId}'`.
- **Strict Invalidation:** Successful `POST`, `PUT`, and `DELETE` operations immediately invalidate the relevant cache keys to prevent stale data reads. Invalidation strictly occurs *after* database write confirmation.
- **Cache Observability:** Console logging (`[Cache] HIT`, `[Cache] MISS`, `[Cache] SET`, `[Cache] INVALIDATED`) and real-time statistics endpoint.
- **Debug Endpoints:**
  - `GET /api/v1/cache/stats` — Inspect live cache hit/miss counters (`{ hits, misses }`).
  - `DELETE /api/v1/cache` — Flush the task cache on demand.
- **Automated Testing:** 10 automated test suites verifying MISS/HIT transitions, write invalidation, authentication protection, and debug endpoints via `npm test`.

Detailed documentation, architecture diagrams, testing procedures, and response-time comparison templates are documented in:

📄 **[docs/practical-9-caching.md](docs/practical-9-caching.md)**

---

## Practical 10 – Asynchronous Processing with Event-Driven Architecture

Implementation of asynchronous background processing using Node.js native `EventEmitter` without introducing external dependencies. This ensures long-running notifications or side-effects don't block the API response.

### Key Architectural Highlights:
- **Native Node.js EventEmitter:** Used to build a decoupled observer pattern.
- **Events:** `task-created`, `task-deleted`, and robust `error` handling.
- **Asynchronous Notification Listener:** Encapsulated inside `setImmediate()` to ensure non-blocking HTTP response execution.
- **Timestamp Evidence:** Server logs actively demonstrate timestamps showing the 201 response concludes significantly earlier than the notification listener.
- **2-second Simulated Delay:** Replicates slow third-party service latency within the background listener.
- **Error Listener:** Dedicated `error` event listener to catch execution failures without bringing down the main process.

Detailed technical explanation, architecture diagrams, implementation breakdown, and Q&A are documented in:

📄 **[docs/practical-10-event-driven.md](docs/practical-10-event-driven.md)**

---

## Practical 11 — Full-Stack Containerization with Docker and Docker Compose

Comprehensive containerization of the full-stack Task Management application orchestrating the React frontend, Node.js/Express backend API, and MongoDB database using **Docker** and **Docker Compose**.

### 1. Architecture Overview

The multi-container application is defined in [`docker-compose.yml`](docker-compose.yml) and consists of three isolated services interconnected via a user-defined bridge network:

```text
               Browser / Client Machine
                 │                 │
                 │ :5173           │ :5000
                 ▼                 ▼
     ┌──────────────────────┐   ┌──────────────────────┐
     │  Frontend Container  │   │   Backend Container  │
     │     (Nginx:alpine)   │   │  (Node:22-alpine)    │
     │  React SPA on :5173  │   │  Express API on :5000│
     └──────────┬───────────┘   └──────────┬───────────┘
                │                          │
                │     Docker Bridge        │
                │  Network (`app-network`) │
                └──────────────┬───────────┘
                               │
                               │ :27017 (`mongodb:27017`)
                               ▼
                    ┌──────────────────────┐
                    │  Database Container  │
                    │     (mongo:7.0)      │
                    │   MongoDB on :27017  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Named Docker Volume │
                    │    (`mongo_data`)    │
                    │    Mounted /data/db  │
                    └──────────────────────┘
```

- **Frontend Service (`frontend`):** Vite React Single Page Application compiled via a multi-stage Docker build and served using an ultra-lightweight Nginx container (`nginx:alpine`) on port `5173`.
- **Backend Service (`backend`):** Node.js / Express REST API running on `node:22-alpine` on port `5000` with native EventEmitter, caching, and health endpoints.
- **Database Service (`mongodb`):** Official MongoDB container (`mongo:7.0`) published on port `27017` with built-in healthcheck.
- **Network (`app-network`):** User-defined Docker bridge network providing isolated automatic DNS service discovery between containers.
- **Persistent Storage (`mongo_data`):** Named Docker volume mounted at `/data/db` ensuring database collections persist across container lifecycles.

---

### 2. Relevant Project Structure

```text
task-manager-api/
├── .dockerignore                 # Backend Docker build exclusion rules
├── Dockerfile                    # Backend production Dockerfile (node:22-alpine)
├── docker-compose.yml            # Multi-container orchestration specification
├── frontend/
│   ├── .dockerignore             # Frontend Docker build exclusion rules
│   ├── Dockerfile                # Multi-stage frontend Dockerfile (node -> nginx)
│   ├── nginx.conf                # Nginx SPA fallback configuration (port 5173)
│   └── src/lib/api.ts            # Client API client with VITE_API_BASE_URL support
├── src/                          # Express API source code (controllers, models, routes)
└── README.md
```

---

### 3. Service Endpoints & Access URLs

| Service | Container Port | Host Published Port | Access URL | Health Check URL |
|:---|:---:|:---:|:---|:---|
| **Frontend** | `5173` | `5173` | [`http://localhost:5173`](http://localhost:5173) | N/A (Static SPA) |
| **Backend API** | `5000` | `5000` | [`http://localhost:5000/api/v1`](http://localhost:5000/api/v1) | [`http://localhost:5000/api/v1/health`](http://localhost:5000/api/v1/health) |
| **MongoDB** | `27017` | `27017` | `localhost:27017` | `mongosh --eval "db.adminCommand('ping')"` |

---

### 4. Prerequisites

1. **Docker Engine & CLI:** Docker Desktop v24+ (Windows / macOS / Linux).
2. **Docker Compose:** Docker Compose v2+ (`docker compose`).
3. Verify installation:
   ```powershell
   docker --version
   docker compose version
   docker info
   ```

---

### 5. Environment Configuration

Docker Compose automatically injects runtime configuration into the backend container, avoiding the need to commit `.env` files into Docker images:

- `PORT=5000`
- `NODE_ENV=production`
- `MONGO_URI=mongodb://mongodb:27017/task_manager`
- `JWT_SECRET=task_manager_practical7_secret_2026`
- `CACHE_TTL=60`

> **Security Guarantee:** Real credentials and `.env` files are strictly excluded from Docker build contexts via `.dockerignore`. Local development continues to use `.env` independently.

---

### 6. Build and Run Commands

#### A. Build and Start All Services
Build images and launch containers in the foreground to inspect live logs:
```powershell
docker compose up --build
```

#### B. Run in Detached Mode (Background)
```powershell
docker compose up --build -d
```

#### C. Inspect Running Services
Check container health, status, and port bindings:
```powershell
docker compose ps
```
Inspect detailed Docker container info:
```powershell
docker ps
```

#### D. View Real-Time Logs
Follow live aggregated logs from all services:
```powershell
docker compose logs -f
```
Or stream logs for a single service:
```powershell
docker compose logs -f backend
docker compose logs -f mongodb
docker compose logs -f frontend
```

#### E. Stop All Services
Stop and remove containers and networks while preserving named volumes:
```powershell
docker compose down
```

---

### 7. MongoDB Data Persistence

MongoDB stores all database collections inside `/data/db`. In `docker-compose.yml`, this path is mapped to the named volume `mongo_data`:

```yaml
volumes:
  - mongo_data:/data/db
```

- **Persistence Guarantee:** When running `docker compose down`, the containers and `app-network` are removed, but the `mongo_data` volume is **retained**.
- When `docker compose up -d` is run again, MongoDB re-attaches to `mongo_data`, and all created tasks, users, and contact messages remain intact.
- *Caution:* Never use `docker compose down -v` unless you explicitly want to purge all database records.

---

### 8. Key Concepts & Frequently Asked Questions

#### Q1: Why use `mongodb` instead of `localhost` in `MONGO_URI`?
Inside a Docker container, `localhost` (and `127.0.0.1`) refers **strictly to that specific container itself**, not to the host machine or other containers. 

When containers are connected to the user-defined bridge network `app-network`, Docker Compose creates an internal DNS resolver. The backend reaches the database container using the service name:
```text
mongodb://mongodb:27017/task_manager
```
If the backend attempted to connect to `localhost:27017`, it would look for MongoDB inside the backend container where no database server is running, resulting in `ECONNREFUSED`.

#### Q2: What is the difference between `EXPOSE` and `ports`?
- **`EXPOSE` (Dockerfile):** Acts as internal documentation and metadata. It declares that the container listens on the specified network ports at runtime. However, `EXPOSE` **does not publish** the port to the host machine.
- **`ports` (docker-compose.yml / `docker run -p`):** Actually allocates and forwards a host port to the container port (e.g., `"5000:5000"`). This makes the container accessible from the host browser and external HTTP clients at `http://localhost:5000`.

#### Q3: Why not copy `node_modules` into Docker images?
1. **Platform Compatibility:** Local `node_modules` often contain native binaries (C++ add-ons compiled with `node-gyp`) compiled for your host OS (e.g., Windows x64). Copying them into a Linux Alpine container causes binary execution errors.
2. **Reproducibility & Clean Slate:** Running `npm ci --omit=dev` inside the container guarantees a clean, deterministic dependency tree based strictly on `package-lock.json`.
3. **Build Context Efficiency:** `node_modules` directories are hundreds of megabytes in size. Excluding them via `.dockerignore` speeds up Docker context transfers from minutes to seconds.

---

### 9. Common Troubleshooting Guide

1. **Port Already in Use (`bind: address already in use`):**
   - *Cause:* A local MongoDB server or Node dev server is already listening on port 27017 or 5000.
   - *Fix:* Stop local processes before launching Docker:
     ```powershell
     # Stop local background node server or mongod
     Get-Process node, mongod -ErrorAction SilentlyContinue | Stop-Process
     ```
2. **MongoDB Connection Refused from Backend:**
   - *Cause:* Backend started before MongoDB finished initializing its socket.
   - *Fix:* In `docker-compose.yml`, the backend declares `depends_on` with `condition: service_healthy` coupled with the `mongodb` healthcheck. Docker Compose guarantees backend startup only after MongoDB's ping check succeeds.
3. **Frontend Cannot Connect to Backend in Browser:**
   - *Cause:* Attempting to configure the browser API to `http://backend:5000`. The browser runs on the host machine, which cannot resolve internal Docker Compose service names (`backend`).
   - *Fix:* Ensure the frontend requests `http://localhost:5000/api/v1` which maps through published host ports.
4. **Docker Desktop Not Running (`open //./pipe/dockerDesktopLinuxEngine`):**
   - *Cause:* Docker daemon is not active on Windows.
   - *Fix:* Launch Docker Desktop from the Start Menu or run `Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"`. Wait until Docker Desktop reports "Engine running".
