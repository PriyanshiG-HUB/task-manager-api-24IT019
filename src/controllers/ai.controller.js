const { generateTaskDescription } = require("../services/ai.service");

/**
 * Controller to handle AI task description generation requests.
 * POST /api/v1/ai/generate-description
 */
const generateDescription = async (req, res, next) => {
    try {
        const { title } = req.body;

        // 1. Validation: Title must be present and non-empty
        if (!title || typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Task title is required"
            });
        }

        // 2. Validation: Length limit to prevent abuse
        if (title.trim().length > 200) {
            return res.status(400).json({
                success: false,
                message: "Task title must not exceed 200 characters"
            });
        }

        // 3. Generate description through AI service (with graceful degradation)
        const result = await generateTaskDescription(title.trim());

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    generateDescription
};
