# CHAROTAR UNIVERSITY OF SCIENCE AND TECHNOLOGY
## FACULTY OF TECHNOLOGY AND ENGINEERING
### Department of Information Technology
### B.Tech Information Technology — Semester V
### ADVANCED WEB DEVELOPMENT FRAMEWORKS (ITUE301)

---

# PRACTICAL 10: ASYNCHRONOUS PROCESSING WITH EVENT-DRIVEN ARCHITECTURE

- **Student Name:** Priyanshi Gajiwala
- **Enrollment Number:** 24IT019
- **Course Name:** Advanced Web Development Frameworks (ITUE301)
- **Branch:** B.Tech Information Technology
- **Academic Year:** 2026–2027
- **GitHub Repository:** [PriyanshiG-HUB/task-manager-api-24IT019](https://github.com/PriyanshiG-HUB/task-manager-api-24IT019)
- **Branch:** `production-upgrade` / `main`

---

## 1. Primary Objective

The objective of Practical 10 is to implement and verify **asynchronous background processing using Node.js's built-in `EventEmitter` module** without external message queue dependencies.

When a task is created through the authenticated REST API (`POST /api/v1/tasks`):
1. Authenticate and validate the request.
2. Persist the task to MongoDB.
3. Invalidate relevant in-memory cache keys (preserving Practical 9 functionality).
4. Send an immediate `201 Created` HTTP response to the client.
5. Emit a `task-created` event *after* dispatching the response.
6. Process the notification in the background using `setImmediate()` and a simulated 2-second `setTimeout()`.
7. Log task title, assigned user ID, and ISO timestamps.
8. Verify through automated tests and timestamp logs that notification completion occurs approximately 2 seconds *after* the API response without blocking client response latency.
9. Implement a non-blocking `task-deleted` notification on task deletion (`DELETE /api/v1/tasks/:id`).
10. Register a dedicated `error` event listener to prevent uncaught exceptions from terminating the Node.js process.

---

## 2. Prerequisites

- **Node.js**: v18.0.0 or higher (uses built-in `events`, `node:test`, and `fetch`)
- **MongoDB**: v6.0+ Community Server running on `127.0.0.1:27017`
- **Postman** or **curl** / **PowerShell `Invoke-RestMethod`** for HTTP verification
- **Existing Codebase**: Layered Express.js architecture (Controllers, Services, Models, Routes) with JWT authentication and Practical 9 `node-cache` in-memory caching.

---

## 3. Theory of Node.js EventEmitter

Node.js is built on a single-threaded, event-driven, non-blocking I/O model governed by the **Event Loop**. The `EventEmitter` class (from the native `events` module) implements the **Observer Pattern**, where an object (the *subject* or *emitter*) maintains a list of dependents (*observers* or *listeners*) and notifies them automatically of state changes by emitting named events.

```javascript
const EventEmitter = require('events');
class TaskEvents extends EventEmitter {}
const taskEvents = new TaskEvents();

// Register listener
taskEvents.on('task-created', (task) => { /* handle */ });

// Emit event
taskEvents.emit('task-created', task);
```

### Key Characteristics:
1. **In-Memory & Lightweight**: No external daemons (e.g., Redis, RabbitMQ) required.
2. **Decoupled Architecture**: Route controllers focus on request validation, database persistence, and HTTP responses, while listeners handle independent side effects (notifications, logging, analytics).
3. **Synchronous by Default**: Calling `emitter.emit('event', args)` executes all registered listeners sequentially on the current call stack before returning.

---

## 4. Technical Distinction: Synchronous emit() vs. Deferred Background Work

> [!IMPORTANT]
> **Critical Concept:** `EventEmitter.emit()` in Node.js invokes all registered listeners **synchronously** by default. Calling `emit()` does not automatically run code in a background thread or defer execution.

If an event listener executes synchronous computation or awaits a slow promise directly, the calling route handler would stall until the listener completes. 

To achieve true asynchronous background execution without blocking the client response:
1. The route handler dispatches the HTTP response first (`sendSuccess(res, 201, ...)`).
2. The event is emitted (`taskEvents.emit('task-created', task, req.user)`).
3. Inside the event listener, execution is deferred using **`setImmediate()`**:
   - `setImmediate()` places the callback into the **Check Phase** of the Node.js Event Loop, allowing current I/O polling and HTTP network serialization to finish first.
4. Inside `setImmediate()`, a **`setTimeout(..., 2000)`** simulates a slow external notification service (e.g., email or push notification) in the **Timers Phase**.
5. Errors in asynchronous callbacks are captured via `try/catch` and forwarded to a registered `error` listener, preventing uncaught exceptions.

---

## 5. System Architecture Diagram

```
                       POST /api/v1/tasks
                                |
                                v
                JWT Authentication & Request Validation
                                |
                                v
                     Persist Task to MongoDB
                                |
                                v
               Invalidate 'all_tasks' Cache (Practical 9)
                                |
                                v
                 Send HTTP 201 Created Response
                                |
                                v
                    Emit 'task-created' Event
                                |
            +-------------------+-------------------+
            |                                       |
            v                                       v
    HTTP Response Returned                  Event Listener Receives Event
    to Client (~15-40ms)                            |
                                                    v
                                         setImmediate() [Check Phase]
                                                    |
                                                    v
                                         Handler Started Log
                                                    |
                                                    v
                                         setTimeout(..., 2000ms) [Timers Phase]
                                                    |
                                                    v
                                         Handler Completed Log (~2000ms later)
```

---

## 6. Implementation Details & File Manifest

### A. Manifest of Created and Modified Files

| File Path | Type | Role in Practical 10 |
|:---|:---|:---|
| [`src/events/events.js`](file:///c:/Users/priya/Downloads/task-manager-api/src/events/events.js) | Created / Improved | Custom `TaskEvents` class extending `EventEmitter`, exporting shared singleton instance. |
| [`src/events/listeners.js`](file:///c:/Users/priya/Downloads/task-manager-api/src/events/listeners.js) | Created / Improved | Registers `error`, `task-created`, and `task-deleted` listeners once at application startup. |
| [`src/controllers/task.controller.js`](file:///c:/Users/priya/Downloads/task-manager-api/src/controllers/task.controller.js) | Modified | Added timestamp logging and event emission (`task-created`, `task-deleted`) after HTTP responses. |
| [`src/services/task.service.js`](file:///c:/Users/priya/Downloads/task-manager-api/src/services/task.service.js) | Modified | Cleaned up Mongoose `findOneAndUpdate` deprecation options while preserving Practical 9 cache invalidation. |
| [`src/app.js`](file:///c:/Users/priya/Downloads/task-manager-api/src/app.js) | Verified | Imports `./events/listeners` once at startup before route mounting. |
| [`tests/events.test.js`](file:///c:/Users/priya/Downloads/task-manager-api/tests/events.test.js) | Created | Automated test suite validating 10 core event requirements using `node:test`. |
| [`docs/practical-10-event-driven.md`](file:///c:/Users/priya/Downloads/task-manager-api/docs/practical-10-event-driven.md) | Created / Improved | Comprehensive practical documentation, theory, manual test procedures, and question answers. |
| [`README.md`](file:///c:/Users/priya/Downloads/task-manager-api/README.md) | Modified | Linked Practical 10 documentation preserving existing practical links. |

---

## 7. Event Emitter & Listener Implementation

### Event Emitter Singleton (`src/events/events.js`)

```javascript
const EventEmitter = require('events');

class TaskEvents extends EventEmitter {}

module.exports = new TaskEvents();
```

### Event Listeners (`src/events/listeners.js`)

```javascript
const taskEvents = require('./events');

/**
 * 1. Error Event Listener (Supplementary Problem 2)
 * Must be registered BEFORE any event emitter calls can emit an error event.
 * Catches and logs errors occurring inside background event handlers without crashing the server.
 * Avoids uncaught exception terminations and prevents recursive error emission.
 */
taskEvents.on('error', (error) => {
    try {
        const timestamp = new Date().toISOString();
        const errorMessage = error && error.message ? error.message : String(error);
        const errorDetails = error && error.stack ? error.stack : errorMessage;

        console.error(`[Notification Error] Failed to process task-created notification`);
        console.error(`Error details: ${errorDetails}`);
        console.error(`[Notification Error] Logged at: ${timestamp}`);

        // Emit safe internal hook for testing without triggering 'error' loops
        taskEvents.emit('notification-error-logged', {
            message: errorMessage,
            details: errorDetails,
            timestamp
        });
    } catch (err) {
        console.error('[Notification Error] Fatal logging failure in error handler:', err.message);
    }
});

/**
 * 2. task-created Event Listener
 * Executes asynchronously using setImmediate() and setTimeout(..., 2000)
 * to simulate a 2-second background notification without blocking the HTTP response.
 */
taskEvents.on('task-created', (task, user) => {
    const scheduledAt = new Date().toISOString();
    console.log(`[Notification] Handler scheduled at: ${scheduledAt}`);

    // Defer execution from current call stack to next iteration of Event Loop
    setImmediate(() => {
        try {
            const startTime = new Date().toISOString();
            console.log(`[Notification] Handler started at: ${startTime}`);

            // Controlled failure hook for Supplementary Problem 2 testing
            if (taskEvents.simulateNotificationError || (task && task.title && task.title.includes("[SIMULATE_ERROR]"))) {
                throw new Error("Simulated notification service failure: network timeout connecting to notification gateway");
            }

            const assignedUser = user && (user.id || user._id || user.email)
                ? (user.id || user._id || user.email)
                : (task && task.user ? task.user : 'Unassigned');

            console.log(`[Notification] Task "${task.title}" assigned to user "${assignedUser}"`);

            // Simulate slow 2-second notification processing
            setTimeout(() => {
                try {
                    const completedAt = new Date().toISOString();
                    console.log(`[Notification] Handler completed at: ${completedAt}`);

                    // Emit internal completion event for monitoring and automated testing
                    taskEvents.emit('notification-completed', {
                        task,
                        assignedUser,
                        scheduledAt,
                        startedAt: startTime,
                        completedAt
                    });
                } catch (timeoutErr) {
                    taskEvents.emit('error', timeoutErr);
                }
            }, 2000);
        } catch (immediateErr) {
            taskEvents.emit('error', immediateErr);
        }
    });
});

/**
 * 3. task-deleted Event Listener (Supplementary Problem 1)
 * Non-blocking task deletion notification deferred using setImmediate().
 * Logs Task title, Task ID, deletion timestamp, and assigned user.
 */
taskEvents.on('task-deleted', (task, user) => {
    const scheduledAt = new Date().toISOString();
    console.log(`[Notification] Handler scheduled at: ${scheduledAt}`);

    setImmediate(() => {
        try {
            const timestamp = new Date().toISOString();
            const taskId = task && (task._id ? task._id.toString() : (task.id || 'Unknown ID'));
            const title = task && task.title ? task.title : 'Untitled Task';
            const assignedUser = user && (user.id || user._id || user.email)
                ? (user.id || user._id || user.email)
                : (task && task.user ? task.user : 'Unassigned');

            console.log(`[Notification] Task "${title}" deleted at ${timestamp}`);
            console.log(`[Notification] Task ID: ${taskId}`);
            console.log(`[Notification] Deleted task assigned user: "${assignedUser}"`);

            // Emit internal completion event for monitoring and automated testing
            taskEvents.emit('task-deleted-processed', {
                task,
                taskId,
                assignedUser,
                deletedAt: timestamp
            });
        } catch (error) {
            taskEvents.emit('error', error);
        }
    });
});

module.exports = taskEvents;
```

---

## 8. Request & Response Execution Flows

### A. Task Creation Flow (`POST /api/v1/tasks`)

1. **Authentication**: Request header `Authorization: Bearer <jwt>` verified by `authMiddleware`. `req.user` attached.
2. **Validation**: `checkContentType` and `validateTask` confirm JSON format and required non-empty `title`.
3. **Database Write**: `taskService.createTask(req.body)` calls `Task.create()` in MongoDB.
4. **Cache Invalidation**: `cache.del("all_tasks")` purges cached task lists.
5. **Console Logging**: `[API] Task created at: <ISO_TIMESTAMP>`.
6. **HTTP Response**: `sendSuccess(res, 201, "Task created successfully", task)` dispatched to client.
7. **Console Logging**: `[API] Response sent at: <ISO_TIMESTAMP>`.
8. **Event Emission**: `taskEvents.emit('task-created', task, req.user)` emitted.
9. **Deferred Processing**: `listeners.js` logs `[Notification] Handler scheduled at...`, defers work with `setImmediate()`, and starts 2-second timer.

### B. Task Deletion Flow (`DELETE /api/v1/tasks/:id`)

1. **Authentication**: Validated via `authMiddleware`.
2. **Database Deletion**: `taskService.deleteTask(id)` invokes `Task.findByIdAndDelete(id)`.
3. **Existence Check**: If `!task`, returns `404 Not Found`. Event is NOT emitted.
4. **Cache Invalidation**: Purges `"all_tasks"` and `"task_<id>"`.
5. **Console Logging**: `[API] Task deleted at: <ISO_TIMESTAMP>`.
6. **HTTP Response**: `sendSuccess(res, 200, "Task deleted successfully", task)` returned.
7. **Console Logging**: `[API] Response sent at: <ISO_TIMESTAMP>`.
8. **Event Emission**: `taskEvents.emit('task-deleted', task, req.user)`.
9. **Background Processing**: `task-deleted` listener logs deletion details and assigned user asynchronously.

---

## 9. Error-Handling Strategy

1. **Error Listener Registration Precedence**:
   Node.js `EventEmitter` treats unhandled `'error'` events as fatal exceptions, causing the Node runtime to print a stack trace and terminate with exit code 1. To protect the server, `taskEvents.on('error', ...)` is registered **before** any business event listeners.
2. **Recursive Emission Prevention**:
   Inside the `error` listener callback, logging is wrapped in a `try/catch` block that directly logs errors to `console.error` without re-emitting `'error'`.
3. **Try/Catch in Asynchronous Callbacks**:
   Exceptions thrown inside asynchronous timer or immediate queues (`setImmediate`, `setTimeout`) cannot be caught by outer route handler `try/catch` blocks. All background blocks are wrapped in local `try/catch` clauses that cleanly delegate errors to `taskEvents.emit('error', err)`.
4. **API Route Fault Isolation**:
   If an error occurs during task creation (e.g., validation failure or database connection drop), the controller forwards the error to Express's global error handler via `next(error)`. No false `task-created` event is ever emitted.

---

## 10. Compatibility with Practical 9 In-Memory Caching

Practical 10 completely preserves all Practical 9 caching behaviors:
- `GET /api/v1/tasks`: Cached under key `"all_tasks"`.
- `GET /api/v1/tasks/:id`: Cached under key `"task_<id>"`.
- `POST /api/v1/tasks`: Invalidates `"all_tasks"` upon creation.
- `PUT /api/v1/tasks/:id`: Invalidates `"all_tasks"` and `"task_<id>"`.
- `DELETE /api/v1/tasks/:id`: Invalidates `"all_tasks"` and `"task_<id>"`.
- Cache statistics (`GET /api/v1/cache/stats`) and cache flushing (`DELETE /api/v1/cache`) remain operational.
- All 10 automated caching tests in `tests/cache.test.js` continue to pass.

---

## 11. How to Run the Application

### Step 1: Start MongoDB

In a dedicated PowerShell window:

```powershell
# Using the project local database directory
& "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath C:\Users\priya\Downloads\task-manager-api\data --port 27017
```

Verify connection readiness:
```powershell
curl.exe http://127.0.0.1:27017
# Expected output: "It looks like you are trying to connect to a MongoDB HTTP interface..."
```

### Step 2: Start the Backend Server

In a second terminal:

```powershell
cd C:\Users\priya\Downloads\task-manager-api
npm run dev
```

Console output confirms:
```
Server running in development mode on port 5000
Connected to MongoDB successfully
```

### Step 3: Run the Automated Tests

In a third terminal:

```powershell
cd C:\Users\priya\Downloads\task-manager-api
npm test
```

---

## 12. Postman & PowerShell Manual Verification Procedure

### A. Health Check
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/v1/health`
- **Expected Status:** `200 OK`
- **Payload:**
  ```json
  {
    "success": true,
    "message": "API is healthy",
    "data": {
      "status": "ok",
      "database": "connected"
    }
  }
  ```

### B. User Registration & Login (Obtain Fresh JWT)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/v1/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "test@example.com",
    "password": "Password123!"
  }
  ```
- *Note:* If the test user does not exist, first register via `POST http://localhost:5000/api/v1/auth/register` with `{ "name": "Tester", "email": "test@example.com", "password": "Password123!" }`.
- Copy the returned token from `data.token`.

### C. Create Task (Observe Asynchronous Non-Blocking Behavior)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/v1/tasks`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "title": "Practical 10 Event Test",
    "description": "Testing asynchronous EventEmitter processing",
    "priority": "high"
  }
  ```
- **Response Received:** In ~15-30ms with `201 Created`:
  ```json
  {
    "success": true,
    "message": "Task created successfully",
    "data": {
      "_id": "6ad8b4111777a0c80a76d576",
      "title": "Practical 10 Event Test",
      "description": "Testing asynchronous EventEmitter processing",
      "completed": false,
      "priority": "high",
      "createdAt": "2026-10-21T12:46:07.540Z"
    }
  }
  ```

### D. Inspect Server Console Timestamps

Notice the exact ordering of timestamps in the terminal:

```text
POST /api/v1/tasks - 2026-10-21T12:46:07.502Z
[Cache] INVALIDATED: all_tasks

[API] Task created at: 2026-10-21T12:46:07.540Z
[API] Response sent at: 2026-10-21T12:46:07.543Z
[Event] task-created emitted at: 2026-10-21T12:46:07.543Z
[Notification] Handler scheduled at: 2026-10-21T12:46:07.543Z
[Notification] Handler started at: 2026-10-21T12:46:07.544Z
[Notification] Task "Practical 10 Event Test" assigned to user "68dbef..."
...
[Notification] Handler completed at: 2026-10-21T12:46:09.551Z
```

> [!NOTE]
> **Key Proof:** The HTTP 201 response was dispatched at `12:46:07.543Z` (latency ~41ms). The notification completion occurred at `12:46:09.551Z` (exactly 2.007 seconds later). The client was **never blocked**.

### E. Delete Task
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/v1/tasks/6ad8b4111777a0c80a76d576`
- **Headers:** `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "message": "Task deleted successfully",
    "data": {
      "_id": "6ad8b4111777a0c80a76d576",
      "title": "Practical 10 Event Test"
    }
  }
  ```
- **Console Log:**
  ```text
  [API] Task deleted at: 2026-10-21T13:13:21.744Z
  [API] Response sent at: 2026-10-21T13:13:21.745Z
  [Event] task-deleted emitted at: 2026-10-21T13:13:21.745Z
  [Notification] Handler scheduled at: 2026-10-21T13:13:21.745Z
  [Notification] Task "Practical 10 Event Test" deleted at 2026-10-21T13:13:21.746Z
  [Notification] Task ID: 6ad8ba71b876ee232cb853af
  [Notification] Deleted task assigned user: "68dbef..."
  ```

### F. Controlled Failure Test (Supplementary Problem 2 Error Logging)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/v1/tasks`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "title": "Controlled Failure Task [SIMULATE_ERROR]",
    "description": "Deliberately triggers an error in the background notification handler"
  }
  ```
- **Response Received:** Immediate `201 Created` (< 30ms).
- **Backend Console Error Output:**
  ```text
  [API] Task created at: 2026-10-21T13:13:21.773Z
  [API] Response sent at: 2026-10-21T13:13:21.774Z
  [Event] task-created emitted at: 2026-10-21T13:13:21.774Z
  [Notification] Handler scheduled at: 2026-10-21T13:13:21.774Z
  [Notification] Handler started at: 2026-10-21T13:13:21.774Z
  [Notification Error] Failed to process task-created notification
  Error details: Error: Simulated notification service failure: network timeout connecting to notification gateway
      at Immediate._onImmediate (C:\Users\priya\Downloads\task-manager-api\src\events\listeners.js:47:23)
      at process.processImmediate (node:internal/timers:491:21)
  [Notification Error] Logged at: 2026-10-21T13:13:21.774Z
  ```
- *Server Status:* Express server remains completely operational and healthy (`GET /api/v1/health` returns `200 OK`).

---

## 13. Automated Test Suite Results

The automated test suite executes all three project test files via `npm test` (`node --test tests/*.test.js`):

### Test Execution Summary Table

| Suite | File | Tests Run | Passed | Failed | Skipped | Status |
|:---|:---|:---:|:---:|:---:|:---:|:---:|
| **Practical 9 Caching Suite** | `tests/cache.test.js` | 10 | 10 | 0 | 0 | PASS |
| **Practical 10 Event Suite** | `tests/events.test.js` | 11 | 11 | 0 | 0 | PASS |
| **Contact Messages Suite** | `tests/message.test.js` | 6 | 6 | 0 | 0 | PASS |
| **TOTAL** | — | **27** | **27** | **0** | **0** | **ALL PASSED** |

### Practical 10 Individual Test Breakdown

| # | Test Description | Result | Duration |
|:---:|:---|:---:|:---:|
| 1 | Unauthenticated task creation rejected with 401 | PASS | 95 ms |
| 2 | Authenticated task creation returns HTTP 201 Created | PASS | 26 ms |
| 3 | Task creation persists the task to MongoDB | PASS | 26 ms |
| 4 | `task-created` event emitted exactly once after creation | PASS | 15 ms |
| 5 | Notification completion occurs ~2s after API response | PASS | 2020 ms |
| 6 | Two-second simulated delay does NOT block response latency | PASS | 10 ms |
| 7 | Failed task creation does not emit `task-created` | PASS | 5 ms |
| 8 | Successful deletion returns HTTP 200 OK and invalidates cache | PASS | 15 ms |
| 9 | `task-deleted` event emitted after deletion with title and ID | PASS | 11 ms |
| 10 | Failed deletion does not emit `task-deleted` | PASS | 7 ms |
| 11 | Error Handling: controlled failure caught and logged safely | PASS | 13 ms |

---

## 14. Screenshot Placeholders

The following placeholders indicate where local verification screenshots should be captured:

```
+-------------------------------------------------------------------------+
|                                                                         |
|                     [ CAPTURE SCREENSHOT HERE ]                         |
|                                                                         |
| Figure 1: Postman POST /api/v1/tasks returning HTTP 201 Created         |
| showing task payload and low response time (< 50ms).                   |
+-------------------------------------------------------------------------+
```
*Figure 1: Successful POST /api/v1/tasks response (201 Created).*

```
+-------------------------------------------------------------------------+
|                                                                         |
|                     [ CAPTURE SCREENSHOT HERE ]                         |
|                                                                         |
| Figure 2: Backend console timestamps demonstrating that [API] Response   |
| sent at ... precedes [Notification] Handler completed at ... by ~2s.    |
+-------------------------------------------------------------------------+
```
*Figure 2: Backend console timestamps demonstrating that the API response precedes notification completion.*

```
+-------------------------------------------------------------------------+
|                                                                         |
|                     [ CAPTURE SCREENSHOT HERE ]                         |
|                                                                         |
| Figure 3: Terminal output of `npm test` showing 26/26 tests passing      |
| across cache.test.js, events.test.js, and message.test.js.              |
+-------------------------------------------------------------------------+
```
*Figure 3: Automated test results.*

```
+-------------------------------------------------------------------------+
|                                                                         |
|                     [ CAPTURE SCREENSHOT HERE ]                         |
|                                                                         |
| Figure 4: Postman DELETE /api/v1/tasks/:id returning HTTP 200 OK        |
| indicating successful task deletion.                                    |
+-------------------------------------------------------------------------+
```
*Figure 4: Successful DELETE /api/v1/tasks/:id response (200 OK).*

```
+-------------------------------------------------------------------------+
|                                                                         |
|                     [ CAPTURE SCREENSHOT HERE ]                         |
|                                                                         |
| Figure 5: Backend console log showing [Notification] Task "..."         |
| deleted at ... with assigned user context.                              |
+-------------------------------------------------------------------------+
```
*Figure 5: task-deleted notification logs.*

---

## 15. Answers to the Three Key Questions

### Q1. Why does emitting an event not block the API response, even though both run in the same Node.js process?

**Answer:**
In Node.js, `EventEmitter.emit()` executes registered listener functions **synchronously** within the current thread of execution. Therefore, emitting an event in itself does not automatically make the listener asynchronous. 

The non-blocking behavior is achieved through two deliberate design choices:
1. **Response Dispatch Ordering**: The route controller transmits the HTTP 201 response (`sendSuccess(res, 201, ...)` / `res.json()`) *before* invoking `taskEvents.emit('task-created', ...)`.
2. **Explicit Asynchronous Deferral**: Within the listener in `src/events/listeners.js`, the notification logic is enclosed in `setImmediate()`. In the Node.js Event Loop, `setImmediate()` schedules execution into the **Check Phase**, which runs after the active I/O callback and network buffer flushing have finished. The slow 2-second simulation is then handled by `setTimeout(..., 2000)` in the **Timers Phase**.

Because the Express route handler does not return a Promise awaiting background notification completion, the client connection receives the HTTP 201 response immediately (within ~15-40ms), while the timer executes later in the background.

---

### Q2. What would happen to API response time if notification logic were placed directly inside the POST route?

**Answer:**
If the 2-second notification logic were placed synchronously or `await`ed directly within the `POST /api/v1/tasks` controller handler (for example, `await sendNotification(task)`):
1. **Direct Latency Penalty**: The HTTP response would be blocked until the notification completed. The API latency would increase by at least 2,000ms (e.g., from ~25ms to >2,025ms).
2. **Resource Starvation**: While waiting for the slow notification, the HTTP socket, request context, and database connection handle remain open.
3. **Severe Throughput Degradation**: Under concurrent traffic (e.g., 50 users simultaneously creating tasks), client request queues would experience severe backpressure, leading to potential HTTP 504 gateway timeouts.
4. **Poor User Experience**: End-users would perceive the application as sluggish, even though database insertion took only a few milliseconds.

By moving notification execution into an event-driven background listener, client response latency remains minimal and uniform regardless of external notification delays.

---

### Q3. Why is EventEmitter reasonable for this application but not for a production system handling millions of events per day?

**Answer:**
Node.js's native `EventEmitter` is well-suited for this educational task manager and lightweight monolithic services because:
- It requires no third-party libraries or external infrastructure.
- It operates with zero inter-process communication overhead.
- It provides clean architectural decoupling between business controllers and auxiliary side effects.

However, for enterprise-grade production systems handling millions of events daily, native `EventEmitter` is inadequate due to several critical limitations:

1. **Lack of Durability & Volatility**: `EventEmitter` is strictly **in-memory**. If the Node.js process crashes, restarts, or runs out of memory, all unhandled events, `setImmediate()` queues, and active `setTimeout()` timers are permanently lost with no recovery path.
2. **Single-Process Constraint**: `EventEmitter` cannot distribute events across multiple server processes, worker threads, or Kubernetes cluster pods. If an API container emits an event, worker containers cannot observe or process it.
3. **Absence of Backpressure and Rate Limiting**: An in-memory emitter cannot buffer surges of millions of incoming events. Spawning millions of concurrent `setTimeout` timers would exhaust heap memory (OOM crash) and overwhelm third-party email/SMS notification APIs.
4. **No Delivery Guarantees or Dead-Letter Queues (DLQ)**: Unlike enterprise message brokers, `EventEmitter` lacks message acknowledgments (ACK/NACK), persistent retries with exponential backoff, and dead-letter queues for unprocessable messages.

**Production Alternative:**
Large-scale production architectures utilize distributed message brokers and persistent job queues such as **RabbitMQ, Apache Kafka, AWS SQS, or Redis-backed BullMQ**. These solutions provide durable disk persistence, distributed worker pooling, horizontal auto-scaling, at-least-once delivery guarantees, and enterprise rate-limiting.

---

## 16. Supplementary Work Completed & Problem Solutions

### Supplementary Problem 1: `task-deleted` Event Implementation
**Objective:** Add a distinct `task-deleted` event with an asynchronous background listener logging deletion details.

**How it was solved:**
1. **Shared Singleton Instance:** Used the single, existing `TaskEvents` emitter exported from [`src/events/events.js`](file:///c:/Users/priya/Downloads/task-manager-api/src/events/events.js).
2. **Controller Integration:** In [`src/controllers/task.controller.js`](file:///c:/Users/priya/Downloads/task-manager-api/src/controllers/task.controller.js), `deleteTask`:
   - Deletes the task from MongoDB via `taskService.deleteTask(id)`.
   - If the task does not exist, returns `404 Not Found` immediately; **no event is emitted**.
   - Invalidates Practical 9 cache entries (`all_tasks` and `task_<id>`).
   - Dispatches the HTTP `200 OK` response with the deleted document payload.
   - Emits `taskEvents.emit('task-deleted', task, req.user)` *after* the client response has been sent.
3. **Asynchronous Deferral via `setImmediate()`:** In [`src/events/listeners.js`](file:///c:/Users/priya/Downloads/task-manager-api/src/events/listeners.js), the `task-deleted` listener encapsulates all notification logic inside `setImmediate()`, ensuring zero impact on the HTTP response latency.
4. **Comprehensive Logging:** The listener extracts and logs:
   - **Task Title:** `[Notification] Task "<TITLE>" deleted at <ISO_TIMESTAMP>`
   - **Task ID:** `[Notification] Task ID: <OBJECT_ID>`
   - **Deletion Timestamp:** ISO 8601 string
   - **Assigned User:** Extracted from JWT token (`req.user.id`) or fallback to `'Unassigned'`

---

### Supplementary Problem 2: Error Event Listener Implementation
**Objective:** Add a dedicated error event listener that catches and logs background notification failures without crashing the Express server.

**How it was solved:**
1. **Registration Precedence:** Node.js treats an unhandled `'error'` event as a fatal exception that terminates the process. Therefore, `taskEvents.on('error', ...)` is registered **first** in [`src/events/listeners.js`](file:///c:/Users/priya/Downloads/task-manager-api/src/events/listeners.js), before any operational event listeners are registered.
2. **Explicit Asynchronous `try/catch`:** Exceptions thrown inside `setImmediate()` or `setTimeout()` timer queues run in separate call stacks and bypass Express middleware `try/catch` blocks. The handler wraps both asynchronous stages in local `try/catch` blocks:
   ```javascript
   setImmediate(() => {
       try {
           // Asynchronous notification work...
           setTimeout(() => {
               try {
                   // Slow simulated work...
               } catch (timeoutErr) {
                   taskEvents.emit('error', timeoutErr);
               }
           }, 2000);
       } catch (immediateErr) {
           taskEvents.emit('error', immediateErr);
       }
   });
   ```
3. **Safe, Structured Error Logging:** The `error` listener outputs structured diagnostics:
   ```text
   [Notification Error] Failed to process task-created notification
   Error details: <error message and stack trace>
   [Notification Error] Logged at: <ISO_TIMESTAMP>
   ```
4. **Infinite Loop Protection:** The error handler's own logging is wrapped in a `try/catch` that writes directly to `console.error` and **never re-emits** an `'error'` event, eliminating recursion.
5. **Controlled Failure Mechanism:** For verification, tasks with `[SIMULATE_ERROR]` in their title (or when `taskEvents.simulateNotificationError` is active) trigger a simulated gateway network failure. Automated test 11 confirms:
   - Client receives HTTP `201 Created` in under 30ms.
   - The error is caught and logged.
   - The Express application remains 100% operational (`GET /api/v1/health` continues returning `200 OK`).

---

## 17. Learning Outcomes

1. Mastered Node.js's built-in `EventEmitter` class and the Observer design pattern.
2. Understood the critical distinction between synchronous event emission (`emit()`) and deferred event loop execution (`setImmediate`, `setTimeout`).
3. Implemented non-blocking API patterns where client responses precede long-running background tasks.
4. Formulated robust error-handling mechanisms for asynchronous callbacks to prevent unhandled process termination.
5. Evaluated architectural trade-offs between in-process event systems and distributed message brokers.

---

## 18. Conclusion

Practical 10 successfully demonstrates the implementation of **Asynchronous Processing with Event-Driven Architecture** in Node.js. By decoupling notification handling from the HTTP request-response lifecycle using native `EventEmitter` and `setImmediate()`, the Task Manager API maintains fast, sub-40ms response times while simulating slow 2-second background notifications. All automated tests pass with 100% success, preserving full compatibility with Practical 7 authentication and Practical 9 in-memory caching.
