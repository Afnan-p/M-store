// Vercel Serverless Function entrypoint for M-Store Express Backend
process.env.VERCEL = process.env.VERCEL || '1';

const app = require('../server/src/server');

module.exports = app;
