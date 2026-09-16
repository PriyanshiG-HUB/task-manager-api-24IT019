const authService = require("../services/auth.service");
const { sendSuccess, sendError } = require("../utils/response");

/**
 * Register Controller
 */
const register = async (req, res, next) => {
    try {
        const user = await authService.registerUser(req.body);
        return sendSuccess(res, 201, "User registered successfully", user);
    } catch (error) {
        next(error);
    }
};

/**
 * Login Controller
 */
const login = async (req, res, next) => {
    try {
        const result = await authService.loginUser(req.body);
        return sendSuccess(res, 200, "Login successful", result);
    } catch (error) {
        next(error);
    }
};

/**
 * Me Controller (Get current authenticated user profile)
 */
const me = async (req, res, next) => {
    try {
        const user = await authService.getUserById(req.user.id);
        if (!user) {
            return sendError(res, 404, "User not found");
        }
        return sendSuccess(res, 200, "User profile fetched successfully", user);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    me
};
