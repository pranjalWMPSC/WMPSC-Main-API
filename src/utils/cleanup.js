const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');
const MAX_AGE_DAYS = 14;

function cleanupOldLogs() {
    if (!fs.existsSync(logDir)) return;

    const files = fs.readdirSync(logDir);
    const now = Date.now();

    files.forEach(file => {
        const filePath = path.join(logDir, file);
        const stats = fs.statSync(filePath);
        const age = (now - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);

        if (age > MAX_AGE_DAYS) {
            fs.unlinkSync(filePath);
        }
    });
}

// Run cleanup daily
setInterval(cleanupOldLogs, 24 * 60 * 60 * 1000);
module.exports = { cleanupOldLogs };
