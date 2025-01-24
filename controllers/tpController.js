const Tp = require('../models/Tp');

exports.registerTP = async (req, res) => {
  const { name, email, password, spocName, mobileNumber } = req.body;
  try {
    console.log('Registering TP:', { name, email, password, spocName, mobileNumber });
    const tp = await Tp.create({ name, email, password, spocName, mobileNumber });
    res.status(201).json({
      success: true,
      data: tp
    });
  } catch (err) {
    console.error('Error registering TP:', err.message);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.loginTP = async (req, res) => {
  const { email, password } = req.body;
  try {
    const tp = await Tp.findOne({ email, status: 'active' }).select('+password');
    if (!tp) {
      console.error('TP not found');
      return res.status(401).json({ success: false, message: 'Invalid credentials: TP not found' });
    }
    console.log('TP found:', tp);
    const isMatch = await tp.matchPassword(password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      console.error('Invalid password');
      return res.status(401).json({ success: false, message: 'Invalid credentials: Invalid password' });
    }
    const { password: _, ...tpData } = tp.toObject(); // Exclude password from response
    res.status(200).json({ success: true, data: tpData });
  } catch (err) {
    console.error('Error logging in TP:', err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deactivateTP = async (req, res) => {
  const { email } = req.body;
  try {
    const tp = await Tp.findOneAndUpdate({ email }, { status: 'deactive' }, { new: true });
    if (!tp) {
      console.error('TP not found');
      return res.status(404).json({ success: false, message: 'TP not found' });
    }
    res.status(200).json({ success: true, data: tp });
  } catch (err) {
    console.error('Error deactivating TP:', err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.activateTP = async (req, res) => {
  const { email } = req.body;
  try {
    const tp = await Tp.findOneAndUpdate({ email }, { status: 'active' }, { new: true });
    if (!tp) {
      console.error('TP not found');
      return res.status(404).json({ success: false, message: 'TP not found' });
    }
    res.status(200).json({ success: true, data: tp });
  } catch (err) {
    console.error('Error activating TP:', err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};
