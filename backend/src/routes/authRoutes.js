const express = require('express');
const router = express.Router();
const {
  login,
  logout,
  refreshToken,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { protectAdmin } = require('../middlewares/authMiddleware');

router.post('/login', login);
router.post('/logout', protectAdmin, logout);
router.post('/refresh', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/profile', protectAdmin, getProfile);
router.put('/profile', protectAdmin, updateProfile);
router.put('/change-password', protectAdmin, changePassword);

module.exports = router;
