const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Register a new user
 * @param {Object} userData - { email, password }
 */
const registerUser = async ({ email, password }) => {
    // 1. Check whether email already exists
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
        const error = new Error("User already exists with this email");
        error.statusCode = 409;
        throw error;
    }

    // 2. Hash password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Save the user with the hashed password
    const user = await User.create({
        email: normalizedEmail,
        password: hashedPassword
    });

    // 4. Return safe user info (never return password)
    return {
        _id: user._id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
};

/**
 * Login an existing user
 * @param {Object} credentials - { email, password }
 */
const loginUser = async ({ email, password }) => {
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Find user by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    // 3. Generate JWT
    const token = jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    // 4. Return token and safe user information (never return password)
    return {
        token,
        user: {
            _id: user._id,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    };
};

/**
 * Get user profile by ID without password
 * @param {string} id
 */
const getUserById = async (id) => {
    const user = await User.findById(id).select("-password");
    return user;
};

module.exports = {
    registerUser,
    loginUser,
    getUserById
};
