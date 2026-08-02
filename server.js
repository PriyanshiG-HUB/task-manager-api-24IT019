const express = require("express");

const app = express();
const PORT = 5000;

// Parse JSON request bodies
app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
    console.log(
        `${req.method} ${req.url} - ${new Date().toISOString()}`
    );
    next();
});

// Content-Type Middleware
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

// Temporary in-memory data
let tasks = [
    {
        id: 1,
        title: "Learn Node.js",
        completed: false
    },
    {
        id: 2,
        title: "Learn Express.js",
        completed: false
    }
];

// Task ID validation middleware
const validateTaskId = (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: "Invalid task ID"
        });
    }

    next();
};

// GET all tasks
app.get("/tasks", (req, res) => {
    res.status(200).json(tasks);
});

// CREATE a task
app.post("/tasks", (req, res) => {
    const newTask = {
        id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
        title: req.body.title,
        completed: req.body.completed || false
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
});

// UPDATE a task
app.put("/tasks/:id", validateTaskId, (req, res) => {
    const id = Number(req.params.id);

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    task.title = req.body.title ?? task.title;
    task.completed = req.body.completed ?? task.completed;

    res.status(200).json(task);
});

// DELETE a task
app.delete("/tasks/:id", validateTaskId, (req, res) => {
    const id = Number(req.params.id);

    const index = tasks.findIndex(task => task.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    const deletedTask = tasks.splice(index, 1);

    res.status(200).json({
        message: "Task deleted successfully",
        task: deletedTask[0]
    });
});
app.get("/test-error", (req, res, next) => {
    const error = new Error("Testing global error handler");
    next(error);
});
// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

// Global Error Handler - MUST BE LAST
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        error: "Something went wrong"
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});