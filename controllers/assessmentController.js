const Assessment = require('../models/assessmentModel');
const Candidate = require('../models/candidateModel');
const Image = require('../models/imageModel');
const sharp = require('sharp');

exports.saveAssessmentResult = async (req, res, next) => {
  try {
    const { candidateId, date, questions, totalMarks, percentage, assessmentType } = req.body;

    // Check if the candidate has already taken this assessment type
    const existingAssessment = await Assessment.findOne({ candidateId, assessmentType });
    if (existingAssessment) {
      return res.status(400).json({ success: false, message: 'Candidate has already taken this assessment' });
    }

    const assessment = new Assessment({ candidateId, date, questions, totalMarks, percentage, assessmentType });
    await assessment.save();

    res.status(201).json({ success: true, data: assessment });
  } catch (err) {
    next(err);
  }
};

exports.getAssessmentsByCandidateId = async (req, res, next) => {
  try {
    const assessments = await Assessment.find({ candidateId: req.params.candidateId }).populate('aadharPhoto profilePhoto');
    const assessmentsWithBase64 = await Promise.all(assessments.map(async assessment => {
      if (assessment.aadharPhoto) {
        const aadharPhoto = await Image.findById(assessment.aadharPhoto);
        assessment.aadharPhoto = {
          ...aadharPhoto.toObject(),
          data: aadharPhoto.data.toString('base64')
        };
      }
      if (assessment.profilePhoto) {
        const profilePhoto = await Image.findById(assessment.profilePhoto);
        assessment.profilePhoto = {
          ...profilePhoto.toObject(),
          data: profilePhoto.data.toString('base64')
        };
      }
      return assessment;
    }));
    res.status(200).json({ success: true, data: assessmentsWithBase64 });
  } catch (err) {
    next(err);
  }
};

exports.uploadAadharPhoto = async (req, res, next) => {
  try {
    const { buffer } = req.file;
    const { aadharNumber } = req.body;

    const candidate = await Candidate.findOne({ aadharNumber });
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    const compressedImage = await sharp(buffer).resize({ width: 800 }).toBuffer();
    const image = new Image({
      name: 'Aadhar Photo',
      data: compressedImage,
      contentType: req.file.mimetype,
      aadharNumber
    });
    await image.save();

    const assessment = await Assessment.findByIdAndUpdate(req.params.id, { aadharPhoto: image._id }, { new: true });
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }
    res.status(200).json({ success: true, data: assessment });
  } catch (err) {
    next(err);
  }
};

exports.uploadProfilePhoto = async (req, res, next) => {
  try {
    const { buffer } = req.file;
    const { aadharNumber } = req.body;

    const candidate = await Candidate.findOne({ aadharNumber });
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    const compressedImage = await sharp(buffer).resize({ width: 800 }).toBuffer();
    const image = new Image({
      name: 'Profile Photo',
      data: compressedImage,
      contentType: req.file.mimetype,
      aadharNumber
    });
    await image.save();

    const assessment = await Assessment.findByIdAndUpdate(req.params.id, { profilePhoto: image._id }, { new: true });
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }
    res.status(200).json({ success: true, data: assessment });
  } catch (err) {
    next(err);
  }
};
