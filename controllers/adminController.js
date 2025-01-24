const Admin = require('../models/adminModel'); // Ensure you have an admin model
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/appError');

// Admin login
exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const admin = await Admin.findOne({ username });
        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return next(new AppError('Invalid credentials', 401));
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        res.status(200).json({
            success: true,
            token
        });
    } catch (error) {
        next(error);
    }
};

// Create new admin
exports.createAdmin = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 12);
        const newAdmin = await Admin.create({ username, password: hashedPassword });

        res.status(201).json({
            success: true,
            data: newAdmin
        });
    } catch (error) {
        next(error);
    }
};

// List all TPs
exports.listAllTPs = async (req, res, next) => {
    try {
        const tps = await TP.find(); // Ensure you have a TP model
        res.status(200).json({
            success: true,
            data: tps
        });
    } catch (error) {
        next(error);
    }
};

// Count completed candidates
exports.countCompletedCandidates = async (req, res, next) => {
    try {
        const count = await Candidate.countDocuments({ status: 'completed' }); // Ensure you have a Candidate model
        res.status(200).json({
            success: true,
            count
        });
    } catch (error) {
        next(error);
    }
};

// List candidates by TP
exports.listCandidatesByTP = async (req, res, next) => {
    try {
        const { tpId } = req.params;
        const candidates = await Candidate.find({ tp: tpId }); // Ensure you have a Candidate model
        res.status(200).json({
            success: true,
            data: candidates
        });
    } catch (error) {
        next(error);
    }
};

// List candidates by batch
exports.listCandidatesByBatch = async (req, res, next) => {
    try {
        const { batchId, tpId } = req.params;
        const candidates = await Candidate.find({ batch: batchId, tp: tpId }); // Ensure you have a Candidate model
        res.status(200).json({
            success: true,
            data: candidates
        });
    } catch (error) {
        next(error);
    }
};

// Create assessment
exports.createAssessment = async (req, res, next) => {
    try {
        const assessment = await Assessment.create(req.body); // Ensure you have an Assessment model
        res.status(201).json({
            success: true,
            data: assessment
        });
    } catch (error) {
        next(error);
    }
};

// Upload question
exports.uploadQuestion = async (req, res, next) => {
    try {
        const question = await Question.create(req.body); // Ensure you have a Question model
        res.status(201).json({
            success: true,
            data: question
        });
    } catch (error) {
        next(error);
    }
};

// List all assessments
exports.listAllAssessments = async (req, res, next) => {
    try {
        const assessments = await Assessment.find(); // Ensure you have an Assessment model
        res.status(200).json({
            success: true,
            data: assessments
        });
    } catch (error) {
        next(error);
    }
};

// List questions by assessment
exports.listQuestionsByAssessment = async (req, res, next) => {
    try {
        const { assessmentId } = req.params;
        const questions = await Question.find({ assessment: assessmentId }); // Ensure you have a Question model
        res.status(200).json({
            success: true,
            data: questions
        });
    } catch (error) {
        next(error);
    }
};

// List batches by TP
exports.listBatchesByTP = async (req, res, next) => {
    try {
        const { tpId } = req.params;
        const batches = await Batch.find({ tp: tpId }); // Ensure you have a Batch model
        res.status(200).json({
            success: true,
            data: batches
        });
    } catch (error) {
        next(error);
    }
};
