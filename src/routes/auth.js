// ...existing code...

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Validate credentials
        if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            req.session.isAuthenticated = true;
            // Change redirect from /api-docs to /dashboard.html
            return res.json({ 
                success: true, 
                redirect: '/dashboard.html' 
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ...existing code...
