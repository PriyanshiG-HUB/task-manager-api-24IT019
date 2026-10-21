const taskService = require("../services/task.service");
const { sendSuccess, sendError } = require("../utils/response");
const taskEvents = require("../events/events");

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
        
        console.log(`\n[API] Task created at: ${new Date().toISOString()}`);
        sendSuccess(res, 201, "Task created successfully", task);
        console.log(`[API] Response sent at: ${new Date().toISOString()}`);
        
        console.log(`[Event] task-created emitted at: ${new Date().toISOString()}`);
        taskEvents.emit('task-created', task, req.user);
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

        console.log(`\n[API] Task deleted at: ${new Date().toISOString()}`);
        sendSuccess(res, 200, "Task deleted successfully", task);
        console.log(`[API] Response sent at: ${new Date().toISOString()}`);

        console.log(`[Event] task-deleted emitted at: ${new Date().toISOString()}`);
        taskEvents.emit('task-deleted', task, req.user);
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
