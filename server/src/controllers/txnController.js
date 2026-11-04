const { Transaction, CATEGORIES } = require('../models/Transaction');

// @desc    Get all transactions for logged in user (with optional filtering)
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate, search } = req.query;

    const filter = { userId: req.user.id };

    if (type && ['income', 'expense'].includes(type)) {
      filter.type = type;
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    if (search && search.trim() !== '') {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { notes: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const transactions = await Transaction.find(filter).sort({ date: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    console.error('getTransactions error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions.',
    });
  }
};

// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date, notes, currency } = req.body;

    // 1. Title validation
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Transaction title is required.',
      });
    }

    if (title.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Transaction title cannot exceed 100 characters.',
      });
    }

    // 2. Notes validation
    if (notes && typeof notes === 'string' && notes.trim().length > 300) {
      return res.status(400).json({
        success: false,
        message: 'Notes cannot exceed 300 characters.',
      });
    }

    // 3. Amount validation (number, > 0, <= 100,000,000)
    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a number greater than 0.',
      });
    }

    if (parsedAmount > 100000000) {
      return res.status(400).json({
        success: false,
        message: 'Amount cannot exceed 100,000,000.',
      });
    }

    // 4. Type validation
    if (!type || !['income', 'expense'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be either "income" or "expense".',
      });
    }

    // 5. Category validation
    if (!category || !CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Category "${category}" is not supported. Please select from the allowed categories.`,
      });
    }

    // 6. Date validation
    let parsedDate = new Date();
    if (date) {
      parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid date.',
        });
      }
    }

    // 7. Abuse-Protection & Storage Limits check
    const isDemo = req.user.email === 'demo@financeflow.com';
    const currentTxnCount = await Transaction.countDocuments({ userId: req.user.id });

    // Demo limit: maximum 30 transactions
    if (isDemo && currentTxnCount >= 30) {
      return res.status(400).json({
        success: false,
        message: 'Demo limit reached. Create a free account to add more.',
      });
    }

    // Normal user limit: maximum 500 transactions per user (keeps Atlas free tier storage safe)
    if (!isDemo && currentTxnCount >= 500) {
      return res.status(400).json({
        success: false,
        message: 'Transaction limit reached (maximum 500 transactions per account). Please export or delete older records.',
      });
    }

    const transaction = await Transaction.create({
      userId: req.user.id,
      title: title.trim(),
      amount: parsedAmount,
      type,
      category,
      date: parsedDate,
      notes: notes ? notes.trim() : '',
      currency: currency || req.user.currency || 'INR',
      isDemo,
    });

    return res.status(201).json({
      success: true,
      message: 'Transaction recorded successfully!',
      data: transaction,
    });
  } catch (error) {
    console.error('createTransaction error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to create transaction.',
    });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found or you are not authorized to delete it.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully.',
      data: { id: req.params.id },
    });
  } catch (error) {
    console.error('deleteTransaction error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete transaction.',
    });
  }
};

// @desc    Get aggregated financial summary and chart data
// @route   GET /api/transactions/summary
// @access  Private
const getFinancialSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({ userId });

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryTotals = {};
    const monthlyMap = {};

    transactions.forEach((txn) => {
      const amt = Number(txn.amount);
      if (txn.type === 'income') {
        totalIncome += amt;
      } else if (txn.type === 'expense') {
        totalExpense += amt;
        categoryTotals[txn.category] = (categoryTotals[txn.category] || 0) + amt;
      }

      // Monthly trends key: "YYYY-MM"
      const dateObj = new Date(txn.date);
      const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
      const monthName = dateObj.toLocaleString('default', { month: 'short' });
      const formattedMonth = `${monthName} '${String(dateObj.getFullYear()).slice(-2)}`;

      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = {
          key: monthKey,
          name: formattedMonth,
          income: 0,
          expense: 0,
        };
      }

      if (txn.type === 'income') {
        monthlyMap[monthKey].income += amt;
      } else {
        monthlyMap[monthKey].expense += amt;
      }
    });

    const balance = totalIncome - totalExpense;

    // Convert category breakdown to array for Recharts Pie Chart
    const categoryBreakdown = Object.keys(categoryTotals).map((cat) => ({
      name: cat,
      value: Number(categoryTotals[cat].toFixed(2)),
    }));

    // Convert monthly trends to sorted array for Recharts Bar Chart
    const monthlyTrends = Object.keys(monthlyMap)
      .sort()
      .slice(-6) // Last 6 recorded months
      .map((key) => ({
        month: monthlyMap[key].name,
        income: Number(monthlyMap[key].income.toFixed(2)),
        expense: Number(monthlyMap[key].expense.toFixed(2)),
      }));

    return res.status(200).json({
      success: true,
      summary: {
        totalIncome: Number(totalIncome.toFixed(2)),
        totalExpense: Number(totalExpense.toFixed(2)),
        balance: Number(balance.toFixed(2)),
        transactionCount: transactions.length,
      },
      categoryBreakdown,
      monthlyTrends,
    });
  } catch (error) {
    console.error('getFinancialSummary error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to compute financial summary.',
    });
  }
};

// @desc    Get valid categories
// @route   GET /api/transactions/categories
// @access  Public
const getCategories = (req, res) => {
  return res.status(200).json({
    success: true,
    categories: CATEGORIES,
  });
};

module.exports = {
  getTransactions,
  createTransaction,
  deleteTransaction,
  getFinancialSummary,
  getCategories,
};
