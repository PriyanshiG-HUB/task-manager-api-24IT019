const cache = require("../config/cache");
const { sendSuccess } = require("../utils/response");

/**
 * Get cache statistics (hits and misses)
 * GET /api/v1/cache/stats
 */
const getCacheStats = (req, res, next) => {
    try {
        const stats = cache.getStats();
        return sendSuccess(res, 200, "Cache statistics fetched successfully", stats);
    } catch (error) {
        next(error);
    }
};

/**
 * Clear in-memory task cache
 * DELETE /api/v1/cache
 */
const clearCache = (req, res, next) => {
    try {
        cache.flush();
        return sendSuccess(res, 200, "Task cache cleared successfully", null);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCacheStats,
    clearCache
};
