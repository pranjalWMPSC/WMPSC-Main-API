const express = require('express');
const session = require('express-session');
const app = express();

const dashboardRoutes = require('./routes/dashboard');
const { requestLogger, errorLogger } = require('./middleware/loggerMiddleware');

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger middleware
app.use(requestLogger);

// Auth protection for dashboard
app.use((req, res, next) => {
    if (req.path === '/dashboard.html' && !req.session.isAuthenticated) {
        return res.redirect('/login.html');
    }
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Static files
app.use(express.static('public'));

// Error logger
app.use(errorLogger);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
