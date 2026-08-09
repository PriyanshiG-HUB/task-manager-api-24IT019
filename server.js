const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const Task = require("./models/Task");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
});

const checkContentType = (req, res, next) => {
    if (
        (req.method === "POST" || req.method === "PUT") &&
        !req.is("application/json")
    ) {
        return res.status(400).json({
            error: "Content-Type must be application/json"
        });
    }

    next();
};

app.use(checkContentType);

app.get("/tasks", async (req, res, next) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (err) {
        next(err);
    }
});

app.get("/tasks/:id", async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.status(200).json(task);
    } catch (err) {
        next(err);
    }
});

app.post("/tasks", async (req, res, next) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json(task);
    } catch (err) {
        next(err);
    }
});

app.put("/tasks/:id", async (req, res, next) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.status(200).json(task);
    } catch (err) {
        next(err);
    }
});

app.delete("/tasks/:id", async (req, res, next) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully",
            task: task
        });
    } catch (err) {
        next(err);
    }
});

app.get("/test-error", (req, res, next) => {
    const error = new Error("Testing global error handler");
    next(error);
});

app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);

    if (err.name === "ValidationError") {
        const details = {};

        Object.keys(err.errors).forEach((field) => {
            details[field] = err.errors[field].message;
        });

        return res.status(400).json({
            error: "Validation failed",
            details: details
        });
    }

    if (err.name === "CastError") {
        return res.status(400).json({
            error: "Invalid task ID"
        });
    }

    res.status(500).json({
        error: "Something went wrong"
    });
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err.message);
    });