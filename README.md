# Task Manager API — Layered Architecture & Authentication Pipeline

A production-ready RESTful Task Management API built using **Node.js, Express.js, MongoDB, Mongoose, bcryptjs, and JSON Web Tokens (JWT)**. Built on a modular layered architecture (Controller-Service-Model pattern) with centralized error handling, response standardization, API versioning, input validation, and JWT-based authentication middleware pipeline.

## Student Information

- **Student Name:** Priyanshi Gajiwala
- **Enrollment No.:** 24IT019
- **Course:** Advanced Web Development Frameworks
- **Course Code:** ITUE301
- **Practical:** 7 (Authentication and Middleware Pipeline) & 8 (Performance Optimization and Lazy Loading)
- **Practical 8 Documentation:** [docs/practical-8-performance.md](docs/practical-8-performance.md)

---

## Technical Stack

- **Runtime:** Node.js (CommonJS)
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication & Security:** JSON Web Token (`jsonwebtoken`), Password Hashing (`bcryptjs`)
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