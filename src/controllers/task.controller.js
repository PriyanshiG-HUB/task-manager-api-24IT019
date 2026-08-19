const taskService = require("../services/task.service");
const { sendSuccess, sendError } = require("../utils/response");

/**
 * Get all tasks
 */
const getTasks = async (req, res, next) => {
    try {
        const tasks = await taskService.getAllTasks();
        return sendSuccess(res, 200, "Tasks fetched successfully", tasks);
    } catch (error) {
        next(error);
    }
};

/**
 * Get task by ID
 */
const getTaskById = async (req, res, next) => {
    try {
        const task = await taskService.getTaskById(req.params.id);

        if (!task) {
            return sendError(res, 404, "Task not found");
        }

        return sendSuccess(res, 200, "Task fetched successfully", task);
    } catch (error) {
        next(error);
    }
};

/**
 * Create a new task
 */
const createTask = async (req, res, next) => {
    try {
        const task = await taskService.createTask(req.body);
        return sendSuccess(res, 201, "Task created successfully", task);
    } catch (error) {
        next(error);
    }
};

/**
 * Update an existing task
 */
const updateTask = async (req, res, next) => {
    try {
        const task = await taskService.updateTask(req.params.id, req.body);

        if (!task) {
            return sendError(res, 404, "Task not found");
        }

        return sendSuccess(res, 200, "Task updated successfully", task);
    } catch (error) {
        next(error);
    }
};

/**
 * Delete a task
 */
const deleteTask = async (req, res, next) => {
    try {
        const task = await taskService.deleteTask(req.params.id);

        if (!task) {
            return sendError(res, 404, "Task not found");
        }

        return sendSuccess(res, 200, "Task deleted successfully", task);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};
