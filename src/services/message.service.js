const Message = require("../models/Message");

/**
 * Save a new contact message
 * @param {Object} messageData - { name, email, message }
 */
const createMessage = async (messageData) => {
    return await Message.create(messageData);
};

/**
 * Get all contact messages, sorted with newest first
 */
const getAllMessages = async () => {
    return await Message.find().sort({ createdAt: -1 });
};

/**
 * Get message by ID
 * @param {string} id
 */
const getMessageById = async (id) => {
    return await Message.findById(id);
};

module.exports = {
    createMessage,
    getAllMessages,
    getMessageById
};
