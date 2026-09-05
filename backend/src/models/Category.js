const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    department: {
      type: String,
      enum: ['Water', 'Electricity', 'Sanitation', 'Roads', 'Civic', 'Society', 'General'],
      default: 'General',
    },
    priorityWeight: {
      type: Number,
      min: 1,
      max: 5,
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);