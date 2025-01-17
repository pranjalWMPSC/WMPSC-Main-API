const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const logDir = path.join(__dirname, '../../logs');

router.get('/api/dashboard/stats', async (req, res) => {
    try {
        const { date = new Date().toISOString().split('T')[0] } = req.query;
        const logFile = path.join(logDir, `api-${date}.log`);
        const errorFile = path.join(logDir, `error-${date}.log`);
        
        const logs = fs.existsSync(logFile) 
            ? fs.readFileSync(logFile, 'utf-8').split('\n').filter(Boolean).map(JSON.parse)
            : [];
            
        const errors = fs.existsSync(errorFile)
            ? fs.readFileSync(errorFile, 'utf-8').split('\n').filter(Boolean).map(JSON.parse)
            : [];

        const stats = {
            totalRequests: logs.length,
            errorCount: errors.length,
            statusCodes: logs.reduce((acc, log) => {
                acc[log.status] = (acc[log.status] || 0) + 1;
                return acc;
            }, {}),
            averageResponseTime: logs.reduce((sum, log) => sum + log.responseTime, 0) / logs.length || 0,
            topEndpoints: getTopEndpoints(logs),
            recentErrors: errors.slice(-5)
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
});

function getTopEndpoints(logs) {
    const endpoints = {};
    logs.forEach(log => {
        endpoints[log.path] = (endpoints[log.path] || 0) + 1;
    });
    return Object.entries(endpoints)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
}

module.exports = router;
