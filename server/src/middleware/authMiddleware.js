const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'dev_jwt_secret_finance_tracker_key_2026'
    );

    const user = await User.findById(decoded.id).select('name email currency');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account not found. Please log in again.',
      });
    }

    req.user = {
      id: user._id.toString(),
      _id: user._id,
      name: user.name,
      email: user.email.toLowerCase(),
      currency: user.currency,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid, malformed, or expired token. Please log in again.',
    });
  }
};

module.exports = { protect };
