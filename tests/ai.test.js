const { describe, it, before, after, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = require("../src/app");
const { generateTaskDescription, FALLBACK_MESSAGE } = require("../src/services/ai.service");
const { resetAiRateLimits } = require("../src/middleware/aiRateLimit.middleware");

const JWT_SECRET = process.env.JWT_SECRET || "task_manager_practical7_secret_2026";
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/task_manager";

describe("Practical 13 — AI API Integration & Graceful Degradation Suite", () => {
    let server;
    let baseUrl;
    let authToken;

    before(async () => {
        // Connect to MongoDB if not already connected
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(MONGO_URI);
        }

        // Spin up ephemeral test server
        await new Promise((resolve) => {
            server = app.listen(0, () => {
                const port = server.address().port;
                baseUrl = `http://127.0.0.1:${port}/api/v1`;
                resolve();
            });
        });

        // Sign test JWT token
        authToken = jwt.sign(
            { id: "test_ai_user_p13", email: "p13_tester@example.com" },
            JWT_SECRET,
            { expiresIn: "1h" }
        );
    });

    after(async () => {
        if (server) {
            await new Promise((resolve) => server.close(resolve));
        }
        await mongoose.connection.close();
    });

    beforeEach(() => {
        resetAiRateLimits();
    });

    // ==================== SERVICE-LEVEL UNIT TESTS ====================

    describe("AI Service Unit Tests (Mocked Provider)", () => {
        it("1. Mock Success: should return clean AI description on successful provider response", async () => {
            const mockClient = {
                chat: {
                    completions: {
                        create: async () => ({
                            choices: [
                                {
                                    message: {
                                        content:
                                            '  "Design the relational schema, write queries, and document results before the deadline."  '
                                    }
                                }
                            ]
                        })
                    }
                }
            };

            const result = await generateTaskDescription(
                "Complete DBMS Practical Assignment",
                mockClient
            );

            assert.equal(result.success, true);
            assert.equal(result.fallback, false);
            assert.equal(
                result.description,
                "Design the relational schema, write queries, and document results before the deadline."
            );
        });

        it("2. Missing Key Fallback: should return fallback response when client is null", async () => {
            const result = await generateTaskDescription("Some Task Title", null);

            // Since process.env.OPENAI_API_KEY is placeholder or missing in test runner:
            assert.equal(result.success, true);
            assert.equal(result.fallback, true);
            assert.equal(result.description, "");
            assert.equal(result.message, FALLBACK_MESSAGE);
        });

        it("3. Provider Authentication Failure: should catch 401 error and return fallback without throwing", async () => {
            const mockClient = {
                chat: {
                    completions: {
                        create: async () => {
                            const err = new Error("Incorrect API key provided");
                            err.status = 401;
                            throw err;
                        }
                    }
                }
            };

            const result = await generateTaskDescription(
                "Prepare Security Audit Report",
                mockClient
            );

            assert.equal(result.success, true);
            assert.equal(result.fallback, true);
            assert.equal(result.description, "");
            assert.equal(result.message, FALLBACK_MESSAGE);
        });

        it("4. Provider Timeout or Network Error: should handle network timeout gracefully", async () => {
            const mockClient = {
                chat: {
                    completions: {
                        create: async () => {
                            const err = new Error("Connection timed out after 10000ms");
                            err.code = "ETIMEDOUT";
                            throw err;
                        }
                    }
                }
            };

            const result = await generateTaskDescription("Optimize Docker Images", mockClient);

            assert.equal(result.success, true);
            assert.equal(result.fallback, true);
            assert.equal(result.description, "");
            assert.equal(result.message, FALLBACK_MESSAGE);
        });
    });

    // ==================== ENDPOINT INTEGRATION TESTS ====================

    describe("AI HTTP Endpoint Integration Tests", () => {
        it("5. Security: unauthenticated request to /ai/generate-description should return 401", async () => {
            const res = await fetch(`${baseUrl}/ai/generate-description`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: "Setup CI/CD Pipeline" })
            });
            const json = await res.json();

            assert.equal(res.status, 401);
            assert.equal(json.success, false);
            assert.match(json.message, /Authentication token required/i);
        });

        it("6. Validation: request with empty title should return 400", async () => {
            const res = await fetch(`${baseUrl}/ai/generate-description`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify({ title: "   " })
            });
            const json = await res.json();

            assert.equal(res.status, 400);
            assert.equal(json.success, false);
            assert.equal(json.message, "Task title is required");
        });

        it("7. Validation: request with missing title field should return 400", async () => {
            const res = await fetch(`${baseUrl}/ai/generate-description`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify({})
            });
            const json = await res.json();

            assert.equal(res.status, 400);
            assert.equal(json.success, false);
            assert.equal(json.message, "Task title is required");
        });

        it("8. Validation: request with title exceeding 200 characters should return 400", async () => {
            const longTitle = "A".repeat(201);
            const res = await fetch(`${baseUrl}/ai/generate-description`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify({ title: longTitle })
            });
            const json = await res.json();

            assert.equal(res.status, 400);
            assert.equal(json.success, false);
            assert.equal(json.message, "Task title must not exceed 200 characters");
        });

        it("9. Fallback & Safe Handling: valid authenticated request returns 200 with fallback response", async () => {
            const res = await fetch(`${baseUrl}/ai/generate-description`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify({ title: "Configure Nginx Reverse Proxy" })
            });
            const json = await res.json();

            assert.equal(res.status, 200);
            assert.equal(json.success, true);
            assert.equal(typeof json.fallback, "boolean");
            // Description is string
            assert.equal(typeof json.description, "string");
        });

        it("10. Security: response should never leak OPENAI_API_KEY or internal provider secrets", async () => {
            const res = await fetch(`${baseUrl}/ai/generate-description`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify({ title: "Audit Secrets Management" })
            });
            const rawBody = await res.text();

            assert.equal(rawBody.includes("sk-"), false);
            assert.equal(rawBody.includes("OPENAI_API_KEY"), false);
            assert.equal(rawBody.includes("task_manager_practical7_secret_2026"), false);
        });

        it("11. Rate Limiting: repeated requests for the same task title within 60s should return 429", async () => {
            const payload = { title: "Prepare Final Presentation Slides" };

            // First request: Allowed
            const res1 = await fetch(`${baseUrl}/ai/generate-description`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify(payload)
            });
            assert.equal(res1.status, 200);

            // Immediate second request for same title: Rate limited
            const res2 = await fetch(`${baseUrl}/ai/generate-description`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify(payload)
            });
            const json2 = await res2.json();

            assert.equal(res2.status, 429);
            assert.equal(json2.success, false);
            assert.match(json2.message, /Rate limit exceeded/i);
            assert.ok(json2.retryAfter > 0 && json2.retryAfter <= 60);
            assert.ok(res2.headers.get("Retry-After"));
        });

        it("12. Rate Limit Isolation: different task titles are not blocked by another title's rate limit", async () => {
            // First title
            await fetch(`${baseUrl}/ai/generate-description`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify({ title: "Task Alpha" })
            });

            // Second different title: should succeed with 200
            const resDifferent = await fetch(`${baseUrl}/ai/generate-description`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify({ title: "Task Beta" })
            });

            assert.equal(resDifferent.status, 200);
        });
    });
});
