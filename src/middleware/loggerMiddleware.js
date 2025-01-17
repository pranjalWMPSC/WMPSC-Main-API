const { logAPICall, logError } = require('../utils/logger');

const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        logAPICall(req, res, duration);
    });

    next();
};

const errorLogger = (err, req, res, next) => {
    logError(err, req);
    next(err);
};

module.exports = { requestLogger, errorLogger };
