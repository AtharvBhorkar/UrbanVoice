const Complaint = require('../models/Complaint');
const User = require('../models/User');

const getAllComplaints = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;


    if (req.user.department && req.user.department !== 'General') {
      filter.department = req.user.department;
    }

    const complaints = await Complaint.find(filter)
      .populate('user', 'username avatar fullName')
      .sort({ priorityScore: -1, createdAt: -1 });

    const withSlaFlag = complaints.map((c) => {
      const obj = c.toObject();
      obj.slaBreached =
        c.status !== 'Resolved' &&
        c.status !== 'Rejected' &&
        c.expectedResolutionDate &&
        new Date() > new Date(c.expectedResolutionDate);
      return obj;
    });

    res.status(200).json(withSlaFlag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {
    const { status, resolutionNote, resolutionImage } = req.body;
    const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Resolved mark karte waqt proof mandatory hai
    if (status === 'Resolved' && !resolutionNote) {
      return res
        .status(400)
        .json({ message: 'Resolved karne ke liye resolutionNote zaroori hai' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Not found' });
    }

    complaint.status = status;
    if (status === 'Resolved') {
      complaint.resolutionNote = resolutionNote;
      if (resolutionImage) complaint.resolutionImage = resolutionImage;
    }
    complaint.statusHistory.push({
      status,
      changedBy: req.user._id,
      note: resolutionNote || `Status changed to ${status}`,
    });

    await complaint.save();
    const populated = await complaint.populate('user', 'username avatar fullName');

    const Notification = require('../models/Notification');
    await Notification.create({
      recipient: populated.user._id,
      sender: req.user._id,
      type: 'status_update',
      complaint: populated._id,
      message: `Your complaint "${populated.ticketId}" was marked ${status}.`,
    });

    res.status(200).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalComplaints = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'Pending' });
    const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    const rejected = await Complaint.countDocuments({ status: 'Rejected' });

    // average resolution time (din mein) — sirf resolved complaints par
    const resolvedComplaints = await Complaint.find({ status: 'Resolved' }).select(
      'createdAt statusHistory'
    );

    let avgResolutionDays = 0;
    if (resolvedComplaints.length > 0) {
      const totalDays = resolvedComplaints.reduce((sum, c) => {
        const resolvedEntry = c.statusHistory.find((h) => h.status === 'Resolved');
        const resolvedDate = resolvedEntry ? resolvedEntry.date : c.updatedAt;
        const days = (new Date(resolvedDate) - new Date(c.createdAt)) / (1000 * 60 * 60 * 24);
        return sum + days;
      }, 0);
      avgResolutionDays = Math.round((totalDays / resolvedComplaints.length) * 10) / 10;
    }

    // SLA breach count
    const slaBreached = await Complaint.countDocuments({
      status: { $nin: ['Resolved', 'Rejected'] },
      expectedResolutionDate: { $lt: new Date() },
    });

    res.status(200).json({
      totalUsers,
      totalComplaints,
      pending,
      inProgress,
      resolved,
      rejected,
      avgResolutionDays,
      slaBreached,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllComplaints, updateComplaintStatus, getAllUsers, getAnalytics };