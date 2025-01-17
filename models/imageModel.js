const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' },
  aadharNumber: { type: String }
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
