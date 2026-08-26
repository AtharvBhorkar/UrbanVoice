const Complaint = require('../models/Complaint');
const User = require('../models/User');

// @desc    Get all complaints (admin view, includes non-public too)
// @route   GET /api/admin/complaints
const getAllComplaints = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;

    const complaints = await Complaint.find(filter)
      .populate('user', 'username avatar fullName')
      .sort({ priorityScore: -1, createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update complaint status (Pending/In Progress/Resolved/Rejected)
// @route   PUT /api/admin/complaints/:id/status
const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'username avatar fullName');

    if (!complaint) {
      return res.status(404).json({ message: 'Not found' });
    }

    const Notification = require('../models/Notification');
    await Notification.create({
      recipient: complaint.user._id,
      sender: req.user._id,
      type: 'status_update',
      complaint: complaint._id,
      message: `Your complaint "${complaint.caption || complaint.type}" was marked ${status}.`,
    });

    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (admin view)
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin dashboard analytics summary
// @route   GET /api/admin/analytics
const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalComplaints = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'Pending' });
    const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    const rejected = await Complaint.countDocuments({ status: 'Rejected' });

    res.status(200).json({
      totalUsers,
      totalComplaints,
      pending,
      inProgress,
      resolved,
      rejected,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllComplaints, updateComplaintStatus, getAllUsers, getAnalytics };