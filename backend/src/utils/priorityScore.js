const calculatePriorityScore = (complaint, repeatCountInArea = 0) => {
  // "likes" ab community upvotes hain — jitne zyada log confirm karte hain issue real/severe hai
  const upvoteCount = complaint.likes ? complaint.likes.length : 0;
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

  // Repeat complaints in the same area = genuinely bigger problem, chhota bonus do
  const repeatBonus = repeatCountInArea > 0 ? Math.min(repeatCountInArea * 5, 25) : 0;

  // Formula: category weightage + community upvotes + purana kitna hai (purana = urgent) + repeat-area bonus
  const score = weight * 10 + upvoteCount * 2 + daysSinceCreated * 1.5 + repeatBonus;

  return Math.round(score);
};

module.exports = calculatePriorityScore;