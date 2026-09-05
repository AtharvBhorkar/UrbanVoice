const mongoose = require('mongoose');

const engagementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true,
    },
    type: {
      type: String,
      enum: ['view', 'share'],
      required: true,
    },
  },
  { timestamps: true }
);

engagementSchema.index({ user: 1, complaint: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Engagement', engagementSchema);