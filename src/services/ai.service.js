const { getOpenAIClient } = require("../config/openai");

const FALLBACK_MESSAGE =
    "AI description generation is temporarily unavailable. Please write your description manually.";

/**
 * Generate a concise, practical task description from a task title using OpenAI.
 * Gracefully degrades to a fallback response if the API key is unconfigured or if any provider error occurs.
 *
 * @param {string} title - Validated task title
 * @param {Object} [injectedClient] - Optional injected OpenAI client (used for unit tests/mocking)
 * @returns {Promise<{ success: boolean, description: string, fallback: boolean, message?: string }>}
 */
const generateTaskDescription = async (title, injectedClient = null) => {
    const client = injectedClient !== null ? injectedClient : getOpenAIClient();

    // 1. Missing or unconfigured API key -> Graceful fallback
    if (!client) {
        return {
            success: true,
            description: "",
            fallback: true,
            message: FALLBACK_MESSAGE
        };
    }

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    try {
        const response = await client.chat.completions.create({
            model,
            messages: [
                {
                    role: "system",
                    content:
                        "You are an AI assistant in a task management app. Generate a single, concise, professional, and actionable task description (1-2 sentences) based on the task title provided. Do not use quotes, pleasantries, bullet points, markdown formatting, or preamble. Return plain text only."
                },
                {
                    role: "user",
                    content: `Task title: "${title.trim()}"`
                }
            ],
            max_tokens: 150,
            temperature: 0.7
        });

        const rawDescription = response.choices?.[0]?.message?.content?.trim();

        if (!rawDescription) {
            return {
                success: true,
                description: "",
                fallback: true,
                message: FALLBACK_MESSAGE
            };
        }

        // Clean any accidental enclosing quotes
        const cleanDescription = rawDescription.replace(/^["']|["']$/g, "").trim();

        return {
            success: true,
            description: cleanDescription,
            fallback: false
        };
    } catch (err) {
        // Safe logging without exposing secrets or full error trace to clients
        console.warn(`[AI Service] OpenAI request failed gracefully: ${err.message || "Unknown error"}`);

        // Graceful degradation: never crash, never leak key or raw internal trace
        return {
            success: true,
            description: "",
            fallback: true,
            message: FALLBACK_MESSAGE
        };
    }
};

module.exports = {
    generateTaskDescription,
    FALLBACK_MESSAGE
};
