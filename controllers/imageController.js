const sharp = require('sharp');
const Image = require('../models/imageModel');
const Candidate = require('../models/candidateModel');

exports.uploadImage = async (req, res, next) => {
  try {
    const { originalname, buffer, mimetype } = req.file;
    const { aadharNumber } = req.body;

    // Compress the image using sharp
    const compressedImage = await sharp(buffer)
      .resize({ width: 800 }) // Resize the image to a width of 800px
      .toBuffer();

    const image = new Image({
      name: originalname,
      data: compressedImage,
      contentType: mimetype,
      aadharNumber
    });

    await image.save();

    res.status(201).json({
      success: true,
      data: {
        ...image.toObject(),
        data: image.data.toString('base64')
      }
    });
  } catch (err) {
    next(err);
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
