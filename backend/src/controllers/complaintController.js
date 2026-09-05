const Complaint = require('../models/Complaint');
const Category = require('../models/Category');
const Notification = require('../models/Notification');
const calculatePriorityScore = require('../utils/priorityScore');
const checkAndUnlockBadges = require('../utils/checkBadges');

const createComplaint = async (req, res) => {
  try {
    const { type, caption, category, location, lat, lng, isAnonymous } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Media file is required' });
    }

    const mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
    const mediaUrl = `/uploads/${req.file.filename}`;

    const categoryDoc = await Category.findOne({ name: category });
    const department = categoryDoc?.department || 'General';

    const expectedResolutionDate = new Date();
    expectedResolutionDate.setDate(expectedResolutionDate.getDate() + 7);

    const complaint = await Complaint.create({
      user: req.user._id,
      type,
      caption,
      mediaUrl,
      mediaType,
      category,
      location,
      department,
      coordinates: lat && lng ? { lat, lng } : undefined,
      isAnonymous: isAnonymous === 'true' || isAnonymous === true,
      expectedResolutionDate,
      statusHistory: [{ status: 'Pending', changedBy: req.user._id, note: 'Complaint filed' }],
    });
    const repeatCountInArea = location
      ? await Complaint.countDocuments({
          _id: { $ne: complaint._id },
          category,
          location,
        })
      : 0;

    complaint.priorityScore = calculatePriorityScore(
      complaint,
      repeatCountInArea,
      categoryDoc?.priorityWeight
    );
    await complaint.save();

    await checkAndUnlockBadges(req.user);

    const populated = await complaint.populate('user', 'username avatar fullName');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComplaints = async (req, res) => {
  try {
    const filter = { isPublic: true };
    if (req.query.type) filter.type = req.query.type;
    if (req.query.category) filter.category = req.query.category;

    const complaints = await Complaint.find(filter)
      .populate('user', 'username avatar fullName')
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      'user',
      'username avatar fullName'
    );

    if (!complaint) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComplaintsByUser = async (req, res) => {
  try {
    const filter = { user: req.params.userId };
    if (req.query.type) filter.type = req.query.type;

    const complaints = await Complaint.find(filter)
      .populate('user', 'username avatar fullName')
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleLike = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Not found' });
    }

    const userId = req.user._id.toString();
    const alreadyLiked = complaint.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      complaint.likes = complaint.likes.filter((id) => id.toString() !== userId);
    } else {
      complaint.likes.push(req.user._id);

      if (complaint.user.toString() !== userId) {
        const User = require('../models/User');
        const postOwner = await User.findById(complaint.user).select('notificationPrefs');
        if (postOwner?.notificationPrefs?.likes !== false) {
          await Notification.create({
            recipient: complaint.user,
            sender: req.user._id,
            type: 'like',
            complaint: complaint._id,
            message: `${req.user.username} liked your ${complaint.type}.`,
          });
        }
      }
    }

    await complaint.save();
    res.status(200).json({ likes: complaint.likes.length, liked: !alreadyLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleSave = async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user._id);

    const complaintId = req.params.id;
    const alreadySaved = user.savedIssues.some((id) => id.toString() === complaintId);

    if (alreadySaved) {
      user.savedIssues = user.savedIssues.filter((id) => id.toString() !== complaintId);
    } else {
      user.savedIssues.push(complaintId);
    }

    await user.save();
    res.status(200).json({ saved: !alreadySaved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body; // rating: 'satisfied' | 'not_satisfied'
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Not found' });
    }
    if (complaint.status !== 'Resolved') {
      return res.status(400).json({ message: 'Feedback sirf resolved complaints par diya ja sakta hai' });
    }
    if (complaint.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Sirf complaint filer feedback de sakta hai' });
    }

    complaint.feedback = { rating, comment };

    if (rating === 'not_satisfied') {
      complaint.status = 'In Progress';
      complaint.statusHistory.push({
        status: 'In Progress',
        changedBy: req.user._id,
        note: `Reopened — citizen unsatisfied: ${comment || 'no comment'}`,
      });
    }

    await complaint.save();
    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  getComplaintsByUser,
  toggleLike,
  toggleSave,
  submitFeedback,
};