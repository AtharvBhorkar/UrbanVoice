const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, forgotPassword, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.get('/me', protect, getMe);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.get('/badges', (req, res) => {
  const BADGES = require('../utils/badges');
  res.status(200).json(BADGES);
});

module.exports = router;