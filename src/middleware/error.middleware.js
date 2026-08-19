const { sendError } = require("../utils/response");

/**
 * Middleware to ensure request Content-Type is application/json for POST/PUT requests
 */
const checkContentType = (req, res, next) => {
    if (
        (req.method === "POST" || req.method === "PUT") &&
        !req.is("application/json")
    ) {
        return sendError(res, 400, "Content-Type must be application/json");
    }
    next();
};

/**
 * 404 Route Not Found Middleware
 */
const notFoundHandler = (req, res) => {
    return sendError(res, 404, "Route not found");
};

/**
 * Global Centralized Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
    if (process.env.NODE_ENV !== "production") {
        console.error(err.stack);
    }

    // Handle Mongoose Schema Validation Error
    if (err.name === "ValidationError") {
        const details = {};
        Object.keys(err.errors).forEach((field) => {
            details[field] = err.errors[field].message;
        });
        return sendError(res, 400, "Validation failed", details);
    }

    // Handle Mongoose Invalid ObjectId CastError
    if (err.name === "CastError") {
        return sendError(res, 400, "Invalid task ID");
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";

    return sendError(res, statusCode, message);
};

module.exports = {
    checkContentType,
    notFoundHandler,
    errorHandler
};
