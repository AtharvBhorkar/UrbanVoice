const Category = require('../models/Category');
const Complaint = require('../models/Complaint');
const calculatePriorityScore = require('./priorityScore');

const URGENCY_BONUS = { Low: 0, Medium: 0, High: 15 };
const isClosed = (c) => c.status === 'Resolved' || c.status === 'Rejected';

const computeScore = (complaint, repeatCount, weight) =>
  calculatePriorityScore(complaint, repeatCount, weight) +
  (URGENCY_BONUS[complaint.urgency] || 0);

// Ek complaint ka score dobara calculate karta hai (save caller karega)
const refreshPriority = async (complaint) => {
  const categoryDoc = await Category.findOne({ name: complaint.category });
  const repeatCount = complaint.location
    ? await Complaint.countDocuments({
        _id: { $ne: complaint._id },
        category: complaint.category,
        location: complaint.location,
      })
    : 0;

  complaint.priorityScore = computeScore(complaint, repeatCount, categoryDoc?.priorityWeight);
  return complaint;
};

// Admin list ke liye: poori list ka score 3 queries me refresh (N+1 nahi)
const refreshMany = async (complaints) => {
  const open = complaints.filter((c) => !isClosed(c));
  if (open.length === 0) return complaints;

  const categories = await Category.find({}).select('name priorityWeight');
  const weightMap = new Map(categories.map((c) => [c.name, c.priorityWeight]));

  const groups = await Complaint.aggregate([
    { $match: { location: { $exists: true, $ne: '' } } },
    { $group: { _id: { category: '$category', location: '$location' }, count: { $sum: 1 } } },
  ]);
  const groupMap = new Map(groups.map((g) => [`${g._id.category}||${g._id.location}`, g.count]));

  const ops = [];
  for (const c of open) {
    const repeat = c.location ? (groupMap.get(`${c.category}||${c.location}`) || 1) - 1 : 0;
    const score = computeScore(c, repeat, weightMap.get(c.category));
    if (score !== c.priorityScore) {
      c.priorityScore = score;
      ops.push({ updateOne: { filter: { _id: c._id }, update: { $set: { priorityScore: score } } } });
    }
  }
  // timestamps: false -> updatedAt na badle (avgResolutionDays fallback isi pe tika hai)
  if (ops.length) await Complaint.bulkWrite(ops, { timestamps: false });
  return complaints;
};

module.exports = refreshPriority;
module.exports.refreshMany = refreshMany;
module.exports.computeScore = computeScore;