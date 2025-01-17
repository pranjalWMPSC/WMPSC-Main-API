const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
  date: { type: Date, required: true },
  questions: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
      answer: { type: String, required: true },
      isCorrect: { type: Boolean, required: true }
    }
  ],
  totalMarks: { type: Number, required: true },
  percentage: { type: Number, required: true },
  assessmentType: { type: String, required: true },
  aadharPhoto: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
  profilePhoto: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' }
});

const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = Assessment;
