const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Candidate:
 *       type: object
 *       required:
 *         - batchId
 *         - batchName
 *         - firstName
 *         - lastName
 *         - aadharNumber
 *         - mobileNumber
 *         - dateOfBirth
 *         - gender
 *         - state
 *         - district
 *       properties:
 *         batchId:
 *           type: string
 *         batchName:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         aadharNumber:
 *           type: string
 *         mobileNumber:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         gender:
 *           type: string
 *           enum: [Male, Female, Other]
 *         state:
 *           type: string
 *         district:
 *           type: string
 *         image:
 *           type: string
 *         examStatus:
 *           type: string
 *           enum: [Pending, Passed, Failed]
 *         certificateAwarded:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const candidateSchema = new mongoose.Schema({
  batchId: {
    type: String,
    required: [true, 'Batch ID is required'],
    trim: true,
    index: true // Add index for better query performance
  },
  batchName: {
    type: String,
    required: [true, 'Batch name is required'],
    trim: true
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: {
      values: ['M', 'F', 'Other'],
      message: 'Gender must be either M, F, or Other'
    }
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  aadharNumber: {
    type: String,
    required: [true, 'Aadhar number is required'],
    unique: true,
    minlength: [12, 'Aadhar number must be 12 digits'],
    maxlength: [12, 'Aadhar number must be 12 digits']
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    minlength: [10, 'Mobile number must be 10 digits'],
    maxlength: [10, 'Mobile number must be 10 digits']
  },
  state: {
    type: String,
    required: [true, 'State is required']
  },
  smartPhoneAvailable: Boolean,
  whatsappNumber: String,
  fullAddress: String,
  matchingWithIdProof: Boolean,
  district: {
    type: String,
    required: [true, 'District is required']
  },
  tehsil: String,
  pinCode: String,
  policeVerificationAvailable: Boolean,
  maritalStatus: String,
  dateOfAnniversary: Date,
  numberOfKids: Number,
  bankDetails: {
    bankName: String,
    branch: String,
    ifscCode: String,
    accountNumber: String,
    linkedMobile: String,
    upiId: String,
    proofProvided: Boolean,
    proofDocumentType: String
  },
  meeting: {
    scheduledDate: Date,
    assessmentDate: Date
  },
  examination: {
    status: {
      type: String,
      enum: ['Pending', 'Passed', 'Failed'],
      default: 'Pending'
    },
    certificateAwarded: {
      type: Boolean,
      default: false
    },
    certificateDistributionDate: Date
  },
  captain: {
    systemApprovalStatus: String,
    id: String
  },
  documents: {
    idProof: String,
    upiDocument: String
  },
  image: String,
  email: {
    type: String,
    required: false, // Make email optional
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        // Allow null/empty or valid email
        return v === null || v === '' || /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please provide a valid email address'
    }
  },
  tpEmail: {
    type: String,
    required: [true, 'TP Email is required'],
    trim: true,
    lowercase: true,
    index: true // Add index for better query performance
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Remove any existing unique index on email if it exists
candidateSchema.index({ email: 1 }, { unique: false });

// Update timestamp on save
candidateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Candidate', candidateSchema);
