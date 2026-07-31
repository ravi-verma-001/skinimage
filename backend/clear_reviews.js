const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { connectDB } = require('./db');
const { Review, Product } = require('./dbHelper');

const DB_FILE = path.join(__dirname, 'db.json');

async function clearReviews() {
  console.log('--- PURGING ALL REVIEWS ---');

  // 1. Clear JSON Database (db.json)
  if (fs.existsSync(DB_FILE)) {
    console.log(`Reading local JSON database: ${DB_FILE}`);
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      
      parsed.reviews = [];
      if (parsed.products) {
        parsed.products.forEach(p => {
          p.rating = 5.0;
          p.reviewsCount = 0;
        });
      }

      fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
      console.log('✓ Successfully cleared all reviews and reset ratings in backend/db.json');
    } catch (err) {
      console.error('✗ Failed to clear local JSON database:', err.message);
    }
  } else {
    console.log('Local JSON database backend/db.json does not exist. Skipping.');
  }

  // 2. Clear MongoDB Database
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('✓ Connected to MongoDB');

    // Delete all reviews
    const deleteResult = await Review.deleteMany({});
    console.log(`✓ Deleted ${deleteResult.deletedCount} reviews from MongoDB 'reviews' collection`);

    // Reset ratings and review counts for all products
    const updateResult = await Product.updateMany({}, {
      $set: {
        rating: 5.0,
        reviewsCount: 0
      }
    });
    console.log(`✓ Reset ratings and reviewsCount for ${updateResult.modifiedCount} products in MongoDB`);
  } catch (err) {
    console.error('✗ Failed to clear MongoDB:', err.message);
  }

  console.log('--- PURGE COMPLETED ---');
  process.exit(0);
}

clearReviews();
