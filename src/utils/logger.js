const fs = require('fs');
const path = require('path');
const winston = require('winston');
require('winston-daily-rotate-file');

const logDir = path.join(__dirname, '../../logs');

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.DailyRotateFile({
            filename: path.join(logDir, 'api-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
            maxSize: '20m'
        }),
        new winston.transports.DailyRotateFile({
            filename: path.join(logDir, 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
            maxSize: '20m',
            level: 'error'
        })
    ]
});

const logAPICall = (req, res, responseTime) => {
    logger.info({
        method: req.method,
        path: req.path,
        status: res.statusCode,
        responseTime,
        ip: req.ip,
        userAgent: req.headers['user-agent']
    });
};

const logError = (error, req) => {
    logger.error({
        message: error.message,
        stack: error.stack,
        path: req?.path,
        method: req?.method,
        ip: req?.ip
    });
};

module.exports = { logger, logAPICall, logError };
