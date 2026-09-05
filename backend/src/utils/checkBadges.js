const BADGES = require('./badges');
const Complaint = require('../models/Complaint');

const checkAndUnlockBadges = async (user) => {
  const newlyUnlocked = [];

  for (const badge of BADGES) {
    const alreadyHas = user.badges.includes(badge.id);
    if (alreadyHas) continue;

    let earned = false;

    if (badge.type === 'points') {
      earned = user.points >= badge.threshold;
    }

    if (badge.type === 'first_post') {
      const postCount = await Complaint.countDocuments({ user: user._id });
      earned = postCount >= 1;
    }

    if (earned) {
      user.badges.push(badge.id);
      newlyUnlocked.push(badge);
    }
  }

  if (newlyUnlocked.length > 0) {
    await user.save();
  }

  return newlyUnlocked;
};

module.exports = checkAndUnlockBadges;