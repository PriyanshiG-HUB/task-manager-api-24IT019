const { describe, it, before, after } = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
require("dotenv").config();

const app = require("../src/app");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/task_manager";

describe("Practical 12 — CI Core Endpoint Integration Suite", () => {
    let server;
    let baseUrl;

    before(async () => {
        // Connect to MongoDB if not already connected
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
    });

    after(async () => {
        // Close server and database connection
        if (server) {
            await new Promise((resolve) => server.close(resolve));
        }
        await mongoose.connection.close();
    });

    // Endpoint 1: System Health Endpoint
    it("Health Endpoint: GET /health should return HTTP 200 and healthy status", async () => {
        const res = await fetch(`${baseUrl}/health`);
        const json = await res.json();

        assert.equal(res.status, 200);
        assert.equal(json.success, true);
        assert.equal(json.message, "API is healthy");
        assert.equal(json.data.status, "ok");
    });

    // Endpoint 2: Security Barrier on Tasks Endpoint
    it("Security Endpoint: GET /tasks without token should return HTTP 401", async () => {
        const res = await fetch(`${baseUrl}/tasks`);
        const json = await res.json();

        assert.equal(res.status, 401);
        assert.equal(json.success, false);
        assert.match(json.message, /Authentication token required/i);
    });

    // Endpoint 3: Input Validation on Contact Messages Endpoint
    it("Validation Endpoint: POST /messages with missing name should return HTTP 400", async () => {
        const res = await fetch(`${baseUrl}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "ci_test@example.com", message: "CI validation test" })
        });
        const json = await res.json();

        assert.equal(res.status, 400);
        assert.equal(json.success, false);
        assert.match(json.message, /Name is required/i);
    });
});

