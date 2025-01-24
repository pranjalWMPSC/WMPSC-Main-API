const Candidate = require('../models/candidateModel');
const TP = require('../models/tpModel');
const fs = require('fs').promises;
const path = require('path');
const AppError = require('../utils/appError');

const catchAsync = fn => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

exports.getAllCandidates = catchAsync(async (req, res, next) => {
  const candidates = await Candidate.find()
    .select('-__v')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: candidates.length,
    data: candidates
  });
});

exports.getCandidateById = catchAsync(async (req, res, next) => {
  const candidate = await Candidate.findById(req.params.id)
    .select('-__v');

  if (!candidate) {
    return next(new AppError('Candidate not found', 404));
  }

  res.status(200).json({
    success: true,
    data: candidate
  });
});

const processImage = async (file) => {
  if (!file) return null;
  const fileName = `${Date.now()}-${file.originalname}`;
  const filePath = path.join(__dirname, '../public/uploads', fileName);
  await fs.writeFile(filePath, file.buffer);
  return `/uploads/${fileName}`;
};

exports.createCandidate = catchAsync(async (req, res, next) => {
  try {
    // Sanitize Aadhar number
    const sanitizedAadhar = req.body.aadharNumber?.replace(/\D/g, '');
    console.log('Processing Aadhar:', sanitizedAadhar);

    // Check for existing candidate explicitly
    const existingCandidate = await Candidate.findOne({ 
      aadharNumber: sanitizedAadhar 
    });

    if (existingCandidate) {
      return res.status(400).json({
        success: false,
        message: `Candidate with Aadhar number ${sanitizedAadhar} already exists`,
        existingCandidate: {
          id: existingCandidate._id,
          name: `${existingCandidate.firstName} ${existingCandidate.lastName}`
        }
      });
    }

    // Continue with candidate creation
    const imageUrl = req.file ? await processImage(req.file) : null;

    // Extract and format bank details
    const bankDetails = {
      bankName: req.body.bankName,
      branch: req.body.branch,
      ifscCode: req.body.ifscCode,
      accountNumber: req.body.bankAccountNumber,
      linkedMobile: req.body.mobileNumberLinkedWithBankAccount,
      upiId: req.body.upiId,
      proofProvided: req.body.bankProofProvided,
      proofDocumentType: req.body.bankProofDocumentType
    };

    // Format meeting details
    const meeting = {
      scheduledDate: req.body.scheduledMeetingDate ? new Date(req.body.scheduledMeetingDate) : undefined,
      assessmentDate: req.body.assessmentDate ? new Date(req.body.assessmentDate) : undefined
    };

    // Format examination details
    const examination = {
      status: req.body.examStatus || 'Pending',
      certificateAwarded: req.body.certificateAwarded || false,
      certificateDistributionDate: req.body.certificateDistributionDate ? new Date(req.body.certificateDistributionDate) : undefined
    };

    // Format documents
    const documents = {
      idProof: req.body.idProof,
      upiDocument: req.body.upiIdDocument
    };

    // Format captain details
    const captain = {
      systemApprovalStatus: req.body.captainSystemApprovalStatus,
      id: req.body.captainId
    };

    // Create candidate data object with all fields
    const candidateData = {
      batchId: req.body.batchId,
      batchName: req.body.batchName,
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      gender: req.body.gender,
      dateOfBirth: new Date(req.body.dateOfBirth),
      age: req.body.age,
      aadharNumber: sanitizedAadhar,
      mobileNumber: req.body.mobileNumber?.replace(/\D/g, ''),
      smartPhoneAvailable: req.body.smartPhoneAvailable,
      whatsappNumber: req.body.whatsappNumber,
      fullAddress: req.body.fullAddress,
      matchingWithIdProof: req.body.matchingWithIdProof,
      state: req.body.state,
      district: req.body.district,
      tehsil: req.body.tehsil,
      pinCode: req.body.pinCode,
      policeVerificationAvailable: req.body.policeVerificationAvailable,
      maritalStatus: req.body.maritalStatus,
      dateOfAnniversary: req.body.dateOfAnniversary ? new Date(req.body.dateOfAnniversary) : undefined,
      numberOfKids: req.body.numberOfKids,
      image: imageUrl,
      bankDetails,
      meeting,
      examination,
      captain,
      documents,
      tpEmail: req.body.tpEmail?.toLowerCase()
    };

    // Validate required fields
    const requiredFields = ['batchId', 'batchName', 'firstName', 'lastName', 'gender', 
                          'dateOfBirth', 'aadharNumber', 'mobileNumber', 'state', 'district', 'tpEmail'];
    
    const missingFields = requiredFields.filter(field => !candidateData[field]);
    if (missingFields.length > 0) {
      throw new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400);
    }

    // Validate Aadhar and mobile number format
    if (candidateData.aadharNumber?.length !== 12) {
      throw new AppError('Aadhar number must be exactly 12 digits', 400);
    }
    if (candidateData.mobileNumber?.length !== 10) {
      throw new AppError('Mobile number must be exactly 10 digits', 400);
    }

    console.log('Creating new candidate with data:', {
      name: `${candidateData.firstName} ${candidateData.lastName}`,
      aadhar: candidateData.aadharNumber
    });

    const candidate = await Candidate.create(candidateData);
    console.log('Successfully created candidate:', candidate._id);
    
    res.status(201).json({
      success: true,
      data: candidate
    });
  } catch (err) {
    console.error('Create candidate error:', err);
    if (err.code === 11000) {
      // Handle duplicate key error with more detail
      const field = Object.keys(err.keyPattern)[0];
      const value = err.keyValue[field];
      return res.status(400).json({
        success: false,
        message: `Duplicate value: ${value} for field: ${field}. Please use another value.`
      });
    }
    next(err);
  }
});

