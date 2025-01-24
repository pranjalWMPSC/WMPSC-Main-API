const fs = require('fs').promises;
const path = require('path');
const Image = require('../models/imageModel');
const Candidate = require('../models/candidateModel');

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileName = `${Date.now()}-${req.file.originalname}`;
    const uploadPath = path.join(__dirname, '../public/uploads', fileName);

    await fs.mkdir(path.dirname(uploadPath), { recursive: true });
    await fs.writeFile(uploadPath, req.file.buffer);

    res.status(200).json({
      success: true,
      url: `/uploads/${fileName}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getImageByAadharNumber = async (req, res, next) => {
  try {
    const images = await Image.find({ aadharNumber: req.params.aadharNumber });
    const imagesWithBase64 = images.map(image => ({
      ...image.toObject(),
      data: image.data.toString('base64')
    }));
    res.status(200).json({
      success: true,
      data: imagesWithBase64
    });
  } catch (err) {
    next(err);
  }
};
