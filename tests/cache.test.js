const { describe, it, before, after, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = require("../src/app");
const cache = require("../src/config/cache");
const Task = require("../src/models/Task");

const JWT_SECRET = process.env.JWT_SECRET || "task_manager_practical7_secret_2026";
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/task_manager";

describe("Practical 9 — In-Memory Caching & Debug API Suite", () => {
    let server;
    let baseUrl;
    let authToken;
    let createdTaskId;

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
            { id: "test_user_p9", email: "p9_tester@example.com" },
            JWT_SECRET,
            { expiresIn: "1h" }
        );
    });

    after(async () => {
        // Clean up created task if any
        if (createdTaskId) {
            await Task.findByIdAndDelete(createdTaskId);
        }

        // Close server and database connection
        if (server) {
            await new Promise((resolve) => server.close(resolve));
        }
        await mongoose.connection.close();
    });

    beforeEach(() => {
        // Flush cache and reset hit/miss counters before tests where needed
    });

    // Test H: Authentication Still Works
    it("H. Authentication: should reject unauthenticated request to /tasks with 401", async () => {
        const res = await fetch(`${baseUrl}/tasks`);
        const json = await res.json();

        assert.equal(res.status, 401);
        assert.equal(json.success, false);
        assert.match(json.message, /Authentication token required/i);
    });

    it("H. Authentication: should reject request with invalid Bearer token with 401", async () => {
        const res = await fetch(`${baseUrl}/tasks`, {
            headers: { Authorization: "Bearer invalid_token_12345" }
        });
        const json = await res.json();

        assert.equal(res.status, 401);
        assert.equal(json.success, false);
        assert.match(json.message, /Invalid or expired token/i);
    });

    // Test A & B: GET /tasks MISS and HIT
    it("A. GET /tasks with empty cache: should query database, return data, and record MISS", async () => {
        cache.flush();
        cache.resetStats();

        const res = await fetch(`${baseUrl}/tasks`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        const json = await res.json();

        assert.equal(res.status, 200);
        assert.equal(json.success, true);
        assert.equal(json.message, "Tasks fetched successfully");
        assert.ok(Array.isArray(json.data));

        const stats = cache.getStats();
        assert.equal(stats.misses, 1);
        assert.equal(stats.hits, 0);
    });

    it("B. GET /tasks subsequent request: should serve from cache and record HIT", async () => {
        const statsBefore = cache.getStats();

        const res = await fetch(`${baseUrl}/tasks`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        const json = await res.json();

        assert.equal(res.status, 200);
        assert.equal(json.success, true);
        assert.ok(Array.isArray(json.data));

        const statsAfter = cache.getStats();
        assert.equal(statsAfter.hits, statsBefore.hits + 1);
        assert.equal(statsAfter.misses, statsBefore.misses);
    });

    // Test C: POST /tasks invalidates all_tasks
    it("C. POST /tasks: should create a task and invalidate 'all_tasks' cache", async () => {
        // Ensure cache is populated first
        await fetch(`${baseUrl}/tasks`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        assert.ok(cache.raw.get("all_tasks") !== undefined);

        const newTaskPayload = {
            title: "Practical 9 Test Task - " + Date.now(),
            description: "Testing automated cache invalidation on write",
            priority: "high"
        };

        const res = await fetch(`${baseUrl}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify(newTaskPayload)
        });
        const json = await res.json();

        assert.equal(res.status, 201);
        assert.equal(json.success, true);
        assert.ok(json.data._id);
        createdTaskId = json.data._id;

        // Verify all_tasks key was invalidated
        assert.equal(cache.raw.get("all_tasks"), undefined);

        // Next GET /tasks should be a MISS
        const statsBefore = cache.getStats();
        await fetch(`${baseUrl}/tasks`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        const statsAfter = cache.getStats();
        assert.equal(statsAfter.misses, statsBefore.misses + 1);
    });

    // Test F: GET /tasks/:id (MISS then HIT)
    it("F. GET /tasks/:id: first request = MISS, second request = HIT", async () => {
        assert.ok(createdTaskId, "createdTaskId must exist");
        cache.del(`task_${createdTaskId}`);

        const stats0 = cache.getStats();

        // 1st request -> MISS
        const res1 = await fetch(`${baseUrl}/tasks/${createdTaskId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        const json1 = await res1.json();
        assert.equal(res1.status, 200);
        assert.equal(json1.success, true);
        assert.equal(json1.data._id, createdTaskId);

        const stats1 = cache.getStats();
        assert.equal(stats1.misses, stats0.misses + 1);

        // 2nd request -> HIT
        const res2 = await fetch(`${baseUrl}/tasks/${createdTaskId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        const json2 = await res2.json();
        assert.equal(res2.status, 200);
        assert.equal(json2.success, true);
        assert.equal(json2.data._id, createdTaskId);

        const stats2 = cache.getStats();
        assert.equal(stats2.hits, stats1.hits + 1);
    });

    // Test D: PUT /tasks/:id invalidates both all_tasks and task_<id>
    it("D. PUT /tasks/:id: should update task and invalidate both 'all_tasks' and task cache", async () => {
        assert.ok(createdTaskId, "createdTaskId must exist");

        // Warm both caches
        await fetch(`${baseUrl}/tasks`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        await fetch(`${baseUrl}/tasks/${createdTaskId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        assert.ok(cache.raw.get("all_tasks") !== undefined);
        assert.ok(cache.raw.get(`task_${createdTaskId}`) !== undefined);

        // Perform PUT
        const updatePayload = {
            title: "Updated Practical 9 Title - " + Date.now(),
            completed: true
        };

        const res = await fetch(`${baseUrl}/tasks/${createdTaskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify(updatePayload)
        });
        const json = await res.json();

        assert.equal(res.status, 200);
        assert.equal(json.success, true);
        assert.equal(json.data.completed, true);

        // Both caches must be invalidated
        assert.equal(cache.raw.get("all_tasks"), undefined);
        assert.equal(cache.raw.get(`task_${createdTaskId}`), undefined);
    });

    // Test E: DELETE /tasks/:id invalidates both all_tasks and task_<id>
    it("E. DELETE /tasks/:id: should delete task and invalidate both 'all_tasks' and task cache", async () => {
        // Create a temporary task specifically for deletion
        const tempTask = await Task.create({
            title: "Task to Delete - " + Date.now(),
            priority: "low"
        });
        const tempId = tempTask._id.toString();

        // Warm both caches
        await fetch(`${baseUrl}/tasks`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        await fetch(`${baseUrl}/tasks/${tempId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        assert.ok(cache.raw.get("all_tasks") !== undefined);
        assert.ok(cache.raw.get(`task_${tempId}`) !== undefined);

        // Perform DELETE
        const res = await fetch(`${baseUrl}/tasks/${tempId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${authToken}` }
        });
        const json = await res.json();

        assert.equal(res.status, 200);
        assert.equal(json.success, true);
        assert.equal(json.message, "Task deleted successfully");

        // Both caches must be invalidated
        assert.equal(cache.raw.get("all_tasks"), undefined);
        assert.equal(cache.raw.get(`task_${tempId}`), undefined);
    });

    // Test G: Cache statistics endpoint
    it("G. Cache Stats: GET /api/v1/cache/stats should return hits and misses", async () => {
        const res = await fetch(`${baseUrl}/cache/stats`);
        const json = await res.json();

        assert.equal(res.status, 200);
        assert.equal(json.success, true);
        assert.equal(json.message, "Cache statistics fetched successfully");
        assert.equal(typeof json.data.hits, "number");
        assert.equal(typeof json.data.misses, "number");
    });

    // Test Cache Clear: DELETE /api/v1/cache
    it("Debug: DELETE /api/v1/cache should clear the cache", async () => {
        cache.set("dummy_key", "dummy_value");
        assert.equal(cache.raw.get("dummy_key"), "dummy_value");

        const res = await fetch(`${baseUrl}/cache`, {
            method: "DELETE"
        });
        const json = await res.json();

        assert.equal(res.status, 200);
        assert.equal(json.success, true);
        assert.equal(json.message, "Task cache cleared successfully");
        assert.equal(cache.raw.get("dummy_key"), undefined);
    });
});
