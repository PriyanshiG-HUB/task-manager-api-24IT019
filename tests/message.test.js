const { describe, it, before, after } = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = require("../src/app");
const Message = require("../src/models/Message");

const JWT_SECRET = process.env.JWT_SECRET || "task_manager_practical7_secret_2026";
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/task_manager";

describe("Contact Inquiries — Asynchronous & Data Persistence API Suite", () => {
    let server;
    let baseUrl;
    let authToken;
    let createdMessageId;

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
            { id: "admin_user", email: "admin@example.com" },
            JWT_SECRET,
            { expiresIn: "1h" }
        );
    });

    after(async () => {
        // Clean up created test message
        if (createdMessageId) {
            await Message.findByIdAndDelete(createdMessageId);
        }

        // Close server and database connection
        if (server) {
            await new Promise((resolve) => server.close(resolve));
        }
        await mongoose.connection.close();
    });

    it("Validation: should reject message without name with 400", async () => {
        const res = await fetch(`${baseUrl}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "tester@example.com", message: "Hello there" })
        });
        const json = await res.json();

        assert.equal(res.status, 400);
        assert.equal(json.success, false);
        assert.match(json.message, /Name is required/i);
    });

    it("Validation: should reject message with invalid email format with 400", async () => {
        const res = await fetch(`${baseUrl}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "Tester", email: "invalid-email", message: "Hello there" })
        });
        const json = await res.json();

        assert.equal(res.status, 400);
        assert.equal(json.success, false);
        assert.match(json.message, /Invalid email format/i);
    });

    it("Validation: should reject message without message body with 400", async () => {
        const res = await fetch(`${baseUrl}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "Tester", email: "tester@example.com" })
        });
        const json = await res.json();

        assert.equal(res.status, 400);
        assert.equal(json.success, false);
        assert.match(json.message, /Message is required/i);
    });

    it("Persistence: should successfully persist message to MongoDB via POST /messages", async () => {
        const testPayload = {
            name: "John Doe",
            email: "john.doe@example.com",
            message: "I am interested in collaborating on a full-stack project."
        };

        const res = await fetch(`${baseUrl}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(testPayload)
        });
        const json = await res.json();

        assert.equal(res.status, 201);
        assert.equal(json.success, true);
        assert.equal(json.message, "Message sent successfully");
        assert.ok(json.data._id);
        assert.equal(json.data.name, "John Doe");
        assert.equal(json.data.email, "john.doe@example.com");
        assert.equal(json.data.message, testPayload.message);

        createdMessageId = json.data._id;

        // Verify direct database persistence in MongoDB
        const dbRecord = await Message.findById(createdMessageId);
        assert.ok(dbRecord, "Record must exist in MongoDB");
        assert.equal(dbRecord.name, "John Doe");
    });

    it("Security: should reject unauthenticated GET /messages with 401", async () => {
        const res = await fetch(`${baseUrl}/messages`);
        const json = await res.json();

        assert.equal(res.status, 401);
        assert.equal(json.success, false);
    });

    it("Retrieval: should return messages list for authenticated request with 200", async () => {
        const res = await fetch(`${baseUrl}/messages`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        const json = await res.json();

        assert.equal(res.status, 200);
        assert.equal(json.success, true);
        assert.ok(Array.isArray(json.data));
        const found = json.data.find((m) => m._id === createdMessageId);
        assert.ok(found, "Saved message must be present in retrieved messages list");
    });
});
