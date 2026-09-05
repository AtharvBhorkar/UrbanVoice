require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const Category = require('../src/models/Category');

const DEFAULT_CATEGORIES = [
  { name: 'Water', department: 'Water', priorityWeight: 5 },
  { name: 'Electricity', department: 'Electricity', priorityWeight: 5 },
  { name: 'Sanitation', department: 'Sanitation', priorityWeight: 4 },
  { name: 'Roads', department: 'Roads', priorityWeight: 4 },
  { name: 'Civic', department: 'Civic', priorityWeight: 3 },
  { name: 'Society', department: 'Society', priorityWeight: 2 },
  { name: 'Other', department: 'General', priorityWeight: 1 },
];

(async () => {
  await connectDB();
  for (const cat of DEFAULT_CATEGORIES) {
    const exists = await Category.findOne({ name: cat.name });
    if (!exists) {
      await Category.create(cat);
      console.log(`Seeded: ${cat.name}`);
    } else {
      console.log(`Already exists, skipped: ${cat.name}`);
    }
  }
  console.log('Seeding done.');
  mongoose.connection.close();
})();