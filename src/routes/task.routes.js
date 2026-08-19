const express = require("express");
const {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
} = require("../controllers/task.controller");
const { checkContentType } = require("../middleware/error.middleware");

const router = express.Router();

router.get("/", getTasks);
router.get("/:id", getTaskById);
router.post("/", checkContentType, createTask);
router.put("/:id", checkContentType, updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
