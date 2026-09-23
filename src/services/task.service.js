const Task = require("../models/Task");
const cache = require("../config/cache");

/**
 * Fetch all tasks (with in-memory cache)
 */
const getAllTasks = async () => {
    const cachedTasks = cache.get("all_tasks");
    if (cachedTasks !== undefined) {
        return cachedTasks;
    }

    const tasks = await Task.find();
    cache.set("all_tasks", tasks);
    return tasks;
};

/**
 * Fetch task by ID (with in-memory cache)
 * @param {string} id
 */
const getTaskById = async (id) => {
    const cacheKey = `task_${id}`;
    const cachedTask = cache.get(cacheKey);
    if (cachedTask !== undefined) {
        return cachedTask;
    }

    const task = await Task.findById(id);
    if (task) {
        cache.set(cacheKey, task);
    }
    return task;
};

/**
 * Create a new task and invalidate 'all_tasks' cache
 * @param {Object} taskData
 */
const createTask = async (taskData) => {
    const task = await Task.create(taskData);
    cache.del("all_tasks");
    return task;
};

/**
 * Update an existing task by ID and invalidate 'all_tasks' and task-specific cache
 * @param {string} id
 * @param {Object} updateData
 */
const updateTask = async (id, updateData) => {
    const task = await Task.findByIdAndUpdate(id, updateData, {
        new: true,
        returnDocument: "after",
        runValidators: true
    });

    if (task) {
        cache.del("all_tasks");
        cache.del(`task_${id}`);
    }

    return task;
};

/**
 * Delete a task by ID and invalidate 'all_tasks' and task-specific cache
 * @param {string} id
 */
const deleteTask = async (id) => {
    const task = await Task.findByIdAndDelete(id);

    if (task) {
        cache.del("all_tasks");
        cache.del(`task_${id}`);
    }

    return task;
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};
