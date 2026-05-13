require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Find users with no mobileNumber but have a contactNumber
  const users = await User.find({ mobileNumber: { $in: [null, undefined, ''] } });
  console.log(`Found ${users.length} users without mobileNumber`);

  let updated = 0, skipped = 0;

  for (const user of users) {
    // Strip all non-digits, then take last 10 digits
    const digits = (user.contactNumber || '').replace(/\D/g, '').slice(-10);

    if (digits.length === 10) {
      try {
        await User.updateOne({ _id: user._id }, { $set: { mobileNumber: digits } });
        console.log(`  ✓ ${user.email || user._id} → ${digits}`);
        updated++;
      } catch (err) {
        console.log(`  ✗ ${user.email || user._id} → duplicate or error: ${err.message}`);
        skipped++;
      }
    } else {
      console.log(`  ⚠ ${user.email || user._id} → contactNumber "${user.contactNumber}" not usable, skipped`);
      skipped++;
    }
  }

  console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`);
  await mongoose.disconnect();
}

migrate().catch(err => { console.error(err); process.exit(1); });
