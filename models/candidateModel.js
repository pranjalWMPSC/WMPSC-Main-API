const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Candidate:
 *       type: object
 *       required:
 *         - batchName
 *         - batchId
 *         - firstName
 *         - lastName
 *         - gender
 *         - captainProfession
 *         - inProfessionSince
 *         - dateOfBirth
 *         - age
 *         - aadharNumber
 *         - mobileNumber
 *         - smartPhoneAvailable
 *         - whatsappNumber
 *         - fullAddress
 *         - matchingWithIdProof
 *         - state
 *         - district
 *         - tehsil
 *         - pinCode
 *         - policeVerificationAvailable
 *         - maritalStatus
 *         - bankName
 *         - branch
 *         - ifscCode
 *         - bankAccountNumber
 *         - mobileNumberLinkedWithBankAccount
 *         - examStatus
 *         - certificateAwarded
 *         - captainSystemApprovalStatus
 *         - captainId
 *         - idProof
 *         - bankProofProvided
 *         - bankProofDocumentType
 *         - upiIdProvided
 *       properties:
 *         batchName:
 *           type: string
 *         batchId:
 *           type: string
 *         firstName:
 *           type: string
 *         middleName:
 *           type: string
 *         lastName:
 *           type: string
 *         gender:
 *           type: string
 *           enum: [M, F, Other]
 *         captainProfession:
 *           type: string
 *         inProfessionSince:
 *           type: number
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         age:
 *           type: number
 *         aadharNumber:
 *           type: string
 *         mobileNumber:
 *           type: string
 *         smartPhoneAvailable:
 *           type: boolean
 *         whatsappNumber:
 *           type: string
 *         fullAddress:
 *           type: string
 *         matchingWithIdProof:
 *           type: boolean
 *         state:
 *           type: string
 *         district:
 *           type: string
 *         tehsil:
 *           type: string
 *         pinCode:
 *           type: string
 *         policeVerificationAvailable:
 *           type: boolean
 *         maritalStatus:
 *           type: string
 *         dateOfAnniversary:
 *           type: string
 *           format: date
 *         numberOfKids:
 *           type: number
 *         bankName:
 *           type: string
 *         branch:
 *           type: string
 *         ifscCode:
 *           type: string
 *         bankAccountNumber:
 *           type: string
 *         mobileNumberLinkedWithBankAccount:
 *           type: string
 *         upiId:
 *           type: string
 *         scheduledMeetingDate:
 *           type: string
 *           format: date
 *         assessmentDate:
 *           type: string
 *           format: date
 *         examStatus:
 *           type: string
 *         certificateAwarded:
 *           type: boolean
 *         certificateDistributionDate:
 *           type: string
 *           format: date
 *         captainSystemApprovalStatus:
 *           type: string
 *         captainId:
 *           type: string
 *         idProof:
 *           type: string
 *         bankProofProvided:
 *           type: boolean
 *         bankProofDocumentType:
 *           type: string
 *         upiIdProvided:
 *           type: boolean
 *         upiIdDocument:
 *           type: string
 *         profilePhoto:
 *           type: string
 *           format: objectId
 */

const candidateSchema = new mongoose.Schema({
  batchName: { type: String, required: true },
  batchId: { type: String, required: true },
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  gender: { type: String, enum: ['M', 'F', 'Other'], required: true },
  captainProfession: { type: String, required: true },
  inProfessionSince: { type: Number, required: true },
  dateOfBirth: { type: Date, required: true },
  age: { type: Number, required: true },
  aadharNumber: { type: String, unique: true, required: true },
  mobileNumber: { type: String, required: true },
  smartPhoneAvailable: { type: Boolean, required: true },
  whatsappNumber: { type: String, required: true },
  fullAddress: { type: String, required: true },
  matchingWithIdProof: { type: Boolean, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  tehsil: { type: String, required: true },
  pinCode: { type: String, required: true },
  policeVerificationAvailable: { type: Boolean, required: true },
  maritalStatus: { type: String, required: true },
  dateOfAnniversary: { type: Date },
  numberOfKids: { type: Number },
  bankName: { type: String, required: true },
  branch: { type: String, required: true },
  ifscCode: { type: String, required: true },
  bankAccountNumber: { type: String, required: true },
  mobileNumberLinkedWithBankAccount: { type: String, required: true },
  upiId: { type: String },
  scheduledMeetingDate: { type: Date },
  assessmentDate: { type: Date },
  examStatus: { type: String, required: true },
  certificateAwarded: { type: Boolean, required: true },
  certificateDistributionDate: { type: Date },
  captainSystemApprovalStatus: { type: String, required: true },
  captainId: { type: String, required: true },
  idProof: { type: String, required: true },
  bankProofProvided: { type: Boolean, required: true },
  bankProofDocumentType: { type: String, required: true },
  upiIdProvided: { type: Boolean, required: true },
  upiIdDocument: { type: String },
  profilePhoto: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' }
});

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
