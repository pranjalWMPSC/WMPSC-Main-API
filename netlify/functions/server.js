require('dotenv').config(); // Add this line at the top

const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const BSON = require('bson'); // Ensure BSON is imported
const cors = require('cors');
const { 
  errorHandler, 
  handleCastErrorDB, 
  handleValidationErrorDB, 
  handleDuplicateFieldsDB, 
  AppError 
} = require('../../utils/errorHandler');
const { requestLogger, errorLogger } = require('../../middleware/loggerMiddleware');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const { specs } = require('../../swagger');
const candidateController = require('../../controllers/candidateController');
const adminController = require('../../controllers/adminController'); // Ensure this line is correct
const { protect } = require('../../middleware/authMiddleware'); // Import the protect middleware

// Log the protect middleware
console.log(protect);

// Initialize express app
const app = express();
const router = express.Router();

// Add error handling middleware first
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Database connection with retry logic
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
      socketTimeoutMS: 45000, // Increase timeout to 45 seconds
      connectTimeoutMS: 30000, // Increase timeout to 30 seconds
      keepAlive: true,
      keepAliveInitialDelay: 300000,
      family: 4,
      authSource: 'admin',
      writeConcern: {
        w: 'majority',
        j: true,
        wtimeout: 1000
      },
      dbName: 'kbl-database'
    };

    await mongoose.set('strictQuery', false);
    const connection = await mongoose.connect(process.env.MONGODB_URI, options);
    isConnected = mongoose.connection.readyState === 1;
    console.log(`MongoDB Connected to: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add CORS configuration
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Session configuration update
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'yourSecretKey',
  resave: true, // Changed to true
  saveUninitialized: true, // Changed to true
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    sameSite: 'lax'
  },
  name: 'wmpsc.sid' // Add custom session name
};

// Update MongoStore configuration
if (process.env.MONGODB_URI) {
  sessionConfig.store = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60,
    autoRemove: 'native',
    touchAfter: 24 * 3600,
    stringify: false,
    crypto: {
      secret: process.env.SESSION_SECRET || 'yourSecretKey'
    }
  });
}

// Add session middleware
app.use(session(sessionConfig));

// Logging middleware
app.use(requestLogger);

// Update route mounting order
router.use((req, res, next) => {
  console.log('Session ID:', req.sessionID);
  console.log('Session:', req.session);
  next();
});

// Test route
router.get('/test', asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is working correctly',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
}));

// Special routes first - Update with correct candidateController reference
router.get('/candidates/search/:aadhar', candidateController.searchByAadhar);
router.get('/candidates/search', candidateController.searchByAadhar);
router.get('/candidates/tp/:tpEmail/batches', candidateController.getTPBatches);
router.get('/candidates/tp/:tpEmail', candidateController.getCandidatesByTP);
router.get('/candidates/batch/:batchId/tp/:tpEmail', candidateController.getCandidatesByBatch); // Update this line

// Admin routes
router.post('/admin/login', adminController.login);
router.post('/admin/create', protect, adminController.createAdmin); // Protect this route
router.get('/admin/tps', protect, adminController.listAllTPs); // Protect this route
router.get('/admin/candidates/completed', protect, adminController.countCompletedCandidates); // Protect this route
router.get('/admin/candidates/tp/:tpId', protect, adminController.listCandidatesByTP); // Protect this route
router.get('/admin/candidates/batch/:batchId/tp/:tpId', protect, adminController.listCandidatesByBatch); // Update this line
router.post('/admin/assessments', protect, adminController.createAssessment); // Protect this route
router.post('/admin/questions', protect, adminController.uploadQuestion); // Protect this route
router.get('/admin/assessments', protect, adminController.listAllAssessments); // Add this line
router.get('/admin/assessments/:assessmentId/questions', protect, asyncHandler(adminController.listQuestionsByAssessment)); // Add this line
router.get('/admin/tp/:tpId/batches', protect, asyncHandler(adminController.listBatchesByTP)); // Add this line

// Database health check route
router.get('/health', asyncHandler(async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    const ping = await mongoose.connection.db.admin().ping();

    res.status(200).json({
      success: true,
      database: {
        state: states[dbState],
        connected: dbState === 1,
        ping: ping.ok === 1 ? 'successful' : 'failed',
        host: mongoose.connection.host,
        name: mongoose.connection.name
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Database health check failed',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}));

// Import routes
const tpRoutes = require('../../routes/tpRoutes');
const assessmentRoutes = require('../../routes/assessmentRoutes');
const questionRoutes = require('../../routes/questionRoutes');
const candidateRoutes = require('../../routes/candidateRoutes');
const imageRoutes = require('../../routes/imageRoutes');
const authRoutes = require('../../routes/auth');
// const dashboardRoutes = require('../../routes/dashboardRoutes');
const adminRoutes = require('../../routes/adminRoutes'); // Add this line

// Mount routes on router (without /api prefix since it's in redirects)
router.use('/auth', authRoutes);
router.use('/tp', tpRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/questions', questionRoutes);
router.use('/candidates', candidateRoutes);
router.use('/images', imageRoutes);
// router.use('/dashboard', dashboardRoutes);
router.use('/admin', adminRoutes); // Add this line

// Update route handlers - Remove this section since we're using the controller
// router.delete('/candidates/:id', async (req, res) => { ... }); // Remove this

// Base path for API
app.use('/.netlify/functions/server', router);

// Error handling
app.use(errorLogger);

// Error handling middleware (place before the handler)
app.use((err, req, res, next) => {
  if (!err) return next();
  
  console.error('Error caught in middleware:', err);
  
  if (err.name === 'CastError') err = handleCastErrorDB(err);
  if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
  if (err.code === 11000) err = handleDuplicateFieldsDB(err);
  
  errorHandler(err, req, res, next);
});

app.use(errorHandler);

// Create handler with connection guarantee
const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    if (!process.env.MONGODB_URI) {
      throw new AppError('Database configuration is missing', 500);
    }
    
    await connectDB();
    console.log('Request path:', event.path);
    console.log('Request method:', event.httpMethod);
    
    const result = await serverless(app)(event, context);
    return result;
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        success: false,
        message: error.message || 'Internal server error',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};

// Export the handler function for Netlify
module.exports.handler = handler;
