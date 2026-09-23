const NodeCache = require("node-cache");

const ttl = parseInt(process.env.CACHE_TTL, 10) || 60;
const nodeCache = new NodeCache({
    stdTTL: ttl,
    checkperiod: ttl * 0.2
});

let cacheHits = 0;
let cacheMisses = 0;

/**
 * Shared in-memory cache module using node-cache with hit/miss tracking
 */
const cache = {
    raw: nodeCache,

    /**
     * Get item from cache
     * @param {string} key
     * @returns {any}
     */
    get(key) {
        try {
            const value = nodeCache.get(key);
            if (value !== undefined) {
                cacheHits++;
                console.log(`[Cache] HIT: ${key}`);
                return value;
            } else {
                cacheMisses++;
                console.log(`[Cache] MISS: ${key}`);
                return undefined;
            }
        } catch (err) {
            console.error(`[Cache] Error reading key "${key}":`, err.message);
            cacheMisses++;
            return undefined;
        }
    },

    /**
     * Set item in cache
     * @param {string} key
     * @param {any} value
     * @param {number} [customTTL]
     * @returns {boolean}
     */
    set(key, value, customTTL) {
        try {
            const success = customTTL !== undefined ? nodeCache.set(key, value, customTTL) : nodeCache.set(key, value);
            if (success) {
                console.log(`[Cache] SET: ${key}`);
            }
            return success;
        } catch (err) {
            console.error(`[Cache] Error setting key "${key}":`, err.message);
            return false;
        }
    },

    /**
     * Delete/invalidate item from cache
     * @param {string} key
     * @returns {number}
     */
    del(key) {
        try {
            const count = nodeCache.del(key);
            if (count > 0) {
                console.log(`[Cache] INVALIDATED: ${key}`);
            }
            return count;
        } catch (err) {
            console.error(`[Cache] Error deleting key "${key}":`, err.message);
            return 0;
        }
    },

    /**
     * Flush all cache keys
     */
    flush() {
        try {
            nodeCache.flushAll();
            console.log("[Cache] INVALIDATED: all cache cleared");
        } catch (err) {
            console.error("[Cache] Error flushing cache:", err.message);
        }
    },

    /**
     * Retrieve cache hit and miss statistics
     * @returns {{ hits: number, misses: number }}
     */
    getStats() {
        return {
            hits: cacheHits,
            misses: cacheMisses
        };
    },

    /**
     * Reset statistics counters
     */
    resetStats() {
        cacheHits = 0;
        cacheMisses = 0;
    }
};

module.exports = cache;
