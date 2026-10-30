const OpenAI = require("openai");

/**
 * Returns a configured OpenAI client instance if a valid API key is present,
 * or null if the key is missing, empty, or a placeholder.
 */
const getOpenAIClient = () => {
    const apiKey = process.env.OPENAI_API_KEY;

    // Check if key is absent or still has placeholder value
    if (!apiKey || apiKey.trim() === "" || apiKey === "your_openai_api_key_here") {
        return null;
    }

    return new OpenAI({
        apiKey: apiKey.trim(),
        timeout: 10000 // 10s request timeout
    });
};

module.exports = {
    getOpenAIClient
};
