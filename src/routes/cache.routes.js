const express = require("express");
const { getCacheStats, clearCache } = require("../controllers/cache.controller");

const router = express.Router();

// GET /api/v1/cache/stats - Retrieve cache hit/miss statistics
router.get("/stats", getCacheStats);

// DELETE /api/v1/cache - Clear all cached task data
router.delete("/", clearCache);

module.exports = router;
