const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const taskRoutes = require("./routes/task.routes");
const authRoutes = require("./routes/auth.routes");
const cacheRoutes = require("./routes/cache.routes");
const { notFoundHandler, errorHandler } = require("./middleware/error.middleware");
const { sendSuccess } = require("./utils/response");

const app = express();
app.use(cors());
// Body Parser Middleware   
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging Middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
});

// Health Check Endpoint
app.get("/api/v1/health", (req, res) => {
    const dbState = mongoose.connection.readyState;
    const dbStatusMap = {
        0: "disconnected",
        1: "connected",
        2: "connecting",
        3: "disconnecting"
    };

    return sendSuccess(res, 200, "API is healthy", {
        status: "ok",
        database: dbStatusMap[dbState] || "unknown",
        uptime: process.uptime()
    });
});

// Authentication Routes
app.use("/api/v1/auth", authRoutes);
app.use("/auth", authRoutes);

// Cache Debug & Statistics Routes
app.use("/api/v1/cache", cacheRoutes);
app.use("/cache", cacheRoutes);

// Contact Message Routes (Asynchronous with MongoDB persistence)
const messageRoutes = require("./routes/message.routes");
app.use("/api/v1/messages", messageRoutes);
app.use("/messages", messageRoutes);

// Primary Versioned Task Routes
app.use("/api/v1/tasks", taskRoutes);

// Legacy Route Compatibility (redirect or mount taskRoutes at /tasks)
app.use("/tasks", taskRoutes);

// Test Error Handler Route (preserved from original)
app.get("/test-error", (req, res, next) => {
    const error = new Error("Testing global error handler");
    next(error);
});

// 404 Route Not Found Middleware
app.use(notFoundHandler);

// Centralized Global Error Handler Middleware
app.use(errorHandler);

module.exports = app;
