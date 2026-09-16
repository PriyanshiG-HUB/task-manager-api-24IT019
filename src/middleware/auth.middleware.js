const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/response");

/**
 * Authentication Middleware
 * Validates the Bearer token in the Authorization header
 */
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // 1. Check if Authorization header is present and starts with Bearer
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return sendError(res, 401, "Authentication token required");
    }

    // 2. Extract token safely
    const token = authHeader.split(" ")[1];
    if (!token) {
        return sendError(res, 401, "Authentication token required");
    }

    // 3. Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return sendError(res, 401, "Invalid or expired token");
    }
};

module.exports = authMiddleware;
