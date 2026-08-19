# Task Manager API — Layered Architecture (Phase 1)

A production-ready RESTful Task Management API built using **Node.js, Express.js, MongoDB, and Mongoose**. Refactored into a clean, modular layered architecture (Controller-Service-Model pattern) with centralized error handling, response standardization, and API versioning.

## Student Information

- **Student Name:** Priyanshi Gajiwala
- **Enrollment No.:** 24IT019
- **Course:** Advanced Web Development Frameworks
- **Course Code:** ITUE301
- **Practical:** 5 - MongoDB Integration and Schema Design with Mongoose (Phase 1 Refactor)

---

## Technical Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Configuration:** dotenv

---

## Project Architecture

The application follows a clean layered architecture separating concerns into routes, controllers, services, models, database configuration, and middleware.

```text
Client Request
      │
      ▼
┌─────────────┐
│   Routes    │  (src/routes/task.routes.js)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Controllers │  (src/controllers/task.controller.js)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Services   │  (src/services/task.service.js)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Models    │  (src/models/Task.js)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  MongoDB    │  (src/config/db.js)
└─────────────┘
```

### Directory Structure

```text
task-manager-api-24IT019/
│
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection setup
│   │
│   ├── controllers/
│   │   └── task.controller.js    # HTTP Request & Response handlers
│   │
│   ├── middleware/
│   │   └── error.middleware.js   # Global error & 404 middleware
│   │
│   ├── models/
│   │   └── Task.js               # Mongoose schema and model definition
│   │
│   ├── routes/
│   │   └── task.routes.js        # Endpoint route definitions
│   │
│   ├── services/
│   │   └── task.service.js       # Business logic & database operations
│   │
│   ├── utils/
│   │   └── response.js           # Standard response helpers
│   │
│   ├── app.js                    # Express app configuration & middleware
│   └── server.js                 # HTTP server bootstrap & DB initialization
│
├── .env                          # Local environment variables (git-ignored)
├── .env.example                  # Template for environment variables
├── .gitignore
├── package.json
└── README.md
```

---

## Installation & Setup

1. **Clone & Navigate:**
   ```bash
   cd task-manager-api-24IT019
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env` and fill in your configuration:
   ```bash
   cp .env.example .env
   ```

   `.env` Example:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/task_manager
   NODE_ENV=development
   ```

4. **Start MongoDB:**
   Ensure MongoDB service is running locally on port `27017` or supply a valid MongoDB Atlas connection URI in `MONGO_URI`.

5. **Run the API:**

   - Production / Standard mode:
     ```bash
     npm start
     ```

   - Development mode (with auto-reload):
     ```bash
     npm run dev
     ```

---

## API Endpoints & Reference

**Base URL:** `http://localhost:5000/api/v1`

### Health Check Endpoint

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Check API system health & DB status |

**Response Example:**
```json
{
  "success": true,
  "message": "API is healthy",
  "data": {
    "status": "ok",
    "database": "connected",
    "uptime": 12.34
  }
}
```

---

### Task Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/tasks` | Get all tasks |
| `GET` | `/api/v1/tasks/:id` | Get task by ID |
| `POST` | `/api/v1/tasks` | Create a new task |
| `PUT` | `/api/v1/tasks/:id` | Update task by ID |
| `DELETE` | `/api/v1/tasks/:id` | Delete task by ID |

---

## Request & Response Examples

### 1. Create a Task (`POST /api/v1/tasks`)

**Headers:**
`Content-Type: application/json`

**Body:**
```json
{
  "title": "Complete Phase 1 Refactoring",
  "description": "Refactor Task Manager API into layered architecture",
  "priority": "high"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "64f9b8c2d1e2f3a4b5c6d7e8",
    "title": "Complete Phase 1 Refactoring",
    "description": "Refactor Task Manager API into layered architecture",
    "completed": false,
    "priority": "high",
    "createdAt": "2026-08-12T13:50:00.000Z",
    "__v": 0
  }
}
```

---

### 2. Validation Error Response (400 Bad Request)

If `title` is missing:

```json
{
  "success": false,
  "message": "Validation failed",
  "details": {
    "title": "Title is required"
  }
}
```

---

### 3. Resource Not Found (404 Not Found)

`GET /api/v1/tasks/64f9b8c2d1e2f3a4b5c6d700`

```json
{
  "success": false,
  "message": "Task not found"
}
```

---

### 4. Unknown Route (404 Not Found)

`GET /api/v1/does-not-exist`

```json
{
  "success": false,
  "message": "Route not found"
}
```