# Practical 9: In-Memory Caching and Query Optimization

## Student Details

- **Student Name:** Priyanshi Gajiwala
- **Enrollment No.:** 24IT019
- **Course:** Advanced Web Development Frameworks
- **Course Code:** ITUE301
- **Practical:** 9 — In-Memory Caching and Query Optimization

---

## 1. Objective

The objective of Practical 9 is to design, implement, and measure the performance impact of server-side in-memory caching in the Task Manager REST API using `node-cache`. By intercepting repeated read queries (`GET /api/v1/tasks` and `GET /api/v1/tasks/:id`) in the Node.js application process memory, database round-trips to MongoDB are eliminated for subsequent requests, reducing response latency and server workload while guaranteeing data integrity through automatic cache invalidation on write operations (`POST`, `PUT`, `DELETE`).

---

## 2. Problem Statement

In standard client-server database architectures:
1. **Redundant I/O Overhead:** Every read request (`GET /api/v1/tasks`) typically initiates an I/O network transfer, deserialization, and index scan on MongoDB, even if the underlying dataset has not changed since the last request.
2. **Database Bottlenecks Under High Concurrency:** Under heavy concurrent user load, repetitive read queries saturate database connection pools and degrade system throughput.
3. **Stale Data Risks:** Introducing naive caching without strict invalidation causes data inconsistency where clients observe stale, outdated records after updates or deletions.

Practical 9 solves these challenges by establishing an in-memory cache layer directly in the Node.js runtime with strict post-write invalidation guarantees.

---

## 3. Architecture & Request Flow

The caching layer is encapsulated within the service and configuration layers of the existing layered architecture, maintaining complete separation of concerns and preserving all existing API response contracts and JWT authentication middleware pipelines.

### Request Flow Diagram

```text
                                Client Request
                                      │
                                      ▼
                        ┌───────────────────────────┐
                        │   JWT Auth Middleware     │ (Verify token & req.user)
                        └─────────────┬─────────────┘
                                      │
                                      ▼
                        ┌───────────────────────────┐
                        │      Task Controller      │ (getTasks / getTaskById)
                        └─────────────┬─────────────┘
                                      │
                                      ▼
                        ┌───────────────────────────┐
                        │       Task Service        │
                        └─────────────┬─────────────┘
                                      │
                         Check In-Memory Cache (node-cache)
                                     / \
                                    /   \
                           HIT     /     \     MISS
                                  /       \
                                 ▼         ▼
                      ┌──────────────┐   ┌───────────────────────┐
                      │ Return Cache │   │ Query MongoDB (Mongoose)│
                      │ Data Direct  │   └───────────┬───────────┘
                      └──────────────┘               │
                                                     ▼
                                         ┌───────────────────────┐
                                         │ Store in Cache (TTL)  │
                                         └───────────┬───────────┘
                                                     │
                                                     ▼
                                         ┌───────────────────────┐
                                         │  Return Fresh Data    │
                                         └───────────────────────┘
```

---

## 4. Why Caching is Useful

1. **Ultra-Low Latency:** In-memory lookups operate at RAM speed (nanoseconds to low single-digit microseconds) compared to disk and TCP network queries to MongoDB (milliseconds).
2. **Reduced Database Server Load:** Shielding MongoDB from redundant queries frees database connections and CPU cycles for essential write transactions.
3. **Enhanced Scalability:** Applications can serve significantly higher requests per second (RPS) on read-heavy workloads without scaling up database hardware.
4. **Bandwidth & Serialization Savings:** Pre-parsed objects stored in memory avoid repetitive database wire-protocol parsing and mapping.

---

## 5. `node-cache` Implementation

`node-cache` is a lightweight, zero-dependency in-memory caching engine for Node.js applications that stores key-value pairs in the V8 heap.

In `src/config/cache.js`:
- Standard TTL is set to **60 seconds** (configurable via environment variable `CACHE_TTL`).
- Automatic eviction background check period is configured as `checkperiod: ttl * 0.2` (every 12 seconds).
- Hit and miss counters (`cacheHits`, `cacheMisses`) are maintained in memory to provide real-time observability.
- Development-friendly logging prints `[Cache] HIT`, `[Cache] MISS`, `[Cache] SET`, and `[Cache] INVALIDATED`.
- Graceful exception handling ensures that any unexpected cache failure falls back seamlessly to MongoDB queries without crashing the API.

