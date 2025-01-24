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
  qpName: {
    type: String,
    required: [true, 'Please add a QP name']
  },
  qpCode: {
    type: String,
    required: [true, 'Please add a QP code']
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
  nos: [
    {
      code: {
        type: String,
        required: [true, 'Please add the NOS code']
      },
      numberOfQuestions: {
        type: Number,
        required: [true, 'Please add the number of questions for this NOS']
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure the total number of questions matches the sum of difficulty levels and NOS questions
AssessmentSchema.pre('save', function(next) {
  const totalQuestions = this.difficulty.easy + this.difficulty.medium + this.difficulty.hard;
  const totalNosQuestions = this.nos.reduce((sum, nos) => sum + nos.numberOfQuestions, 0);
  if (totalQuestions !== this.numberOfQuestions || totalNosQuestions !== this.numberOfQuestions) {
    return next(new Error('Total number of questions does not match the sum of difficulty levels or NOS questions'));
  }
  next();
});

// Update the updatedAt field on save
AssessmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.models.Assessment || mongoose.model('Assessment', AssessmentSchema);
