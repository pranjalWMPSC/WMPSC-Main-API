const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const TpSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  spocName: {
    type: String,
    required: [true, 'Please add a SPOC name']
  },
  mobileNumber: {
    type: String,
    required: [true, 'Please add a mobile number'],
    match: [
      /^\d{10}$/,
      'Please add a valid mobile number'
    ]
  },
  status: {
    type: String,
    enum: ['active', 'deactive'],
    default: 'active'
  }
});

// Encrypt password using bcrypt
TpSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
TpSchema.methods.matchPassword = async function(enteredPassword) {
  console.log('Comparing passwords:', enteredPassword, this.password);
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.Tp || mongoose.model('Tp', TpSchema);
