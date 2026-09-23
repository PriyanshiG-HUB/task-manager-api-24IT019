const express = require("express");
const { createMessage, getMessages } = require("../controllers/message.controller");
const { validateMessage } = require("../middleware/validation.middleware");
const { checkContentType } = require("../middleware/error.middleware");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Public: Asynchronous contact submission
router.post("/", checkContentType, validateMessage, createMessage);

// Protected: View received messages
router.get("/", authMiddleware, getMessages);

module.exports = router;
