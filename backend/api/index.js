// Vercel convention: any file under /api becomes a serverless function.
// This single file forwards every request to our normal Express app
// (server.js), so all existing routes (/api/auth, /api/projects, ...)
// keep working exactly as they do locally — no route code duplicated.
module.exports = require('../server');
