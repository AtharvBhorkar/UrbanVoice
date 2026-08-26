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
      enum: ['Civic', 'Society', 'Roads', 'Water', 'Electricity', 'Sanitation', 'Other'],
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

module.exports = mongoose.model('Complaint', complaintSchema);