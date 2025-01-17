const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');

/**
 * @swagger
 * tags:
 *   name: Assessments
 *   description: API for managing assessments
 */

/**
 * @swagger
 * /api/assessments:
 *   get:
 *     summary: Get all assessments
 *     tags: [Assessments]
 *     responses:
 *       200:
 *         description: List of all assessments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Assessment'
 *   post:
 *     summary: Create a new assessment
 *     tags: [Assessments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Assessment'
 *     responses:
 *       201:
 *         description: Assessment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assessment'
 */

// Create a new assessment
router.post('/create', async (req, res) => {
  const { name, time, date, subject, metadata, numberOfQuestions, difficulty } = req.body;
  try {
    const assessment = await Assessment.create({ name, time, date, subject, metadata, numberOfQuestions, difficulty });
    res.status(201).json({
      success: true,
      data: assessment
    });
  } catch (err) {
    console.error('Error creating assessment:', err.message);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// Get all assessments
router.get('/', async (req, res) => {
  try {
    const assessments = await Assessment.find();
    res.status(200).json({
      success: true,
      data: assessments
    });
  } catch (err) {
    console.error('Error fetching assessments:', err.message);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// Get a single assessment by ID
router.get('/:id', async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }
    res.status(200).json({
      success: true,
      data: assessment
    });
  } catch (err) {
    console.error('Error fetching assessment:', err.message);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// Update an assessment by ID
router.put('/:id', async (req, res) => {
  const { name, time, date, subject, metadata, numberOfQuestions, difficulty } = req.body;
  try {
    const assessment = await Assessment.findByIdAndUpdate(req.params.id, { name, time, date, subject, metadata, numberOfQuestions, difficulty, updatedAt: Date.now() }, { new: true, runValidators: true });
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }
    res.status(200).json({
      success: true,
      data: assessment
    });
  } catch (err) {
    console.error('Error updating assessment:', err.message);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// Delete an assessment by ID
router.delete('/:id', async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndDelete(req.params.id);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error('Error deleting assessment:', err.message);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
