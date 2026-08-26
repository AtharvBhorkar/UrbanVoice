const calculatePriorityScore = (complaint) => {
  const likesCount = complaint.likes ? complaint.likes.length : 0;
  const daysSinceCreated = complaint.createdAt
    ? Math.floor((Date.now() - new Date(complaint.createdAt)) / (1000 * 60 * 60 * 24))
    : 0;

  const categoryWeight = {
    Water: 5,
    Electricity: 5,
    Sanitation: 4,
    Roads: 4,
    Civic: 3,
    Society: 2,
    Other: 1,
  };

  const weight = categoryWeight[complaint.category] || 1;

  // Formula: category ka weightage + likes ka impact + kitna purana hai (purana = zyada urgent)
  const score = weight * 10 + likesCount * 2 + daysSinceCreated * 1.5;

  return Math.round(score);
};

module.exports = calculatePriorityScore;