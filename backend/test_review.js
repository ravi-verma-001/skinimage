const mongoose = require('mongoose');
require('dotenv').config();

const run = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nextskin');
    console.log('Connected.');

    const dbHelper = require('./dbHelper');
    
    console.log('Testing createReview...');
    const review = await dbHelper.createReview({
      productId: '6a6877ddb3275499ede5ae0b',
      userName: 'Test User',
      email: 'test@example.com',
      rating: 5,
      comment: 'This is a test comment',
      isVerifiedPurchase: false,
      isApproved: false
    });
    
    console.log('Success:', review);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
};

run();
