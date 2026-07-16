const mongoose = require('mongoose');

let isConnected = false;
let useMockDB = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nextskin', {
      serverSelectionTimeoutMS: 3000 // Quick timeout to fall back
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
    useMockDB = false;
  } catch (error) {
    console.warn(`MongoDB Connection Failed: ${error.message}`);
    console.log('FALLING BACK TO LOCAL FILE-BASED DATABASE (db.json) for smooth previewing!');
    useMockDB = true;
  }
};

const getDBMode = () => useMockDB;

module.exports = { connectDB, getDBMode };
