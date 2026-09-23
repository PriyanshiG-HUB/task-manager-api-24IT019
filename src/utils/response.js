/**
 * Standard Success Response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Response message
 * @param {any} data - Response payload data
 */
const sendSuccess = (res, statusCode = 200, message = "Success", data = null) => {
    const response = {
        success: true,
        message
    };
    if (arguments.length >= 4 || (data !== null && data !== undefined)) {
        response.data = data;
    }
    return res.status(statusCode).json(response);
};

/**
 * Standard Error Response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {any} details - Additional error details or field errors
 */
const sendError = (res, statusCode = 500, message = "Server Error", details = null) => {
    const response = {
        success: false,
        message
    };
    if (details !== null && details !== undefined) {
        response.details = details;
    }
    return res.status(statusCode).json(response);
};

module.exports = {
    sendSuccess,
    sendError
};
