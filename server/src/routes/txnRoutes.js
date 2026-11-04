const express = require('express');
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  deleteTransaction,
  getFinancialSummary,
  getCategories,
} = require('../controllers/txnController');
const { protect } = require('../middleware/authMiddleware');

// Public route to get category choices
router.get('/categories', getCategories);

// Protected routes (require JWT)
router.use(protect);

router.route('/')
  .get(getTransactions)
  .post(createTransaction);

router.get('/summary', getFinancialSummary);
router.delete('/:id', deleteTransaction);

module.exports = router;
