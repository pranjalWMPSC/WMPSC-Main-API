const express = require('express');
const router = express.Router();
const ApiLog = require('../models/ApiLog');

router.get('/stats', async (req, res) => {
    try {
        const date = req.query.date ? new Date(req.query.date) : new Date();
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        // Get total requests
        const totalRequests = await ApiLog.countDocuments({
            timestamp: { $gte: startOfDay, $lte: endOfDay }
        });

        // Get error count
        const errorCount = await ApiLog.countDocuments({
            timestamp: { $gte: startOfDay, $lte: endOfDay },
            statusCode: { $gte: 400 }
        });

        // Get average response time
        const avgResponse = await ApiLog.aggregate([
            {
                $match: {
                    timestamp: { $gte: startOfDay, $lte: endOfDay },
                    responseTime: { $exists: true }
                }
            },
            {
                $group: {
                    _id: null,
                    averageResponseTime: { $avg: '$responseTime' }
                }
            }
        ]);

        // Get status code distribution
        const statusCodes = await ApiLog.aggregate([
            {
                $match: {
                    timestamp: { $gte: startOfDay, $lte: endOfDay }
                }
            },
            {
                $group: {
                    _id: '$statusCode',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get top endpoints
        const topEndpoints = await ApiLog.aggregate([
            {
                $match: {
                    timestamp: { $gte: startOfDay, $lte: endOfDay }
                }
            },
            {
                $group: {
                    _id: '$path',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 5
            }
        ]);

        // Get recent errors
        const recentErrors = await ApiLog.find({
            timestamp: { $gte: startOfDay, $lte: endOfDay },
            'error.message': { $exists: true }
        })
        .sort({ timestamp: -1 })
        .limit(10)
        .select('path error.message timestamp');

        res.json({
            totalRequests,
            errorCount,
            averageResponseTime: avgResponse[0]?.averageResponseTime || 0,
            statusCodes: Object.fromEntries(statusCodes.map(s => [s._id, s.count])),
            topEndpoints: Object.fromEntries(topEndpoints.map(e => [e._id, e.count])),
            recentErrors: recentErrors.map(e => ({
                path: e.path,
                message: e.error.message,
                timestamp: e.timestamp
            }))
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Error fetching dashboard stats' });
    }
});

// Add new endpoint for detailed reports
router.get('/detailed-stats', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const start = new Date(startDate);
        const end = new Date(endDate);

        const detailedStats = await ApiLog.aggregate([
            {
                $match: {
                    timestamp: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                        path: "$path",
                        method: "$method",
                        statusCode: "$statusCode"
                    },
                    count: { $sum: 1 },
                    avgResponseTime: { $avg: "$responseTime" },
                    errors: {
                        $push: {
                            $cond: [
                                { $gte: ["$statusCode", 400] },
                                {
                                    message: "$error.message",
                                    timestamp: "$timestamp"
                                },
                                null
                            ]
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$_id.date",
                    endpoints: {
                        $push: {
                            path: "$_id.path",
                            method: "$_id.method",
                            statusCode: "$_id.statusCode",
                            count: "$count",
                            avgResponseTime: "$avgResponseTime",
                            errors: {
                                $filter: {
                                    input: "$errors",
                                    as: "error",
                                    cond: { $ne: ["$$error", null] }
                                }
                            }
                        }
                    }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.json(detailedStats);
    } catch (error) {
        console.error('Error fetching detailed stats:', error);
        res.status(500).json({ error: 'Error fetching detailed statistics' });
    }
});

// Add endpoint for specific route analysis
router.get('/route-analysis/:path', async (req, res) => {
    try {
        const { path } = req.params;
        const { date } = req.query;
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const analysis = await ApiLog.aggregate([
            {
                $match: {
                    path: decodeURIComponent(path),
                    timestamp: { $gte: startOfDay, $lte: endOfDay }
                }
            },
            {
                $group: {
                    _id: "$statusCode",
                    count: { $sum: 1 },
                    avgResponseTime: { $avg: "$responseTime" },
                    errors: {
                        $push: {
                            $cond: [
                                { $gte: ["$statusCode", 400] },
                                {
                                    message: "$error.message",
                                    timestamp: "$timestamp",
                                    userAgent: "$userAgent",
                                    ip: "$ip"
                                },
                                null
                            ]
                        }
                    }
                }
            }
        ]);

        res.json(analysis);
    } catch (error) {
        console.error('Error fetching route analysis:', error);
        res.status(500).json({ error: 'Error fetching route analysis' });
    }
});

module.exports = router;
