const { sendError } = require("../utils/response");

/**
 * Basic Email validation regex
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate Registration Payload
 */
const validateRegister = (req, res, next) => {
    const { email, password } = req.body || {};

    if (!email || typeof email !== "string" || !email.trim()) {
        return sendError(res, 400, "Email is required");
    }

    if (!isValidEmail(email.trim())) {
        return sendError(res, 400, "Invalid email format");
    }

    if (!password || typeof password !== "string") {
        return sendError(res, 400, "Password is required");
    }

    if (password.length < 6) {
        return sendError(res, 400, "Password must be at least 6 characters long");
    }

    next();
};

/**
 * Validate Login Payload
 */
const validateLogin = (req, res, next) => {
    const { email, password } = req.body || {};

    if (!email || typeof email !== "string" || !email.trim()) {
        return sendError(res, 400, "Email is required");
    }

    if (!password || typeof password !== "string") {
        return sendError(res, 400, "Password is required");
    }

    next();
};

/**
 * Validate Task Payload (for POST/PUT)
 */
const validateTask = (req, res, next) => {
    const { title } = req.body || {};

    // For POST, title is strictly required. For PUT, if provided or if full replacement, check validity.
    // As per Practical 7 requirements:
    // title required, title must not be empty or whitespace -> Return HTTP 400 with "Task title is required" or similar.
    if (req.method === "POST" || req.body.hasOwnProperty("title")) {
        if (!title || typeof title !== "string" || !title.trim()) {
            return sendError(res, 400, "Task title is required");
        }
    }

    next();
};

/**
 * Validate Contact Message Payload
 */
const validateMessage = (req, res, next) => {
    const { name, email, message } = req.body || {};

    if (!name || typeof name !== "string" || !name.trim()) {
        return sendError(res, 400, "Name is required");
    }

    if (!email || typeof email !== "string" || !email.trim()) {
        return sendError(res, 400, "Email is required");
    }

    if (!isValidEmail(email.trim())) {
        return sendError(res, 400, "Invalid email format");
    }

    if (!message || typeof message !== "string" || !message.trim()) {
        return sendError(res, 400, "Message is required");
    }

    next();
};

module.exports = {
    validateRegister,
    validateLogin,
    validateTask,
    validateMessage
};
