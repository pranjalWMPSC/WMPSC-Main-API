const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose'); // Add mongoose
const { errorHandler } = require('./utils/errorHandler');
const swaggerUi = require('swagger-ui-express');
const { specs } = require('./swagger');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { requestLogger, errorLogger } = require('./middleware/loggerMiddleware'); // Updated path
const dashboardRoutes = require('./routes/dashboardRoutes');

// Load env vars
dotenv.config();
console.log(`SWAGGER_USER: ${process.env.SWAGGER_USER}`);
console.log(`SWAGGER_PASSWORD: ${process.env.SWAGGER_PASSWORD}`);

// Connect to database with error handling
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      serverSelectionTimeoutMS: 5000
    });
    isConnected = true;
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Initialize database connection
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve public directory
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions'
  })
}));

// Add logger middleware
app.use(requestLogger);

// Basic auth middleware for Swagger
const swaggerAuth = (req, res, next) => {
  if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
    res.set('WWW-Authenticate', 'Basic realm="Secure Area"');
    return res.status(401).send('Authentication required.');
  }

  const base64Credentials = req.headers.authorization.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  if (username === process.env.SWAGGER_USER && password === process.env.SWAGGER_PASSWORD) {
    next();
  } else {
    res.set('WWW-Authenticate', 'Basic realm="Secure Area"');
    return res.status(401).send('Invalid credentials');
  }
};

// Swagger setup with basic auth
app.use('/api-docs', swaggerAuth, swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customSiteTitle: "WMPSC API Documentation"
}));

// Route files - Fix TP routes import
const tpRoutes = require('./routes/tpRoutes'); // Changed from process.env.TP_ROUTES_PATH
const assessmentRoutes = require('./routes/assessmentRoutes');
const questionRoutes = require('./routes/questionRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const imageRoutes = require('./routes/imageRoutes');
const authRoutes = require('./routes/auth'); // Updated path

// Mount routers
app.use('/api/auth', authRoutes); // Add this line to handle auth routes
app.use('/tp', tpRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/questions', questionRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Update the root route to handle both / and /login
app.get(['/', '/login'], (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Protected route middleware
const authMiddleware = (req, res, next) => {
    if (req.session.isAuthenticated) {
        next();
    } else {
        res.redirect('/login.html');
    }
};

// Protect swagger docs
app.use('/api-docs', authMiddleware, swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customSiteTitle: "WMPSC API Documentation"
}));

// Error logger should be before error handler
app.use(errorLogger);

// Error handler
app.use(errorHandler);

// Only listen to port in development mode
if (process.env.NODE_ENV !== 'production') {
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`);
  });
}

// Export the Express app for Vercel
module.exports = app;

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`);
});
