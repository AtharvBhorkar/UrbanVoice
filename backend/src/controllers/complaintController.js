const Complaint = require('../models/Complaint');
const Category = require('../models/Category');
const Notification = require('../models/Notification');
const checkAndUnlockBadges = require('../utils/checkBadges');
const { uploadToCloudinary } = require('../middleware/uploadMiddleware');
const refreshPriority = require('../utils/refreshPriority');

// Anonymous post me user ki identity hata do (owner aur admin ko chhodke)
const maskAnonymous = (doc, viewerId, isAdmin = false) => {
  const obj = doc.toObject ? doc.toObject() : doc;
  const ownerId = String(obj.user?._id || obj.user || '');
  if (obj.isAnonymous && !isAdmin && String(viewerId || '') !== ownerId) {
    obj.user = { _id: 'anonymous', username: 'Anonymous', avatar: '', fullName: 'Anonymous' };
    obj.statusHistory = (obj.statusHistory || []).map(({ changedBy, ...rest }) => rest);
  }
  return obj;
};

const createComplaint = async (req, res) => {
  try {
    const { type, caption, category, location, lat, lng, isAnonymous, urgency } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Media file is required' });
    }

    const mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
    const mediaUrl = await uploadToCloudinary(req.file);

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
      coordinates:
        lat !== undefined && lng !== undefined && lat !== '' && lng !== '' &&
        Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))
          ? { lat: Number(lat), lng: Number(lng) }
          : undefined,
      isAnonymous: isAnonymous === 'true' || isAnonymous === true,
      urgency: ['Low', 'Medium', 'High'].includes(urgency) ? urgency : 'Medium',
      expectedResolutionDate,
      statusHistory: [{ status: 'Pending', changedBy: req.user._id, note: 'Complaint filed' }],
    });
    await refreshPriority(complaint);
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

    res.status(200).json(complaints.map((c) => maskAnonymous(c, req.user?._id)));
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

    res.status(200).json(maskAnonymous(complaint, req.user?._id));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const trackComplaint = async (req, res) => {
  try {
    const ticketId = String(req.params.ticketId || '').trim().toUpperCase();
    const complaint = await Complaint.findOne({ ticketId }).select(
      'ticketId status category department location caption createdAt expectedResolutionDate resolutionNote resolutionImage statusHistory.status statusHistory.note statusHistory.date'
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
    if (String(req.user?._id || '') !== String(req.params.userId)) {
      filter.isAnonymous = { $ne: true };
    }
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

    await refreshPriority(complaint);
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
  trackComplaint,
  getComplaintsByUser,
  toggleLike,
  toggleSave,
  submitFeedback,
};