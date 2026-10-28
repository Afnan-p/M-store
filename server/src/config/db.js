const mongoose = require('mongoose');
const dns = require('dns');

// Use reliable public DNS (Google & Cloudflare) to prevent local ISP/Wi-Fi DNS SRV query failures
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (dnsErr) {
  console.warn('[DNS Warning] Could not configure custom DNS servers:', dnsErr.message);
}

// Global caching for Serverless environments (Vercel / AWS Lambda)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // If connection is already open and ready (readyState === 1), return cached connection
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mstore_db';

    // Register event listeners once
    if (mongoose.connection.listenerCount('error') === 0) {
      mongoose.connection.on('connected', () => {
        console.log('[MongoDB Event] Mongoose connected to Atlas DB cluster');
      });
      mongoose.connection.on('error', (err) => {
        console.error('[MongoDB Event Error]:', err.message);
      });
      mongoose.connection.on('disconnected', () => {
        console.warn('[MongoDB Event Warning] Mongoose disconnected');
        cached.conn = null;
        cached.promise = null;
      });
    }

    cached.promise = mongoose
      .connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
        maxPoolSize: 10, // Maintain up to 10 socket connections
      })
      .then((m) => {
        console.log(`[MongoDB] Connected Successfully: ${m.connection.host}`);
        return m;
      })
      .catch((error) => {
        cached.promise = null;
        console.warn(`[MongoDB Warning] Database connection deferred/unavailable: ${error.message}`);
        console.log('[MongoDB] Running in fallback mode or awaiting database connection.');
        return null;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

module.exports = connectDB;