exports.updateCandidate = catchAsync(async (req, res, next) => {
  const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!candidate) {
    return next(new AppError('Candidate not found', 404));
  }
  res.status(200).json({
    success: true,
    data: candidate
  });
});

exports.deleteCandidate = catchAsync(async (req, res, next) => {
  const candidate = await Candidate.findByIdAndDelete(req.params.id);
  if (!candidate) {
    return next(new AppError('Candidate not found', 404));
  }
  res.status(200).json({
    success: true,
    data: {}
  });
});

// Update search method to include better debugging
exports.searchByAadhar = catchAsync(async (req, res, next) => {
  try {
    // Get aadhar from either params or query
    const aadhar = req.params.aadhar || req.query.aadhar;
    console.log('Search request for Aadhar:', aadhar);

    if (!aadhar) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an Aadhar number'
      });
    }

    const sanitizedAadhar = aadhar.replace(/\D/g, '');
    console.log('Searching with sanitized Aadhar:', sanitizedAadhar);
    
    // Add case insensitive search and proper error handling
    const candidate = await Candidate.findOne({
      aadharNumber: {
        $regex: new RegExp(`^${sanitizedAadhar}$`, 'i')
      }
    }).select('-__v');

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'No candidate found with this Aadhar number',
        searchedAadhar: sanitizedAadhar
      });
    }

    res.status(200).json({
      success: true,
      data: candidate
    });
  } catch (error) {
    console.error('Search error:', error);
    next(new AppError('Error searching for candidate', 500));
  }
});

// Get candidates by batch ID
exports.getCandidatesByBatch = catchAsync(async (req, res, next) => {
  try {
    const { batchId, tpEmail } = req.params;

    console.log(`Fetching candidates for batchId: ${batchId} and tpEmail: ${tpEmail}`);

    // Validate TP email
    const tp = await TP.findOne({ email: tpEmail });
    if (!tp) {
      console.log('Training Provider not found');
      return next(new AppError('Training Provider not found', 404));
    }

    // Fetch candidates by batchId and tpEmail
    const candidates = await Candidate.find({ batchId, tpEmail });
    res.status(200).json({
      success: true,
      candidates
    });
  } catch (error) {
    console.error('Error fetching candidates by batch:', error);
    next(error);
  }
});

// Get candidates by TP Email
exports.getCandidatesByTP = catchAsync(async (req, res, next) => {
  const { tpEmail } = req.params;

  const candidates = await Candidate.find({ tpEmail: tpEmail.toLowerCase() })
    .select('-__v')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: candidates.length,
    data: candidates
  });
});

