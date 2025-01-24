const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.protect = (req, res, next) => {
    console.log('Protect middleware executed');
    // Add your authentication logic here
    next();
};
