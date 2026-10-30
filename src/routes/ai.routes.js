const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { aiRateLimitMiddleware } = require("../middleware/aiRateLimit.middleware");
const { generateDescription } = require("../controllers/ai.controller");

/**
 * Route: POST /api/v1/ai/generate-description (and /api/ai/generate-description)
 * Middleware pipeline:
 *  1. authMiddleware - validates JWT Bearer token
 *  2. aiRateLimitMiddleware - enforces 1 request per task title per 60 seconds
 *  3. generateDescription controller - validates input and calls OpenAI with fallback
 */
router.post(
    "/generate-description",
    authMiddleware,
    aiRateLimitMiddleware,
    generateDescription
);

module.exports = router;
