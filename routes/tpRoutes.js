const express = require('express');
const router = express.Router();
const Tp = require('../models/Tp');

/**
 * @swagger
 * tags:
 *   name: TPs
 *   description: API for managing TPs
 */

/**
 * @swagger
 * /tp:
 *   get:
 *     summary: Get all TPs
 *     tags: [TPs]
 *     responses:
 *       200:
 *         description: List of all TPs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TP'
 *   post:
 *     summary: Create a new TP
 *     tags: [TPs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TP'
 *     responses:
 *       201:
 *         description: TP created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TP'
 */

/**
 * @swagger
 * /tp/register:
 *   post:
 *     summary: Register a new TP
 *     tags: [TPs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TP'
 *     responses:
 *       201:
 *         description: TP registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TP'
 */

/**
 * @swagger
 * /tp/login:
 *   post:
 *     summary: Login a TP
 *     tags: [TPs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: TP logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TP'
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /tp/deactivate:
 *   post:
 *     summary: Deactivate a TP
 *     tags: [TPs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: TP deactivated successfully
 *       404:
 *         description: TP not found
 */

/**
 * @swagger
 * /tp/activate:
 *   post:
 *     summary: Activate a TP
 *     tags: [TPs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: TP activated successfully
 *       404:
 *         description: TP not found
 */

// Define your routes here
router.get('/', (req, res) => {
  res.send('TP Routes');
});

// TP registration endpoint
router.post('/register', async (req, res) => {
  const { name, email, password, spocName, mobileNumber } = req.body;
  try {
    console.log('Registering TP:', { name, email, password, spocName, mobileNumber });
    const tp = await Tp.create({ name, email, password, spocName, mobileNumber });
    res.status(201).json({
      success: true,
      data: tp
    });
  } catch (err) {
    console.error('Error registering TP:', err.message);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// TP login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const tp = await Tp.findOne({ email, status: 'active' }).select('+password');
    if (!tp) {
      console.error('TP not found');
      return res.status(401).json({ success: false, message: 'Invalid credentials: TP not found' });
    }
    console.log('TP found:', tp);
    const isMatch = await tp.matchPassword(password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      console.error('Invalid password');
      return res.status(401).json({ success: false, message: 'Invalid credentials: Invalid password' });
    }
    res.status(200).json({ success: true, data: tp });
  } catch (err) {
    console.error('Error logging in TP:', err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

// TP deactivation endpoint
router.post('/deactivate', async (req, res) => {
  const { email } = req.body;
  try {
    const tp = await Tp.findOneAndUpdate({ email }, { status: 'deactive' }, { new: true });
    if (!tp) {
      console.error('TP not found');
      return res.status(404).json({ success: false, message: 'TP not found' });
    }
    res.status(200).json({ success: true, data: tp });
  } catch (err) {
    console.error('Error deactivating TP:', err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

// TP activation endpoint
router.post('/activate', async (req, res) => {
  const { email } = req.body;
  try {
    const tp = await Tp.findOneAndUpdate({ email }, { status: 'active' }, { new: true });
    if (!tp) {
      console.error('TP not found');
      return res.status(404).json({ success: false, message: 'TP not found' });
    }
    res.status(200).json({ success: true, data: tp });
  } catch (err) {
    console.error('Error activating TP:', err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
