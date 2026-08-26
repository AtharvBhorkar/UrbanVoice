const Complaint = require('../models/Complaint');
const Comment = require('../models/Comment');
const Engagement = require('../models/Engagement');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Add a comment to a complaint
// @route   POST /api/engagement/:id/comment
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Not found' });
    }

    const comment = await Comment.create({
      complaint: complaint._id,
      user: req.user._id,
      text: text.trim(),
    });

    if (complaint.user.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: complaint.user,
        sender: req.user._id,
        type: 'comment',
        complaint: complaint._id,
        message: `${req.user.username} commented: "${text.trim().slice(0, 40)}"`,
      });
    }

    const populated = await comment.populate('user', 'username avatar');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all comments of a complaint (oldest first)
// @route   GET /api/engagement/:id/comments
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ complaint: req.params.id })
      .populate('user', 'username avatar')
      .sort({ createdAt: 1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a view (once per user per complaint)
// @route   POST /api/engagement/:id/view
const addView = async (req, res) => {
  try {
    await Engagement.create({
      user: req.user._id,
      complaint: req.params.id,
      type: 'view',
    });

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    res.status(200).json({ views: complaint.views });
  } catch (error) {
    if (error.code === 11000) {
      // duplicate - already viewed by this user, ignore silently
      const complaint = await Complaint.findById(req.params.id);
      return res.status(200).json({ views: complaint.views });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a share (once per user per complaint)
// @route   POST /api/engagement/:id/share
const addShare = async (req, res) => {
  try {
    await Engagement.create({
      user: req.user._id,
      complaint: req.params.id,
      type: 'share',
    });

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { $inc: { shares: 1 } },
      { new: true }
    );

    res.status(200).json({ shares: complaint.shares });
  } catch (error) {
    if (error.code === 11000) {
      const complaint = await Complaint.findById(req.params.id);
      return res.status(200).json({ shares: complaint.shares });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Follow / Unfollow a user (toggle)
// @route   PUT /api/engagement/follow/:userId
const toggleFollow = async (req, res) => {
  try {
    if (req.params.userId === req.user._id.toString()) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    const targetUser = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user._id);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFollowing = currentUser.following.some(
      (id) => id.toString() === targetUser._id.toString()
    );

    if (isFollowing) {
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetUser._id.toString()
      );
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== currentUser._id.toString()
      );
    } else {
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(currentUser._id);

      await Notification.create({
        recipient: targetUser._id,
        sender: currentUser._id,
        type: 'follow',
        message: `${currentUser.username} started following you.`,
      });
    }

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({
      following: !isFollowing,
      followersCount: targetUser.followers.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user's notifications
// @route   GET /api/engagement/notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'username avatar')
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/engagement/notifications/read
const markNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
    res.status(200).json({ message: 'All marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addComment,
  getComments,
  addView,
  addShare,
  toggleFollow,
  getNotifications,
  markNotificationsRead,
};