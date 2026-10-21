const { describe, it, before, after, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = require("../src/app");
const Task = require("../src/models/Task");
const taskEvents = require("../src/events/events");

const JWT_SECRET = process.env.JWT_SECRET || "task_manager_practical7_secret_2026";
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/task_manager";

describe("Practical 10 — Event-Driven Architecture & Asynchronous Notification Processing", () => {
    let server;
    let baseUrl;
    let authToken;
    const cleanupTaskIds = [];

    before(async () => {
        // Connect to MongoDB
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(MONGO_URI);
        }

        // Start server on an ephemeral port
        await new Promise((resolve) => {
            server = app.listen(0, () => {
                const port = server.address().port;
                baseUrl = `http://127.0.0.1:${port}/api/v1`;
                resolve();
            });
        });

        // Generate test JWT token
        authToken = jwt.sign(
            { id: "test_user_p10", email: "p10_tester@example.com" },
            JWT_SECRET,
            { expiresIn: "1h" }
        );
    });

    after(async () => {
        // Clean up any tasks created during tests
        if (cleanupTaskIds.length > 0) {
            await Task.deleteMany({ _id: { $in: cleanupTaskIds } });
        }

        // Close server and database connection
        if (server) {
            await new Promise((resolve) => server.close(resolve));
        }
        await mongoose.connection.close();
    });

    // 1. Unauthenticated task creation is rejected
    it("1. Security: unauthenticated task creation should be rejected with 401", async () => {
        const res = await fetch(`${baseUrl}/tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: "Unauthorized Task",
                description: "Should fail authentication"
            })
        });
        const json = await res.json();

        assert.equal(res.status, 401);
        assert.equal(json.success, false);
        assert.match(json.message, /Authentication token required/i);
    });

    // 2. Authenticated task creation returns HTTP 201
    it("2. Task Creation: authenticated request returns HTTP 201 Created with standardized payload", async () => {
        const payload = {
            title: "Practical 10 Task 2 - " + Date.now(),
            description: "Testing HTTP 201 response format",
            priority: "high"
        };

        const res = await fetch(`${baseUrl}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify(payload)
        });
        const json = await res.json();

        assert.equal(res.status, 201);
        assert.equal(json.success, true);
        assert.equal(json.message, "Task created successfully");
        assert.ok(json.data._id);
        assert.equal(json.data.title, payload.title);
        cleanupTaskIds.push(json.data._id);
    });

    // 3. Task creation persists the task to MongoDB
    it("3. Persistence: task creation persists the task in MongoDB", async () => {
        const payload = {
            title: "Database Persistence Test - " + Date.now(),
            description: "Verifying document exists in MongoDB collection",
            priority: "medium"
        };

        const res = await fetch(`${baseUrl}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify(payload)
        });
        const json = await res.json();
        cleanupTaskIds.push(json.data._id);

        // Direct query to MongoDB to verify persistence
        const dbRecord = await Task.findById(json.data._id);
        assert.ok(dbRecord, "Task document must exist in MongoDB");
        assert.equal(dbRecord.title, payload.title);
        assert.equal(dbRecord.priority, "medium");
        assert.equal(dbRecord.completed, false);
    });

    // 4. task-created is emitted exactly once after successful creation
    it("4. Event Emission: task-created event is emitted exactly once after successful creation", async () => {
        let emitCount = 0;
        let capturedTask = null;
        let capturedUser = null;

        const onTaskCreated = (task, user) => {
            emitCount++;
            capturedTask = task;
            capturedUser = user;
        };

        taskEvents.on("task-created", onTaskCreated);

        const payload = {
            title: "EventEmitter Test Task - " + Date.now(),
            description: "Testing single event emission",
            priority: "low"
        };

        const res = await fetch(`${baseUrl}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify(payload)
        });
        const json = await res.json();
        cleanupTaskIds.push(json.data._id);

        taskEvents.removeListener("task-created", onTaskCreated);

        assert.equal(res.status, 201);
        assert.equal(emitCount, 1, "task-created must be emitted exactly once");
        assert.equal(capturedTask.title, payload.title);
        assert.equal(capturedUser.id, "test_user_p10");
    });

    // 5. Notification completion occurs after the API response
    it("5. Response Ordering: notification completion occurs approximately 2 seconds after the API response", async () => {
        let responseReceivedTime = 0;
        let notificationCompletedTime = 0;

        // Set up listener for notification completion specifically for this task
        const completionPromise = new Promise((resolve) => {
            const onComplete = (info) => {
                if (info && info.task && info.task.title === payload.title) {
                    notificationCompletedTime = Date.now();
                    taskEvents.removeListener("notification-completed", onComplete);
                    resolve(info);
                }
            };
            taskEvents.on("notification-completed", onComplete);
        });

        const payload = {
            title: "Async Notification Timing Test - " + Date.now(),
            description: "Testing response-before-notification completion order",
            priority: "high"
        };

        const res = await fetch(`${baseUrl}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify(payload)
        });
        const json = await res.json();
        responseReceivedTime = Date.now();
        cleanupTaskIds.push(json.data._id);

        assert.equal(res.status, 201);

        // Wait for the background 2-second notification to complete
        const info = await completionPromise;

        assert.ok(notificationCompletedTime > responseReceivedTime, "Notification completion must occur AFTER API response");
        const delayMs = notificationCompletedTime - responseReceivedTime;
        // Verify that notification completion took approximately 2 seconds (allow margin: >= 1800ms)
        assert.ok(delayMs >= 1800, `Expected delay >= 1800ms, actual delay: ${delayMs}ms`);
        assert.equal(info.task.title, payload.title);
        assert.equal(info.assignedUser, "test_user_p10");
    });

    // 6. The two-second simulated delay does not block the response
    it("6. Non-Blocking: two-second simulated delay does NOT block the HTTP response latency", async () => {
        const payload = {
            title: "Fast Response Benchmark Task - " + Date.now(),
            description: "Validating sub-500ms response time despite 2s simulated work",
            priority: "medium"
        };

        const startTime = Date.now();
        const res = await fetch(`${baseUrl}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify(payload)
        });
        const responseLatencyMs = Date.now() - startTime;
        const json = await res.json();
        cleanupTaskIds.push(json.data._id);

        assert.equal(res.status, 201);
        // Response time must be well under 800ms (typically 15-50ms), far below the 2000ms notification delay
        assert.ok(
            responseLatencyMs < 800,
            `Expected HTTP response < 800ms, received in ${responseLatencyMs}ms (delay was non-blocking)`
        );
    });

    // 7. Failed task creation does not emit task-created
    it("7. Negative Case: failed task creation does not emit task-created event", async () => {
        let eventFired = false;
        const onTaskCreated = () => {
            eventFired = true;
        };

        taskEvents.on("task-created", onTaskCreated);

        // Submit invalid payload missing required title
        const res = await fetch(`${baseUrl}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify({
                description: "Task without title"
            })
        });
        const json = await res.json();

        taskEvents.removeListener("task-created", onTaskCreated);

        assert.equal(res.status, 400);
        assert.equal(json.success, false);
        assert.equal(eventFired, false, "task-created must NOT be emitted for failed validation or creation");
    });

    // 8. Successful deletion returns the expected response
    it("8. Deletion: successful deletion returns HTTP 200 and standard response", async () => {
        // Create task directly in DB
        const taskToDelete = await Task.create({
            title: "Task for Deletion Test - " + Date.now(),
            priority: "low"
        });

        const res = await fetch(`${baseUrl}/tasks/${taskToDelete._id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${authToken}` }
        });
        const json = await res.json();

        assert.equal(res.status, 200);
        assert.equal(json.success, true);
        assert.equal(json.message, "Task deleted successfully");
        assert.equal(json.data._id, taskToDelete._id.toString());

        // Verify removed from MongoDB
        const check = await Task.findById(taskToDelete._id);
        assert.equal(check, null);
    });

    // 9. task-deleted is emitted after successful deletion
    it("9. Event Emission: task-deleted is emitted after successful deletion", async () => {
        const taskToDelete = await Task.create({
            title: "Task to Verify Deletion Event - " + Date.now(),
            priority: "medium"
        });

        const deletionPromise = new Promise((resolve) => {
            taskEvents.once("task-deleted-processed", (data) => {
                resolve(data);
            });
        });

        const res = await fetch(`${baseUrl}/tasks/${taskToDelete._id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${authToken}` }
        });
        const json = await res.json();

        assert.equal(res.status, 200);
        const data = await deletionPromise;
        assert.equal(data.task.title, taskToDelete.title);
        assert.equal(data.assignedUser, "test_user_p10");
    });

    // 10. Failed deletion does not emit task-deleted
    it("10. Negative Case: failed deletion does not emit task-deleted event", async () => {
        let deleteEventFired = false;
        const onDelete = () => {
            deleteEventFired = true;
        };

        taskEvents.on("task-deleted", onDelete);

        // Attempt deleting a non-existent ObjectId
        const nonExistentId = new mongoose.Types.ObjectId().toString();
        const res = await fetch(`${baseUrl}/tasks/${nonExistentId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${authToken}` }
        });
        const json = await res.json();

        taskEvents.removeListener("task-deleted", onDelete);

        assert.equal(res.status, 404);
        assert.equal(json.success, false);
        assert.equal(deleteEventFired, false, "task-deleted must NOT be emitted when task does not exist");
    });
});
