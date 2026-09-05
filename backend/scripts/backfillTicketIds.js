require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const Complaint = require('../src/models/Complaint');

(async () => {
  await connectDB();

  const missing = await Complaint.find({
    $or: [{ ticketId: { $exists: false } }, { ticketId: null }],
  }).sort({ createdAt: 1 });

  console.log(`${missing.length} complaints mile bina ticketId ke.`);

  let counter = await Complaint.countDocuments({
    ticketId: { $exists: true, $ne: null },
  });

  for (const complaint of missing) {
    counter += 1;
    const year = new Date(complaint.createdAt).getFullYear();
    complaint.ticketId = `UV-${year}-${String(counter).padStart(5, '0')}`;
    await complaint.save();
    console.log(`Assigned ${complaint.ticketId} to complaint ${complaint._id}`);
  }

  console.log('Backfill done.');
  mongoose.connection.close();
})();