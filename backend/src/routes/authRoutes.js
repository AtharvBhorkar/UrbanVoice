const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  updateProfile,
  searchUsers,
  getUserByUsername,
  getFollowersList,
  getFollowingList,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.get('/me', protect, getMe);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.get('/search', searchUsers);
router.get('/user/:username', getUserByUsername);
router.get('/user/:username/followers', getFollowersList);
router.get('/user/:username/following', getFollowingList);
router.get('/badges', (req, res) => {
  const BADGES = require('../utils/badges');
  res.status(200).json(BADGES);
});

module.exports = router;