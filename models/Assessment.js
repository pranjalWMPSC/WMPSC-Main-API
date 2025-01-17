const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add an assessment name']
  },
  time: {
    type: Number,
    required: [true, 'Please add an assessment time in minutes']
  },
  date: {
    type: Date,
    required: [true, 'Please add an assessment date']
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject or QP']
  },
  metadata: {
    type: String,
    required: [true, 'Please add metadata']
  },
  numberOfQuestions: {
    type: Number,
    required: [true, 'Please add the number of questions']
  },
  difficulty: {
    easy: {
      type: Number,
      required: [true, 'Please add the number of easy questions']
    },
    medium: {
      type: Number,
      required: [true, 'Please add the number of medium questions']
    },
    hard: {
      type: Number,
      required: [true, 'Please add the number of hard questions']
    }
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

// Ensure the total number of questions matches the sum of difficulty levels
AssessmentSchema.pre('save', function(next) {
  const totalQuestions = this.difficulty.easy + this.difficulty.medium + this.difficulty.hard;
  if (totalQuestions !== this.numberOfQuestions) {
    return next(new Error('Total number of questions does not match the sum of difficulty levels'));
  }
  next();
});

// Update the updatedAt field on save
AssessmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Assessment', AssessmentSchema);
