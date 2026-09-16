const express = require("express");
const {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
} = require("../controllers/task.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { validateTask } = require("../middleware/validation.middleware");
const { checkContentType } = require("../middleware/error.middleware");

const router = express.Router();

// Apply authMiddleware to all task routes
router.use(authMiddleware);

router.get("/", getTasks);
router.get("/:id", getTaskById);
router.post("/", checkContentType, validateTask, createTask);
router.put("/:id", checkContentType, validateTask, updateTask);
router.delete("/:id", deleteTask);

module.exports = router;

