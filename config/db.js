const mongoose = require('mongoose');

module.exports = async () => {
  try {
    mongoose.set('debug', true); // Enable debug logging
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err; // Throw error to be caught in app.js
  }
};