const express = require('express');
const multer = require('multer');
const imageController = require('../controllers/imageController');

/**
 * @swagger
 * tags:
 *   name: Images
 *   description: API for managing images
 */

/**
 * @swagger
 * /api/images:
 *   get:
 *     summary: Get all images
 *     tags: [Images]
 *     responses:
 *       200:
 *         description: List of all images
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Image'
 *   post:
 *     summary: Upload a new image
 *     tags: [Images]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Image'
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Image'
 */

const router = express.Router();
const upload = multer();

// Route for uploading an image
router.post('/upload', upload.single('image'), imageController.uploadImage);

// Route for retrieving images by Aadhar number
router.get('/aadhar/:aadharNumber', imageController.getImageByAadharNumber);

module.exports = router;