---

## 6. Cache Key Design

Following inspection of the application's Mongoose `Task` model ([src/models/Task.js](../src/models/Task.js)), tasks are globally shared across authenticated users (no per-user owner ID field exists on the task schema). Therefore, stable and predictable cache keys are utilized:

| Resource | Cache Key Pattern | Example |
|---|---|---|
| All Tasks Collection | `all_tasks` | `all_tasks` |
| Individual Task by ID | `task_${taskId}` | `task_6ab316df7c84ebeb1edfa233` |

> **Security Note:** If tasks were scoped per user, the key design would include the user's ID (e.g., `all_tasks_${userId}` and `task_${userId}_${taskId}`). The architecture implemented allows easy prefix adaptation if user tenancy is introduced in future iterations.

---

## 7. TTL (Time-To-Live) Configuration

- **Configured TTL:** `60 seconds`
- **Environment Variable:** `CACHE_TTL=60` in `.env` and `.env.example`
- **Trade-off Analysis:**
  - **Shorter TTL (e.g., 5–15 seconds):** Guarantees fresher data and minimizes window of divergence if external direct DB mutations occur, but results in fewer cache hits and increased database load.
  - **Longer TTL (e.g., 300+ seconds):** Yields higher hit ratios and maximal query reduction, but increases memory footprint and the risk of serving stale data if cache invalidation events fail or are bypassed.
  - **Selected 60s TTL:** Provides an optimal balance for a collaborative task management system, offering high read performance while bounding any edge-case discrepancy to 1 minute.

---

## 8. Cache HIT and MISS Flow

### Cache MISS Flow (Cold Cache or Post-Invalidation)
1. Client sends `GET /api/v1/tasks`.
2. Auth middleware verifies JWT token.
3. Controller delegates to `taskService.getAllTasks()`.
4. Service queries `cache.get("all_tasks")`.
5. Key does not exist (`undefined`):
   - `cacheMisses` counter increments.
   - Console logs: `[Cache] MISS: all_tasks`.
6. Service queries MongoDB: `await Task.find()`.
7. Service stores retrieved tasks in cache: `cache.set("all_tasks", tasks)`.
8. Console logs: `[Cache] SET: all_tasks`.
9. Controller formats response via `sendSuccess(res, 200, "Tasks fetched successfully", tasks)`.

### Cache HIT Flow (Warm Cache)
1. Client sends subsequent `GET /api/v1/tasks` (within 60 seconds).
2. Auth middleware verifies JWT token.
3. Controller delegates to `taskService.getAllTasks()`.
4. Service queries `cache.get("all_tasks")`.
5. Value is found in memory:
   - `cacheHits` counter increments.
   - Console logs: `[Cache] HIT: all_tasks`.
6. MongoDB query is completely bypassed.
7. Controller formats and immediately returns cached data with exact standard response structure.

---

## 9. Cache Invalidation Strategy

To prevent stale data, write operations strictly invalidate relevant cache entries **only after successful database persistence**:

| Operation | Endpoint | Cache Invalidation Target | Rationale |
|---|---|---|---|
| **Create Task** | `POST /api/v1/tasks` | `cache.del("all_tasks")` | New task must appear in the task list on next fetch. |
| **Update Task** | `PUT /api/v1/tasks/:id` | `cache.del("all_tasks")`<br>`cache.del("task_" + id)` | List view and single-task view must reflect updated fields. |
| **Delete Task** | `DELETE /api/v1/tasks/:id` | `cache.del("all_tasks")`<br>`cache.del("task_" + id)` | Deleted task must not be returned in list or direct lookup. |

### Failure Safety Guarantee
Write operations follow the atomic execution sequence:
```javascript
const task = await Task.findByIdAndUpdate(id, updateData, { ... });
// Invalidation executes ONLY if database operation succeeded
if (task) {
    cache.del("all_tasks");
    cache.del(`task_${id}`);
}
```
If MongoDB throws an exception (e.g., validation failure, connection drop), execution jumps immediately to the global error middleware, ensuring the cache is **never** corrupted or prematurely invalidated on failed writes.

---

## 10. Supplementary Endpoints & Debugging

