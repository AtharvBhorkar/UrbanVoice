const calculatePriorityScore = (complaint, repeatCountInArea = 0, categoryWeight = 1) => {
  const upvoteCount = complaint.likes ? complaint.likes.length : 0;
  const daysSinceCreated = complaint.createdAt
    ? Math.floor((Date.now() - new Date(complaint.createdAt)) / (1000 * 60 * 60 * 24))
    : 0;

  const weight = categoryWeight || 1;

  const repeatBonus = repeatCountInArea > 0 ? Math.min(repeatCountInArea * 5, 25) : 0;

  const score = weight * 10 + upvoteCount * 2 + daysSinceCreated * 1.5 + repeatBonus;

  return Math.round(score);
};

module.exports = calculatePriorityScore;