# Practical 10: Asynchronous Processing with Event-Driven Architecture

## 1. Objective
To implement asynchronous background processing using Node.js native `EventEmitter` without introducing external dependencies. This decoupling strategy moves long-running tasks outside the main request-response flow.

## 2. Problem Statement
When a user creates a new task, we need to send a notification (simulated with a delay). If this notification logic is placed synchronously within the API controller, the HTTP response to the client is delayed, negatively impacting performance and user experience.

## 3. Existing Architecture
Previously, the `POST /tasks` and `DELETE /tasks/:id` endpoints executed all logic synchronously before sending an HTTP response to the user.

## 4. Event-Driven Architecture
We introduced an Event-Driven Architecture where the API immediately responds to the user upon a successful database operation. It then emits a background event which is handled by an isolated listener that processes long-running or non-critical tasks without blocking.

## 5. EventEmitter Explanation
The Node.js `EventEmitter` provides a simple observer pattern. An emitter emits named events that cause corresponding listeners to be called. By combining it with scheduling functions like `setImmediate`, we can offload background operations from the primary request lifecycle.

## 6. task-created Event
Upon a successful `POST /tasks` execution, a `task-created` event is emitted. The event carries the newly created task's data and user context. 

## 7. task-deleted Event
Upon a successful `DELETE /tasks/:id` execution, a `task-deleted` event is emitted, initiating cleanup or background notification hooks.

## 8. Notification Listener
A dedicated module `src/events/listeners.js` contains listeners that intercept the `task-created` and `task-deleted` events. The listener's responsibility is executing side-effects, such as simulating notifications.

## 9. Asynchronous Deferral
`EventEmitter.emit()` operates synchronously in Node.js. To prevent blocking the API response, we encapsulate the notification listener logic inside `setImmediate()`. This defers the background processing to a subsequent phase of the Event Loop, allowing the HTTP response to complete first.

## 10. Artificial 2-second Delay
A simulated long-running task is implemented with `setTimeout` (2000ms delay) within the listener. This visualizes that the 2-second delay doesn't affect the HTTP response time.

## 11. Error Event Listener
An `error` listener intercepts execution failures during event processing. This ensures that a background exception does not bring down the entire Express server.

## 12. API Flow

```mermaid
graph TD;
    A[POST /tasks] --> B[Validate + Authenticate];
    B --> C[Save task to MongoDB];
    C --> D[Send HTTP 201 response];
    D --> E[emit('task-created')];
    E --> F[Event listener];
    F --> G[setImmediate];
    G --> H[Notification handler];
    H --> I[2-second simulated work];
    I --> J[Completion log];
```

## 13. Console Timestamp Evidence
```
[API] Task created at: 2026-10-04T13:58:24.120Z
[API] Response sent at: 2026-10-04T13:58:24.122Z
[Event] task-created emitted at: 2026-10-04T13:58:24.124Z
[Notification] Handler scheduled at: 2026-10-04T13:58:24.125Z
[Notification] Handler started at: 2026-10-04T13:58:24.126Z
[Notification] Task "Buy Groceries" assigned to user "Unassigned"
[Notification] Handler completed at: 2026-10-04T13:58:26.130Z
```

*(This demonstrates the HTTP response completed roughly 2 seconds before the notification handler completed.)*

## 14. Testing Procedure
1. Create a task via API to trigger `task-created`.
2. Review server logs for exact timestamps confirming the non-blocking response.
3. Delete the task via API to trigger `task-deleted`.
4. Ensure standard API tests continue passing via `npm test`.

## 15. Test Results
All automated unit and integration tests successfully pass, including existing validation, caching, and authentication tests. 

## 16. Key Questions

**Q1. Why does emitting an event not block the API response, even though both run on the same Node.js process?**
`EventEmitter.emit()` natively invokes listeners synchronously. However, the listener is specifically designed using `setImmediate()`, which pushes the background execution into the next iteration of the Event Loop. Because the HTTP response is dispatched before this deferred logic runs, the client doesn't experience blocking delays.

**Q2. What would happen to API response time if notification logic were placed directly inside the POST route instead of in an event handler?**
If placed synchronously inside the API route controller, the server will process the notification workload before concluding the request. In our case, the 2-second simulation would force the HTTP response to take an additional 2 seconds to reach the client.

**Q3. Why is EventEmitter reasonable for this scale of application, but not for a production system handling millions of events per day?**
`EventEmitter` is memory-bound to a single process. It is easily wiped if the node process crashes (meaning queued jobs are lost). For highly concurrent distributed applications, durable job queues like RabbitMQ or Kafka are preferred for guaranteed delivery, resilience, and retry mechanisms.

## 17. Supplementary Work
Included `task-deleted` events and a robust `error` event listener.

## 18. Limitations
- Background work resides in memory. Process restarts lose incomplete tasks.
- Difficult to scale beyond a single Node.js instance.

## 19. Learning Outcomes
- Understanding Node.js core `EventEmitter`.
- Implementing non-blocking architecture using `setImmediate()`.
- Analyzing asynchronous execution boundaries in Javascript.