### A. Cache Statistics Endpoint (`GET /api/v1/cache/stats`)
Allows developers and evaluators to inspect cache hit and miss counters in real time.

**Request:**
```http
GET /api/v1/cache/stats
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Cache statistics fetched successfully",
  "data": {
    "hits": 3,
    "misses": 1
  }
}
```

### B. Cache Clear Debug Endpoint (`DELETE /api/v1/cache`)
Flushes the in-memory cache on demand, allowing testers to reset the cache state without restarting the Node.js server.

**Request:**
```http
DELETE /api/v1/cache
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Task cache cleared successfully",
  "data": null
}
```

---

## 11. Response Time Measurement Procedure

To obtain realistic and fair performance benchmarks between uncached and cached database queries, follow this testing procedure using Postman, Thunder Client, or cURL.

### Phase 1: Uncached Measurement (Database Queries)
1. Open Postman or Thunder Client.
2. Ensure MongoDB is running and tasks exist in the database.
3. Clear the cache before each uncached run using `DELETE /api/v1/cache` (or observe the initial cold request `[Cache] MISS: all_tasks`).
4. Execute `GET /api/v1/tasks` with `Authorization: Bearer <JWT_TOKEN>`.
5. Note the response time displayed in the client interface (e.g., `18 ms`).
6. Repeat with cache cleared for 3 total cold iterations and record the timings.

### Phase 2: Cached Measurement (In-Memory Lookups)
1. Send an initial `GET /api/v1/tasks` to warm the cache (observe `[Cache] SET: all_tasks`).
2. Without invalidating or writing new tasks, send 3 consecutive `GET /api/v1/tasks` requests.
3. Observe the console log displaying `[Cache] HIT: all_tasks`.
4. Record the response time for each of the 3 cache hit requests.

---

## 12. Response Time Comparison Table

> **Testing Note:** Response times below were measured via HTTP client benchmarking on localhost against the MongoDB instance and `node-cache` memory store.

| Test Run | Uncached (MongoDB Query) | Cached (In-Memory Lookups) | Latency Difference |
|---|---:|---:|---:|
| **Request 1** | `48.6 ms` | `8.3 ms` | `40.3 ms` |
| **Request 2** | `14.5 ms` | `7.4 ms` | `7.1 ms` |
| **Request 3** | `13.5 ms` | `9.4 ms` | `4.1 ms` |

### Summary Statistics
- **Average Uncached Latency:** `25.5 ms`
- **Average Cached Latency:** `8.4 ms`
- **Measured Latency Reduction / Improvement:** `67.2 %`

---

## 13. Factors Influencing Measured Response Times

When evaluating response times on local development machines, performance differences may range from small to substantial depending on:
1. **Dataset Size:** Small collections (e.g., 5–10 records) fit within MongoDB's wiredTiger memory cache, making local uncached reads fast (~10–25ms). With tens of thousands of records, caching yields dramatic speedups.
2. **Local Loopback Latency:** On `127.0.0.1`, network transit latency is sub-millisecond, whereas in cloud deployments (e.g., AWS EC2 to MongoDB Atlas), network round-trip time (RTT) adds 15–80ms per uncached query.
3. **Query Complexity:** Queries with multi-field indexes, sorting, filtering, or aggregations have higher computational overhead in MongoDB, widening the performance gap between cached and uncached lookups.
4. **Server Hardware & Load:** CPU frequency, available RAM, and concurrent background processes influence Express event loop dispatch timing.

---

## 14. Key Questions & Conceptual Analysis

### Q1. Why must the cache be invalidated on every write operation?
**Answer:**
If the cache is not invalidated upon write operations (`POST`, `PUT`, `DELETE`), the in-memory cache continues serving the snapshot captured prior to the modification until its 60-second TTL expires. This creates a data inconsistency window where clients receive stale tasks, newly added tasks do not appear, and deleted tasks remain visible. Invalidating the cache immediately after successful database persistence ensures that the very next read triggers a fresh database query and stores the up-to-date state.

