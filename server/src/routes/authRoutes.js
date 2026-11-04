const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateCurrency,
  demoLogin,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/demo-login', demoLogin);
router.get('/me', protect, getMe);
router.put('/currency', protect, updateCurrency);

module.exports = router;
