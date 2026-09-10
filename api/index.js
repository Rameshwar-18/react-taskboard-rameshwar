import app from '../server/src/app.js';
import { connectDB } from '../server/src/config/db.js';

/**
 * Vercel Serverless Function entry point
 * Bridges Vercel serverless requests to the Express application with connection caching.
 */
export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.error('Serverless database connection failed:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Database connection error'
    });
  }

  return app(req, res);
}
