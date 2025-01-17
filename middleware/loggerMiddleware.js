const { logAPICall, logError } = require('../utils/logger');

const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    // Capture the original end
    const originalEnd = res.end;
    res.end = function(...args) {
        const duration = Date.now() - start;
        
        // Log 404 errors
        if (res.statusCode === 404) {
            logError({
                message: `Route not found: ${req.method} ${req.path}`,
                status: 404
            }, req);
        }
        
        logAPICall(req, res, duration);
        originalEnd.apply(res, args);
    };

    next();
};

const errorLogger = (err, req, res, next) => {
    logError(err, req);
    next(err);
};

module.exports = { requestLogger, errorLogger };
