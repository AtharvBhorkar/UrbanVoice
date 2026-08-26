const Complaint = require('../models/Complaint');
const Comment = require('../models/Comment');
const User = require('../models/User');
const checkAndUnlockBadges = require('../utils/checkBadges');

// @desc    Get community leaderboard - ranked by likes+comments+shares+followers+views combined
// @route   GET /api/leaderboard
const getLeaderboard = async (req, res) => {
  try {
    // Step 1: likes + shares + views totals, grouped per user (post owner)
    const complaintStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$user',
          totalLikes: { $sum: { $size: '$likes' } },
          totalShares: { $sum: '$shares' },
          totalViews: { $sum: '$views' },
        },
      },
    ]);

    // Step 2: comment counts, grouped per post-owner (via lookup to complaints)
    const commentStats = await Comment.aggregate([
      {
        $lookup: {
          from: 'complaints',
          localField: 'complaint',
          foreignField: '_id',
          as: 'complaintData',
        },
      },
      { $unwind: '$complaintData' },
      {
        $group: {
          _id: '$complaintData.user',
          totalComments: { $sum: 1 },
        },
      },
    ]);

    // Step 3: build a lookup map for comments
    const commentMap = {};
    commentStats.forEach((c) => {
      commentMap[c._id.toString()] = c.totalComments;
    });

    // Step 4: get all users with their followers count + profile info
    const users = await User.find().select('username avatar fullName location followers');

    // Step 5: combine everything into one score per user
    const leaderboard = users.map((user) => {
      const stats = complaintStats.find((s) => s._id.toString() === user._id.toString());
      const totalLikes = stats ? stats.totalLikes : 0;
      const totalShares = stats ? stats.totalShares : 0;
      const totalViews = stats ? stats.totalViews : 0;
      const totalComments = commentMap[user._id.toString()] || 0;
      const followersCount = user.followers.length;

      const score = totalLikes + totalComments + totalShares + followersCount + totalViews;

      return {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        avatar: user.avatar,
        location: user.location,
        totalLikes,
        totalComments,
        totalShares,
        totalViews,
        followersCount,
        score,
      };
    });

    // Step 6: sort descending by score, only show users with activity
    const ranked = leaderboard
      .filter((u) => u.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((u, index) => ({ rank: index + 1, ...u }));

    // Step 7: keep User.points in sync, then check for newly unlocked badges
    await Promise.all(
      ranked.map(async (u) => {
        const dbUser = await User.findByIdAndUpdate(u._id, { points: u.score }, { new: true });
        await checkAndUnlockBadges(dbUser);
      })
    );

    res.status(200).json(ranked);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top 5 users for Home Feed sidebar
// @route   GET /api/leaderboard/top5
const getTop5 = async (req, res) => {
  try {
    req.query.limit = 5;
    const Complaint = require('../models/Complaint');
    const Comment = require('../models/Comment');

    const complaintStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$user',
          totalLikes: { $sum: { $size: '$likes' } },
          totalShares: { $sum: '$shares' },
          totalViews: { $sum: '$views' },
        },
      },
    ]);

    const commentStats = await Comment.aggregate([
      {
        $lookup: {
          from: 'complaints',
          localField: 'complaint',
          foreignField: '_id',
          as: 'complaintData',
        },
      },
      { $unwind: '$complaintData' },
      { $group: { _id: '$complaintData.user', totalComments: { $sum: 1 } } },
    ]);

    const commentMap = {};
    commentStats.forEach((c) => {
      commentMap[c._id.toString()] = c.totalComments;
    });

    const users = await User.find().select('username avatar fullName location followers');

    const leaderboard = users
      .map((user) => {
        const stats = complaintStats.find((s) => s._id.toString() === user._id.toString());
        const totalLikes = stats ? stats.totalLikes : 0;
        const totalShares = stats ? stats.totalShares : 0;
        const totalViews = stats ? stats.totalViews : 0;
        const totalComments = commentMap[user._id.toString()] || 0;
        const followersCount = user.followers.length;
        const score = totalLikes + totalComments + totalShares + followersCount + totalViews;

        return {
          _id: user._id,
          username: user.username,
          avatar: user.avatar,
          location: user.location,
          score,
        };
      })
      .filter((u) => u.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLeaderboard, getTop5 };