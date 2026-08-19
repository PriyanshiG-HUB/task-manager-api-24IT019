const Task = require("../models/Task");

/**
 * Fetch all tasks
 */
const getAllTasks = async () => {
    return await Task.find();
};

/**
 * Fetch task by ID
 * @param {string} id
 */
const getTaskById = async (id) => {
    return await Task.findById(id);
};

/**
 * Create a new task
 * @param {Object} taskData
 */
const createTask = async (taskData) => {
    return await Task.create(taskData);
};

/**
 * Update an existing task by ID
 * @param {string} id
 * @param {Object} updateData
 */
const updateTask = async (id, updateData) => {
    return await Task.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    });
};

/**
 * Delete a task by ID
 * @param {string} id
 */
const deleteTask = async (id) => {
    return await Task.findByIdAndDelete(id);
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};
