const express = require('express');
const router = express.Router();
const tpController = require('../controllers/tpController');
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
router.post('/register', tpController.registerTP);

// TP login endpoint
router.post('/login', tpController.loginTP);

// TP deactivation endpoint
router.post('/deactivate', tpController.deactivateTP);

// TP activation endpoint
router.post('/activate', tpController.activateTP);

module.exports = router;
