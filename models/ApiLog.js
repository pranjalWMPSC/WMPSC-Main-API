const mongoose = require('mongoose');

const apiLogSchema = new mongoose.Schema({
    method: String,
    path: String,
    statusCode: Number,
    responseTime: Number,
    timestamp: {
        type: Date,
        default: Date.now
    },
    error: {
        message: String,
        stack: String
    },
    userAgent: String,
    ip: String
});

module.exports = mongoose.model('ApiLog', apiLogSchema);