// Get all batch IDs for a TP
exports.getTPBatches = catchAsync(async (req, res, next) => {
  try {
    const { tpEmail } = req.params;
    console.log('Session in getTPBatches:', req.sessionID);

    if (!tpEmail) {
      return next(new AppError('TP Email is required', 400));
    }

    // Log the query parameters
    console.log('Finding batches for TP:', tpEmail.toLowerCase());

    const batches = await Candidate.aggregate([
      { 
        $match: { 
          tpEmail: tpEmail.toLowerCase() 
        } 
      },
      {
        $group: {
          _id: '$batchId',
          batchName: { $first: '$batchName' },
          candidateCount: { $sum: 1 },
          lastUpdated: { $max: '$updatedAt' }
        }
      },
      {
        $project: {
          batchId: '$_id',
          batchName: 1,
          candidateCount: 1,
          lastUpdated: 1,
          _id: 0
        }
      },
      { 
        $sort: { 
          lastUpdated: -1 
        } 
      }
    ]);

    console.log('Found batches:', batches.length);

    res.status(200).json({
      success: true,
      count: batches.length,
      data: batches
    });
  } catch (error) {
    console.error('Error in getTPBatches:', error);
    next(error);
  }
});

exports.bulkCreateCandidates = catchAsync(async (req, res, next) => {
  try {
    const candidates = req.body;

    // Validate array and maximum limit
    if (!Array.isArray(candidates)) {
      throw new AppError('Request body must be an array of candidates', 400);
    }
    
    if (candidates.length > 100) {
      throw new AppError('Maximum 100 candidates allowed per batch upload', 400);
    }

    if (candidates.length === 0) {
      throw new AppError('No candidates provided', 400);
    }

    // Validate all candidates have same batchId
    const batchId = candidates[0].batchId;
    const hasInvalidBatch = candidates.some(c => c.batchId !== batchId);
    if (hasInvalidBatch) {
      throw new AppError('All candidates must belong to the same batch', 400);
    }

    // Pre-process and validate each candidate
    const processedCandidates = candidates.map(candidate => ({
      ...candidate,
      aadharNumber: candidate.aadharNumber?.replace(/\D/g, ''),
      mobileNumber: candidate.mobileNumber?.replace(/\D/g, ''),
      tpEmail: candidate.tpEmail?.toLowerCase(),
      dateOfBirth: new Date(candidate.dateOfBirth),
      dateOfAnniversary: candidate.dateOfAnniversary ? new Date(candidate.dateOfAnniversary) : undefined
    }));

    // Validate Aadhar numbers are unique
    const aadharNumbers = processedCandidates.map(c => c.aadharNumber);
    const uniqueAadhars = new Set(aadharNumbers);
    if (uniqueAadhars.size !== aadharNumbers.length) {
      throw new AppError('Duplicate Aadhar numbers found in the batch', 400);
    }

    // Check if any Aadhar numbers already exist in database
    const existingCandidates = await Candidate.find({
      aadharNumber: { $in: aadharNumbers }
    }).select('aadharNumber firstName lastName');

    if (existingCandidates.length > 0) {
      const existingAadhars = existingCandidates.map(c => c.aadharNumber);
      const failedCandidates = processedCandidates.filter(c => existingAadhars.includes(c.aadharNumber));

      return res.status(400).json({
        success: false,
        message: 'Some candidates already exist',
        existingCandidates,
        insertedCount: 0,
        failedCount: failedCandidates.length,
        failedCandidates: failedCandidates.map(c => ({
          firstName: c.firstName,
          lastName: c.lastName,
          aadharNumber: c.aadharNumber
        }))
      });
    }

    // Insert all candidates
    const result = await Candidate.insertMany(processedCandidates, {
      ordered: false,
      rawResult: true
    });

    res.status(201).json({
      success: true,
      message: `Successfully created ${result.insertedCount} candidates`,
      batchId,
      insertedCount: result.insertedCount,
      failedCount: 0,
      insertedCandidates: processedCandidates.map(c => ({
        firstName: c.firstName,
        lastName: c.lastName,
        aadharNumber: c.aadharNumber
      })),
      failedCandidates: []
    });

  } catch (error) {
    console.error('Bulk create error:', error);
    next(error);
  }
});

