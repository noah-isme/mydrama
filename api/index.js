import app from '../backend/server.js';

// Vercel serverless function handler
export default async (req, res) => {
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Rewrite path to remove /api prefix for Express routing
  const originalUrl = req.url;
  req.url = originalUrl.replace(/^\/api/, '') || '/';
  
  // Pass to Express app
  return app(req, res);
};
