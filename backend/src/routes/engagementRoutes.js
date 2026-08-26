const express = require('express');
const router = express.Router();
const {
  addComment,
  getComments,
  addView,
  addShare,
  toggleFollow,
  getNotifications,
  markNotificationsRead,
} = require('../controllers/engagementController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:id/comment', protect, addComment);
router.get('/:id/comments', getComments);
router.post('/:id/view', protect, addView);
router.post('/:id/share', protect, addShare);
router.put('/follow/:userId', protect, toggleFollow);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/read', protect, markNotificationsRead);

module.exports = router;