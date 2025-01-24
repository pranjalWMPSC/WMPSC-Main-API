const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Candidate:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - gender
 *         - dateOfBirth
 *         - aadharNumber
 *         - mobileNumber
 *       properties:
 *         batchName:
 *           type: string
 *           description: Batch Name / Batch ID
 *         firstName:
 *           type: string
 *           description: First Name
 *         middleName:
 *           type: string
 *           description: Middle Name
 *         lastName:
 *           type: string
 *           description: Last Name
 *         gender:
 *           type: string
 *           enum: [M, F, Other]
 *           description: Gender (M/F/Other)
 *         captainProfession:
 *           type: string
 *           description: Captain Profession
 *         professionSinceYear:
 *           type: string
 *           description: In Profession Since (YYYY)
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: Date of Birth (As per ID Proof)
 *         age:
 *           type: number
 *           description: Age in years
 *         aadharNumber:
 *           type: string
 *           description: Aadhar Number (Must be unique)
 *           uniqueItems: true
 *           pattern: '^[0-9]{12}$'
 *           example: '123456789012'
 *         mobileNumber:
 *           type: string
 *           description: Mobile Number
 *         hasSmartPhone:
 *           type: boolean
 *           description: Smart Phone available (Y/N)
 *         whatsappNumber:
 *           type: string
 *           description: WhatsApp Number
 *         permanentAddress:
 *           type: object
 *           properties:
 *             fullAddress:
 *               type: string
 *             matchesIdProof:
 *               type: boolean
 *             state:
 *               type: string
 *             district:
 *               type: string
 *             tehsil:
 *               type: string
 *             pinCode:
 *               type: string
 *         currentAddress:
 *           type: object
 *           properties:
 *             fullAddress:
 *               type: string
 *             matchesIdProof:
 *               type: boolean
 *             state:
 *               type: string
 *             district:
 *               type: string
 *             tehsil:
 *               type: string
 *             pinCode:
 *               type: string
 *         policeVerificationAvailable:
 *           type: boolean
 *           description: Police Verification Available (Y/N)
 *         maritalStatus:
 *           type: string
 *           enum: [Single, Married, Divorced, Widowed]
 *         dateOfAnniversary:
 *           type: string
 *           format: date
 *           description: Date of Anniversary
 *         numberOfKids:
 *           type: number
 *           description: Number of Kids
 *         bankDetails:
 *           type: object
 *           properties:
 *             bankName:
 *               type: string
 *             branch:
 *               type: string
 *             ifscCode:
 *               type: string
 *             accountNumber:
 *               type: string
 *             linkedMobileNumber:
 *               type: string
 *             upiId:
 *               type: string
 *         assessment:
 *           type: object
 *           properties:
 *             scheduledMeetingDate:
 *               type: string
 *               format: date
 *             assessmentDate:
 *               type: string
 *               format: date
 *             examStatus:
 *               type: string
 *             certificateAwarded:
 *               type: boolean
 *             certificateDistributionDate:
 *               type: string
 *               format: date
 *         systemApproval:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *             captainId:
 *               type: string
 *         documents:
 *           type: object
 *           properties:
 *             aadharCard:
 *               type: string
 *               description: ID Proof (Aadhar Card - both sides)
 *             bankProof:
 *               type: object
 *               properties:
 *                 provided:
 *                   type: boolean
 *                 documentType:
 *                   type: string
 *             upiProof:
 *               type: object
 *               properties:
 *                 provided:
 *                   type: boolean
 *                 document:
 *                   type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: Candidates
 *   description: API for managing candidates
 */

/**
 * @swagger
 * /api/candidates:
 *   get:
 *     summary: Get all candidates
 *     tags: [Candidates]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, blocked]
 *         description: Filter by candidate status
 *     responses:
 *       200:
 *         description: List of candidates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Candidate'
 *   post:
 *     summary: Create a new candidate
 *     tags: [Candidates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Candidate'
 *     responses:
 *       201:
 *         description: Candidate created successfully
 *       400:
 *         description: Invalid request or Aadhar number already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Aadhar number already exists'
 */

// Define routes in order of specificity (most specific first)
// 1. Static routes
router.get('/search/:aadhar', candidateController.searchByAadhar); // Add direct aadhar parameter route
router.get('/search', candidateController.searchByAadhar);         // Keep query parameter route as fallback
// router.get('/health', candidateController.healthCheck);
router.post('/bulk', candidateController.bulkCreateCandidates); // Bulk create endpoint

// 2. TP Email routes (specific before general ID routes)
router.get('/tp/:tpEmail/batches', candidateController.getTPBatches);
router.get('/tp/:tpEmail', candidateController.getCandidatesByTP);

// 3. Batch routes
router.get('/batch/:batchId/tp/:tpEmail', candidateController.getCandidatesByBatch);

// 4. General CRUD routes
router.get('/', candidateController.getAllCandidates);
router.post('/', candidateController.createCandidate);
router.get('/:id', candidateController.getCandidateById);
router.put('/:id', candidateController.updateCandidate);
router.delete('/:id', candidateController.deleteCandidate);

module.exports = router;