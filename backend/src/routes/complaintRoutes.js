const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  trackComplaint,
  getComplaintsByUser,
  toggleLike,
  toggleSave,
  submitFeedback,
} = require('../controllers/complaintController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.single('media'), createComplaint);
router.get('/', optionalAuth, getComplaints);
router.get('/user/:userId', optionalAuth, getComplaintsByUser);
router.get('/track/:ticketId', trackComplaint);
router.get('/:id', optionalAuth, getComplaintById);
router.put('/:id/like', protect, toggleLike);
router.put('/:id/save', protect, toggleSave);
router.put('/:id/feedback', protect, submitFeedback);

module.exports = router;