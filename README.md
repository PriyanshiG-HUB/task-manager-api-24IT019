# Task Manager REST API

A simple RESTful API built using **Node.js and Express.js** for managing tasks.  
This project demonstrates CRUD operations, middleware, validation, logging, and centralized error handling.

## Features

- Create, read, update, and delete tasks
- In-memory task storage
- Request logging middleware
- Content-Type validation for POST/PUT requests
- Task ID validation middleware
- Custom 404 handler
- Global error handling middleware
- Appropriate HTTP status codes

## Technologies Used

- Node.js
- Express.js
- JavaScript
- Postman
- Visual Studio Code

## Installation

1. Clone the repository:

```bash
git clone <your-repository-url>
```

2. Navigate to the project folder:

```bash
cd task-manager-api-24IT019
```

3. Install dependencies:

```bash
npm install
```

4. Start the server:

```bash
node server.js
```

The server will run on:

```text
http://localhost:5000
```

## API Endpoints

| Method | Endpoint | Description | Status Code |
|--------|----------|-------------|-------------|
| GET | `/tasks` | Get all tasks | 200 |
| POST | `/tasks` | Create a new task | 201 |
| PUT | `/tasks/:id` | Update an existing task | 200 / 404 |
| DELETE | `/tasks/:id` | Delete a task | 200 / 404 |

## Example Task

```json
{
  "id": 1,
  "title": "Learn Node.js",
  "completed": false
}
```

## Middleware

### Request Logging

Logs the HTTP method, URL, and timestamp for every incoming request.

Example:

```text
GET /tasks - 2026-08-02T15:30:00.000Z
```

### Content-Type Validation

POST and PUT requests must contain:

```text
Content-Type: application/json
```

### Task ID Validation

Validates the task ID before the request reaches the controller.

### 404 Handler

Returns a structured response for undefined routes:

```json
{
  "error": "Route not found"
}
```

### Global Error Handler

Handles server errors and returns:

```json
{
  "error": "Something went wrong"
}
```

## HTTP Status Codes

- `200` - Successful request
- `201` - Resource created successfully
- `400` - Bad request
- `404` - Resource/route not found
- `500` - Internal server error

## Learning Outcome

Successfully designed and implemented a RESTful API using Node.js and Express with CRUD operations, middleware, validation, proper HTTP status codes, logging, 404 handling, and centralized error handling.

## Author

**Priyanshi Gajiwala**  
Roll No: **24IT019**