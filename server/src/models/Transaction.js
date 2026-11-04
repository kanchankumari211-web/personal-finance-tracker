const mongoose = require('mongoose');

const CATEGORIES = [
  // Income
  'Salary',
  'Freelance',
  'Investments',
  'Business',
  'Gifts',
  // Expenses
  'Food & Dining',
  'Rent & Housing',
  'Utilities',
  'Transportation',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Education',
  'Travel',
  'Other',
];

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Transaction title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than zero'],
      max: [100000000, 'Amount cannot exceed 100,000,000'],
    },
    type: {
      type: String,
      required: [true, 'Transaction type is required'],
      enum: {
        values: ['income', 'expense'],
        message: '{VALUE} is not a valid transaction type (income/expense)',
      },
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: CATEGORIES,
        message: '{VALUE} is not a supported category',
      },
    },
    date: {
      type: Date,
      required: [true, 'Valid transaction date is required'],
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [300, 'Notes cannot exceed 300 characters'],
      default: '',
    },
    currency: {
      type: String,
      default: 'INR',
      trim: true,
      uppercase: true,
    },
    isDemo: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast timeline queries by user
transactionSchema.index({ userId: 1, date: -1 });

// TTL Index: Auto-delete demo transactions after 24 hours (86400 seconds)
// Normal user transactions (where isDemo is false) are exempt and never deleted
transactionSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 86400, partialFilterExpression: { isDemo: true } }
);

module.exports = {
  Transaction: mongoose.model('Transaction', transactionSchema),
  CATEGORIES,
};
