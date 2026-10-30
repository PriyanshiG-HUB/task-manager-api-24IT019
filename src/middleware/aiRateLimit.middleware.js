/**
 * In-memory per-task rate limiter for AI generation.
 * Limits users to 1 AI generation request per task title per 60 seconds.
 * Note: Since this is in-memory, counts reset if the server restarts.
 */
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 60 seconds

// Periodic cleanup of stale records every 5 minutes
const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, timestamp] of rateLimitMap.entries()) {
        if (now - timestamp > RATE_LIMIT_WINDOW_MS) {
            rateLimitMap.delete(key);
        }
    }
}, 5 * 60 * 1000);

if (cleanupInterval.unref) {
    cleanupInterval.unref(); // Prevent lingering handle in tests/exits
}

const aiRateLimitMiddleware = (req, res, next) => {
    const rawTitle = req.body?.title;
    if (!rawTitle || typeof rawTitle !== "string" || !rawTitle.trim()) {
        // Let the controller handle title validation errors
        return next();
    }

    const userId = req.user?.id || req.user?._id || req.ip || "anonymous";
    const normalizedTitle = rawTitle.trim().toLowerCase();
    const rateLimitKey = `${userId}:${normalizedTitle}`;

    const now = Date.now();
    const lastRequest = rateLimitMap.get(rateLimitKey);

    if (lastRequest && now - lastRequest < RATE_LIMIT_WINDOW_MS) {
        const remainingMs = RATE_LIMIT_WINDOW_MS - (now - lastRequest);
        const retryAfterSeconds = Math.max(1, Math.ceil(remainingMs / 1000));

        res.set("Retry-After", String(retryAfterSeconds));
        return res.status(429).json({
            success: false,
            message: "Rate limit exceeded. Please wait before generating another description for this task.",
            retryAfter: retryAfterSeconds
        });
    }

    // Record request timestamp
    rateLimitMap.set(rateLimitKey, now);
    next();
};

/**
 * Reset rate limits (useful for test isolation)
 */
const resetAiRateLimits = () => {
    rateLimitMap.clear();
};

module.exports = {
    aiRateLimitMiddleware,
    resetAiRateLimits,
    RATE_LIMIT_WINDOW_MS
};
