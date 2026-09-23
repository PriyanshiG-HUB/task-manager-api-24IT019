const messageService = require("../services/message.service");
const { sendSuccess, sendError } = require("../utils/response");

/**
 * Handle new contact message submission (asynchronous)
 * POST /api/v1/messages
 */
const createMessage = async (req, res, next) => {
    try {
        const { name, email, message } = req.body;
        const savedMessage = await messageService.createMessage({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            message: message.trim()
        });

        return sendSuccess(res, 201, "Message sent successfully", savedMessage);
    } catch (error) {
        next(error);
    }
};

/**
 * Retrieve all contact messages (Protected)
 * GET /api/v1/messages
 */
const getMessages = async (req, res, next) => {
    try {
        const messages = await messageService.getAllMessages();
        return sendSuccess(res, 200, "Messages fetched successfully", messages);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createMessage,
    getMessages
};