### Q2. What is a reasonable TTL for task management data?
**Answer:**
A reasonable TTL for task management data typically falls between **30 to 120 seconds** (with 60 seconds selected for this implementation). The trade-off is governed by:
- **Shorter TTL:** Guarantees fresher data and self-healing if direct database modifications occur outside the API, but produces a lower cache hit ratio and higher database query load.
- **Longer TTL:** Maximizes cache hit ratio and offloads database traffic, but risks prolonging stale reads if an invalidation event fails.
In write-invalidated architectures, a 60-second TTL acts as a secondary safety net rather than the primary consistency mechanism.

### Q3. Why is `node-cache` unsuitable for multi-server / multi-instance deployment?
**Answer:**
`node-cache` stores key-value pairs in the private V8 heap memory of a single Node.js operating system process. In a scaled-out production environment (e.g., multiple Node instances behind an Nginx load balancer or running in Kubernetes pods):
1. **Cache Isolation:** Each server instance possesses its own independent cache partition.
2. **Inconsistent Invalidation:** When an update request is routed to Server A, only Server A's local cache is invalidated. Subsequent read requests routed by the load balancer to Server B or Server C will continue serving stale data.
3. **Distributed Solution:** For multi-instance architectures, a distributed centralized cache store such as **Redis** or **Memcached** must be employed so that all application instances read from and invalidate a unified cache source.

---

## 15. Automated Test Suite Evidence

Automated tests for caching were executed using Node.js's native test runner (`node --test tests/cache.test.js`). All 10 test specifications passed with zero failures:

```text
> task-manager-api@1.0.0 test
> node --test tests/cache.test.js

TAP version 13
# Subtest: Practical 9 — In-Memory Caching & Debug API Suite
    ok 1 - H. Authentication: should reject unauthenticated request to /tasks with 401
    ok 2 - H. Authentication: should reject request with invalid Bearer token with 401
    ok 3 - A. GET /tasks with empty cache: should query database, return data, and record MISS
    ok 4 - B. GET /tasks subsequent request: should serve from cache and record HIT
    ok 5 - C. POST /tasks: should create a task and invalidate 'all_tasks' cache
    ok 6 - F. GET /tasks/:id: first request = MISS, second request = HIT
    ok 7 - D. PUT /tasks/:id: should update task and invalidate both 'all_tasks' and task cache
    ok 8 - E. DELETE /tasks/:id: should delete task and invalidate both 'all_tasks' and task cache
    ok 9 - G. Cache Stats: GET /api/v1/cache/stats should return hits and misses
    ok 10 - Debug: DELETE /api/v1/cache should clear the cache
1..10
# tests 10
# suites 1
# pass 10
# fail 0
# cancelled 0
# skipped 0
# todo 0
```

---

## 16. Verification & Testing Checklist

- [x] Installed `node-cache` via npm (`"node-cache": "^5.1.2"`).
- [x] Created shared cache module at `src/config/cache.js`.
- [x] Configured 60-second default TTL via `CACHE_TTL=60` in `.env.example` and `.env`.
- [x] Implemented `GET /api/v1/tasks` in-memory caching under stable key `'all_tasks'`.
- [x] Implemented single-task caching `GET /api/v1/tasks/:id` under key `'task_${taskId}'`.
- [x] Guaranteed cache invalidation on write operations (`POST`, `PUT`, `DELETE`).
- [x] Invalidation executes strictly after successful MongoDB operations.
- [x] Added real-time hit and miss counters with console logging.
- [x] Created debug statistics endpoint `GET /api/v1/cache/stats`.
- [x] Created cache flush endpoint `DELETE /api/v1/cache`.
- [x] Preserved existing standard JSON API response structure (`{ success, message, data }`).
- [x] Preserved JWT authentication pipeline on all task routes.
- [x] All 10 automated test suites passing (`npm test`).
- [x] Frontend build verified with zero errors (`npm run build` in `frontend/`).
- [x] Clean Git working tree prepared for dedicated commit.

---

## 17. Learning Outcomes

By completing Practical 9, the student has demonstrated:
1. Deep understanding of in-memory caching principles, cache lookup workflows, and database query offloading.
2. Proficiency with `node-cache` lifecycle management, TTL configuration, and eviction mechanics.
3. Implementation of reliable cache invalidation patterns tied to database write lifecycles.
4. Observability instrumentation through cache hit/miss accounting and debug REST endpoints.
5. Critical architectural evaluation of single-process caching versus distributed caching solutions like Redis.
6. Rigorous automated API testing using Node.js's native test runner.
