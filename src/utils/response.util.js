exports.sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

exports.sendError = (res, error, statusCode = 500) => {
    res.status(statusCode).json({
        success: false,
        error: error.message || 'Internal Server Error',
    });
};
