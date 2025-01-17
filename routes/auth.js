const express = require('express');
const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Debug logging
        console.log('Login attempt:', {
            providedUsername: username,
            expectedUsername: process.env.ADMIN_USERNAME,
            providedPassword: password,
            expectedPassword: process.env.ADMIN_PASSWORD
        });

        // Check if environment variables are set
        if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
            console.error('Admin credentials not set in environment variables');
            return res.status(500).json({ 
                success: false, 
                message: 'Server configuration error' 
            });
        }

        // Validate credentials
        if (username === process.env.ADMIN_USERNAME && 
            password === process.env.ADMIN_PASSWORD) {
            req.session.isAuthenticated = true;
            console.log('Login successful');
            return res.json({ 
                success: true, 
                redirect: '/dashboard.html' 
            });
        } else {
            console.log('Login failed: Invalid credentials');
            res.status(401).json({ 
                success: false, 
                message: 'Invalid username or password' 
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error logging out' });
        }
        res.clearCookie('connect.sid');
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

module.exports = router;
