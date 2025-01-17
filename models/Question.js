const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const QuestionSchema = new mongoose.Schema({
  questionId: {
    type: String,
    default: uuidv4,
    unique: true
  },
  questions: {
    english: {
      type: String,
      required: [true, 'Please add the question in English']
    },
    hindi: {
      type: String,
      required: [true, 'Please add the question in Hindi']
    },
    marathi: {
      type: String,
      required: [true, 'Please add the question in Marathi']
    }
  },
  options: {
    english: {
      type: [String],
      required: [true, 'Please add the options in English'],
      validate: [arrayLimit, '{PATH} must have 4 options']
    },
    hindi: {
      type: [String],
      required: [true, 'Please add the options in Hindi'],
      validate: [arrayLimit, '{PATH} must have 4 options']
    },
    marathi: {
      type: [String],
      required: [true, 'Please add the options in Marathi'],
      validate: [arrayLimit, '{PATH} must have 4 options']
    }
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: [true, 'Please add the difficulty level']
  },
  marks: {
    type: Number,
    required: [true, 'Please add the marks']
  },
  correctAnswer: {
    type: String,
    required: [true, 'Please add the correct answer']
  },
  qp: {
    type: String,
    required: [true, 'Please add the QP']
  },
  nos: {
    type: String,
    required: [true, 'Please add the NOS']
  },
  pc: {
    type: String,
    required: [true, 'Please add the PC']
  },
  numberOfTimesUsed: {
    type: Number,
    default: 0
  },
  createdTime: {
    type: Date,
    default: Date.now
  },
  modifiedTime: {
    type: Date,
    default: Date.now
  },
  connectedToAssessments: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Assessment'
  }],
  createdBy: {
    type: String,
    required: [true, 'Please add the creator']
  },
  active: {
    type: Boolean,
    default: true
  }
});

// Custom validator to ensure there are exactly 4 options
function arrayLimit(val) {
  return val.length === 4;
}

// Update the modifiedTime field on save
QuestionSchema.pre('save', function(next) {
  this.modifiedTime = Date.now();
  next();
});

module.exports = mongoose.model('Question', QuestionSchema);
