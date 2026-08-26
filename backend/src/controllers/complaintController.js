const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');
const calculatePriorityScore = require('../utils/priorityScore');
const checkAndUnlockBadges = require('../utils/checkBadges');

// @desc    Create a new post or reel
// @route   POST /api/complaints
const createComplaint = async (req, res) => {
  try {
    const { type, caption, category, location, lat, lng } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Media file is required' });
    }

    const mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
    const mediaUrl = `/uploads/${req.file.filename}`;

    const complaint = await Complaint.create({
      user: req.user._id,
      type,
      caption,
      mediaUrl,
      mediaType,
      category,
      location,
      coordinates: lat && lng ? { lat, lng } : undefined,
    });

    complaint.priorityScore = calculatePriorityScore(complaint);
    await complaint.save();

    await checkAndUnlockBadges(req.user);

    const populated = await complaint.populate('user', 'username avatar fullName');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all public posts/reels (feed) - newest first
// @route   GET /api/complaints?type=reel|post
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

// @desc    Get single complaint by id + increment view
// @route   GET /api/complaints/:id
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

// @desc    Get complaints of a specific user (for their profile)
// @route   GET /api/complaints/user/:userId
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

// @desc    Like / Unlike a complaint (toggle)
// @route   PUT /api/complaints/:id/like
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
        await Notification.create({
          recipient: complaint.user,
          sender: req.user._id,
          type: 'like',
          complaint: complaint._id,
          message: `${req.user.username} liked your ${complaint.type}.`,
        });
      }
    }

    await complaint.save();
    res.status(200).json({ likes: complaint.likes.length, liked: !alreadyLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save / Unsave a complaint (bookmark)
// @route   PUT /api/complaints/:id/save
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

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  getComplaintsByUser,
  toggleLike,
  toggleSave,
};