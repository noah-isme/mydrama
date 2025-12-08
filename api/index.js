import app from '../backend/server.js';

// Vercel serverless function handler
export default async (req, res) => {
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Pass to Express app
  return app(req, res);
};
