const express = require('express');
const router = express.Router();
const {
  getAllComplaints,
  updateComplaintStatus,
  getAllUsers,
  getAnalytics,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get('/complaints', protect, admin, getAllComplaints);
router.put('/complaints/:id/status', protect, admin, updateComplaintStatus);
router.get('/users', protect, admin, getAllUsers);
router.get('/analytics', protect, admin, getAnalytics);

module.exports = router;