const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Assessment = require('../models/Assessment');

/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: API for managing questions
 */

/**
 * @swagger
 * /questions:
 *   get:
 *     summary: Get all questions
 *     tags: [Questions]
 *     responses:
 *       200:
 *         description: List of all questions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Question'
 *   post:
 *     summary: Create a new question
 *     tags: [Questions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Question'
 *     responses:
 *       201:
 *         description: Question created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 */

// Create a new question
router.post('/create', async (req, res) => {
  const { questions, options, difficulty, marks, correctAnswer, qp, nos, pc, createdBy, connectedToAssessments } = req.body;
  try {
    const question = await Question.create({ questions, options, difficulty, marks, correctAnswer, qp, nos, pc, createdBy, connectedToAssessments });
    res.status(201).json({
      success: true,
      data: question
    });
  } catch (err) {
    console.error('Error creating question:', err.message);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// Get all questions
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find().populate('connectedToAssessments', 'name');
    res.status(200).json({
      success: true,
      data: questions
    });
  } catch (err) {
    console.error('Error fetching questions:', err.message);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// Get a single question by ID
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate('connectedToAssessments', 'name');
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    res.status(200).json({
      success: true,
      data: question
    });
  } catch (err) {
    console.error('Error fetching question:', err.message);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// Update a question by ID
router.put('/:id', async (req, res) => {
  const { questions, options, difficulty, marks, correctAnswer, qp, nos, pc, connectedToAssessments, active } = req.body;
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, { questions, options, difficulty, marks, correctAnswer, qp, nos, pc, connectedToAssessments, active, modifiedTime: Date.now() }, { new: true, runValidators: true });
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    res.status(200).json({
      success: true,
      data: question
    });
  } catch (err) {
    console.error('Error updating question:', err.message);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// Delete a question by ID
router.delete('/:id', async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error('Error deleting question:', err.message);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// Get random questions based on assessment information
router.get('/random/:assessmentId', async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.assessmentId);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    const { difficulty } = assessment;
    const questions = [];

    const easyQuestions = await Question.aggregate([
      { $match: { difficulty: 'easy', connectedToAssessments: assessment._id } },
      { $sample: { size: difficulty.easy } }
    ]);

    const mediumQuestions = await Question.aggregate([
      { $match: { difficulty: 'medium', connectedToAssessments: assessment._id } },
      { $sample: { size: difficulty.medium } }
    ]);

    const hardQuestions = await Question.aggregate([
      { $match: { difficulty: 'hard', connectedToAssessments: assessment._id } },
      { $sample: { size: difficulty.hard } }
    ]);

    if (easyQuestions.length !== difficulty.easy || mediumQuestions.length !== difficulty.medium || hardQuestions.length !== difficulty.hard) {
      return res.status(400).json({
        success: false,
        message: 'Unable to fetch the required number of questions for each difficulty level'
      });
    }

    questions.push(...easyQuestions, ...mediumQuestions, ...hardQuestions);

    res.status(200).json({
      success: true,
      data: questions
    });
  } catch (err) {
    console.error('Error fetching random questions:', err.message);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
