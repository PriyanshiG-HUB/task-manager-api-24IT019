const express = require("express");
const { register, login, me } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { validateRegister, validateLogin } = require("../middleware/validation.middleware");
const { checkContentType } = require("../middleware/error.middleware");

const router = express.Router();

router.post("/register", checkContentType, validateRegister, register);
router.post("/login", checkContentType, validateLogin, login);
router.get("/me", authMiddleware, me);

module.exports = router;
