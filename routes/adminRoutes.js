const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

// Admin routes
router.post('/login', adminController.login);
router.post('/create', protect, adminController.createAdmin); // Protect this route
router.get('/tps', protect, adminController.listAllTPs); // Protect this route
router.get('/candidates/completed', protect, adminController.countCompletedCandidates); // Protect this route
router.get('/candidates/tp/:tpId', protect, adminController.listCandidatesByTP); // Protect this route
router.get('/candidates/batch/:batchId/tp/:tpId', protect, adminController.listCandidatesByBatch); // Update this line
router.post('/assessments', protect, adminController.createAssessment); // Protect this route
router.post('/questions', protect, adminController.uploadQuestion); // Protect this route
router.get('/assessments', protect, adminController.listAllAssessments); // Add this line
router.get('/assessments/:assessmentId/questions', protect, adminController.listQuestionsByAssessment); // Add this line
router.get('/tp/:tpId/batches', protect, adminController.listBatchesByTP); // Add this line

module.exports = router;
