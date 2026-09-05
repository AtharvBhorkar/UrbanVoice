const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['post', 'reel'],
      required: true,
    },
    ticketId: {
      type: String,
      unique: true,
      sparse: true,
    },
    department: {
      type: String,
      trim: true,
      default: 'General',
    },
    caption: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    mediaUrl: {
      type: String,
      required: [true, 'Media file is required'],
    },
    mediaType: {
      type: String,
      enum: ['image', 'video'],
      required: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'Other',
    },
    location: {
      type: String,
      trim: true,
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Pending',
    },
    priorityScore: {
      type: Number,
      default: 0,
    },
    expectedResolutionDate: {
      type: Date,
    },
    resolutionNote: {
      type: String,
      trim: true,
    },
    resolutionImage: {
      type: String,
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        note: { type: String, trim: true },
        date: { type: Date, default: Date.now },
      },
    ],
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    feedback: {
      rating: { type: String, enum: ['satisfied', 'not_satisfied'] },
      comment: { type: String, trim: true },
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    shares: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

complaintSchema.pre('save', async function (next) {
  if (this.isNew && !this.ticketId) {
    const year = new Date().getFullYear();
    const Complaint = mongoose.model('Complaint');
    let ticketId;
    let attempts = 0;

    while (attempts < 5) {
      const count = await Complaint.countDocuments();
      const candidate = `UV-${year}-${String(count + 1 + attempts).padStart(5, '0')}`;
      const clash = await Complaint.findOne({ ticketId: candidate });
      if (!clash) {
        ticketId = candidate;
        break;
      }
      attempts += 1;
    }

    this.ticketId = ticketId;
  }
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);