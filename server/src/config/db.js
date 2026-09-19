const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connection event listeners for production monitoring
    mongoose.connection.on('connected', () => {
      console.log('[MongoDB Event] Mongoose connected to Atlas DB cluster');
    });

    mongoose.connection.on('error', (err) => {
      console.error('[MongoDB Event Error]:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB Event Warning] Mongoose connection lost/disconnected');
    });

    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mstore_db',
      {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
        maxPoolSize: 10, // Maintain up to 10 socket connections
      }
    );
    console.log(`[MongoDB] Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB Warning] Database connection deferred/unavailable: ${error.message}`);
    console.log('[MongoDB] Running in fallback mode or awaiting database connection.');
  }
};

module.exports = connectDB;
