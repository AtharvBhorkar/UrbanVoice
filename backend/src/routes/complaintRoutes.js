const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  getComplaintsByUser,
  toggleLike,
  toggleSave,
  submitFeedback,
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.single('media'), createComplaint);
router.get('/', getComplaints);
router.get('/user/:userId', getComplaintsByUser);
router.get('/:id', getComplaintById);
router.put('/:id/like', protect, toggleLike);
router.put('/:id/save', protect, toggleSave);
router.put('/:id/feedback', protect, submitFeedback);

module.exports = router;