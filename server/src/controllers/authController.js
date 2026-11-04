const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { Transaction } = require('../models/Transaction');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'dev_jwt_secret_finance_tracker_key_2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, currency } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      currency: currency || 'USD',
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error during registration',
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error during login',
    });
  }
};

// @desc    Get authenticated user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
      },
    });
  } catch (error) {
    console.error('GetMe error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching user profile',
    });
  }
};

// @desc    Update user default currency
// @route   PUT /api/auth/currency
// @access  Private
const updateCurrency = async (req, res) => {
  try {
    const { currency } = req.body;
    if (!currency) {
      return res.status(400).json({
        success: false,
        message: 'Currency code is required.',
      });
    }

    const cleanCurrency = String(currency).trim().toUpperCase();
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { currency: cleanCurrency },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Default currency set to ${cleanCurrency}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
      },
    });
  } catch (error) {
    console.error('Update currency error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating currency',
    });
  }
};

// @desc    1-Click Demo Login with fresh reset sample transactions (across 3-4 months)
// @route   POST /api/auth/demo-login
// @access  Public
const demoLogin = async (req, res) => {
  try {
    const DEMO_EMAIL = 'demo@financeflow.com';

    // 1. Find or create the dedicated demo user
    let demoUser = await User.findOne({ email: DEMO_EMAIL });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'FinanceFlow Demo',
        email: DEMO_EMAIL,
        password: 'DemoUser@123',
        currency: 'INR',
      });
    }

    // 2. Clear all previous demo transactions
    await Transaction.deleteMany({ userId: demoUser._id });

    // 3. Insert ~10 fresh sample transactions across 3-4 months
    const now = Date.now();
    const oneDay = 86400000;

    const sampleTransactions = [
      // Month 0 (Current Month)
      {
        userId: demoUser._id,
        title: 'Monthly Salary',
        type: 'income',
        amount: 55000,
        category: 'Salary',
        date: new Date(now - oneDay * 2),
        notes: 'Monthly direct deposit salary',
        currency: 'INR',
        isDemo: true,
      },
      {
        userId: demoUser._id,
        title: 'Apartment Rent',
        type: 'expense',
        amount: 17500,
        category: 'Rent & Housing',
        date: new Date(now - oneDay * 4),
        notes: 'Monthly flat rent',
        currency: 'INR',
        isDemo: true,
      },
      {
        userId: demoUser._id,
        title: 'Supermarket Groceries',
        type: 'expense',
        amount: 3200,
        category: 'Food & Dining',
        date: new Date(now - oneDay * 6),
        notes: 'Fresh veggies & pantry items',
        currency: 'INR',
        isDemo: true,
      },
      {
        userId: demoUser._id,
        title: 'Electric & Fiber Bill',
        type: 'expense',
        amount: 1850,
        category: 'Utilities',
        date: new Date(now - oneDay * 8),
        notes: 'Power and high-speed fiber internet',
        currency: 'INR',
        isDemo: true,
      },
      // Month -1 (1 Month Ago)
      {
        userId: demoUser._id,
        title: 'Monthly Salary',
        type: 'income',
        amount: 55000,
        category: 'Salary',
        date: new Date(now - oneDay * 32),
        notes: 'Credited payroll',
        currency: 'INR',
        isDemo: true,
      },
      {
        userId: demoUser._id,
        title: 'Freelance Design Client',
        type: 'income',
        amount: 14500,
        category: 'Freelance',
        date: new Date(now - oneDay * 36),
        notes: 'Landing page design milestone',
        currency: 'INR',
        isDemo: true,
      },
      {
        userId: demoUser._id,
        title: 'Apartment Rent',
        type: 'expense',
        amount: 17500,
        category: 'Rent & Housing',
        date: new Date(now - oneDay * 34),
        notes: 'Monthly lease payment',
        currency: 'INR',
        isDemo: true,
      },
      {
        userId: demoUser._id,
        title: 'Dining & Weekend Movie',
        type: 'expense',
        amount: 2400,
        category: 'Entertainment',
        date: new Date(now - oneDay * 40),
        notes: 'Family dinner and cinema',
        currency: 'INR',
        isDemo: true,
      },
      // Month -2 (2 Months Ago)
      {
        userId: demoUser._id,
        title: 'Monthly Salary',
        type: 'income',
        amount: 52000,
        category: 'Salary',
        date: new Date(now - oneDay * 62),
        notes: 'Monthly paycheck',
        currency: 'INR',
        isDemo: true,
      },
      {
        userId: demoUser._id,
        title: 'Apartment Rent',
        type: 'expense',
        amount: 17500,
        category: 'Rent & Housing',
        date: new Date(now - oneDay * 64),
        notes: 'Flat rent',
        currency: 'INR',
        isDemo: true,
      },
      {
        userId: demoUser._id,
        title: 'Metro Pass & Fuel',
        type: 'expense',
        amount: 2100,
        category: 'Transportation',
        date: new Date(now - oneDay * 70),
        notes: 'Monthly commute recharge',
        currency: 'INR',
        isDemo: true,
      },
      // Month -3 (3 Months Ago)
      {
        userId: demoUser._id,
        title: 'Quarterly Bonus',
        type: 'income',
        amount: 20000,
        category: 'Salary',
        date: new Date(now - oneDay * 92),
        notes: 'Performance evaluation bonus',
        currency: 'INR',
        isDemo: true,
      },
      {
        userId: demoUser._id,
        title: 'Apartment Rent',
        type: 'expense',
        amount: 17500,
        category: 'Rent & Housing',
        date: new Date(now - oneDay * 94),
        notes: 'Monthly rent',
        currency: 'INR',
        isDemo: true,
      },
    ];

    await Transaction.insertMany(sampleTransactions);

    // 4. Generate JWT for demo session
    const token = generateToken(demoUser._id);

    return res.status(200).json({
      success: true,
      message: 'Demo account initialized with fresh sample transactions!',
      token,
      user: {
        id: demoUser._id,
        name: demoUser.name,
        email: demoUser.email,
        currency: demoUser.currency,
      },
    });
  } catch (error) {
    console.error('demoLogin error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to initialize demo account',
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateCurrency,
  demoLogin,
};
