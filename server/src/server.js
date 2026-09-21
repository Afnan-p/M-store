const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Connect to MongoDB
connectDB();

const app = express();

// Security Headers
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Production-Ready CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests or matched origins or dev mode
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('CORS Policy Rejection: Origin not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting
const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // 500 requests per 15 min window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25, // 25 attempts per 15 min window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts, please try again later.' },
});

app.use('/api/', generalApiLimiter);
app.use('/api/auth/login', authLimiter);

// Mounting API Routes
app.use('/api/health', require('./routes/health'));
app.use('/api/stores', require('./routes/stores'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/offer-products', require('./routes/offerProducts'));
app.use('/api/stock', require('./routes/stock'));
app.use('/api/segments', require('./routes/segments'));

// Root Endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'M-Store Backend REST API',
    version: '1.0.0',
    status: 'online',
    environment: process.env.NODE_ENV || 'development',
    endpoints: [
      '/api/health',
      '/api/stores',
      '/api/products',
      '/api/categories',
      '/api/offer-products',
      '/api/auth/login',
      '/api/upload',
    ],
  });
});

// Centralized Global Error Handler
app.use((err, req, res, next) => {
  console.error('[API Error]:', err.stack || err.message);
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: process.env.NODE_ENV === 'production' && statusCode === 500 ? 'Internal Server Error' : err.message,
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 M-Store Backend Express API running on port ${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});

// Graceful Shutdown Handler
const shutdown = (signal) => {
  console.log(`\n[Server] Received ${signal}. Starting graceful shutdown...`);
  server.close(() => {
    console.log('[Server] HTTP server closed.');
    mongoose.connection.close(false, () => {
      console.log('[MongoDB] Mongoose connection closed.');
      process.exit(0);
    });
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

module.exports = app;
