const mongoose = require('mongoose');

const getMongoStatus = () => {
    const state = mongoose.connection.readyState;
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };
    
    return {
        status: states[state] || 'unknown',
        connected: state === 1,
        timestamp: new Date().toISOString()
    };
};

module.exports = { getMongoStatus };
