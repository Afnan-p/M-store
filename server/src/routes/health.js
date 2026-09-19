const express = require('express');
const router = express.Router();

// GET /api/health - Lightweight health check for UptimeRobot & Render Keep-Alive
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'M-Store Backend API is healthy and active',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

module.exports = router;
