const mongoose = require('mongoose');

const tpSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true
  }
  // Add other fields as necessary
});

const TP = mongoose.models.TP || mongoose.model('TP', tpSchema);

module.exports = TP;