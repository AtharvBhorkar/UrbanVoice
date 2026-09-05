const Complaint = require('../models/Complaint');
const Comment = require('../models/Comment');
const User = require('../models/User');
const checkAndUnlockBadges = require('../utils/checkBadges');

const getLeaderboard = async (req, res) => {
  try {
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
      {
        $group: {
          _id: '$complaintData.user',
          totalComments: { $sum: 1 },
        },
      },
    ]);

    const commentMap = {};
    commentStats.forEach((c) => {
      commentMap[c._id.toString()] = c.totalComments;
    });

    const users = (await User.find().select('username avatar fullName location followers showOnLeaderboard')).filter(
      (u) => u.showOnLeaderboard !== false
    );

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

    const ranked = leaderboard
      .filter((u) => u.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((u, index) => ({ rank: index + 1, ...u }));

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

    const users = (await User.find().select('username avatar fullName location followers showOnLeaderboard')).filter(
      (u) => u.showOnLeaderboard !== false
    );

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