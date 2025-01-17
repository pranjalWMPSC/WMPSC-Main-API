const ApiLog = require('../models/ApiLog');

const logAPICall = async (req, res, duration) => {
    try {
        await ApiLog.create({
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            responseTime: duration,
            userAgent: req.get('user-agent'),
            ip: req.ip
        });
    } catch (error) {
        console.error('Logging error:', error);
    }
};

const logError = async (err, req) => {
    try {
        await ApiLog.create({
            method: req.method,
            path: req.path,
            statusCode: 500,
            error: {
                message: err.message,
                stack: err.stack
            },
            userAgent: req.get('user-agent'),
            ip: req.ip
        });
    } catch (error) {
        console.error('Error logging error:', error);
    }
};

module.exports = { logAPICall, logError };
