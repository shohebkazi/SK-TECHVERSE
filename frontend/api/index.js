// Vercel zero-config convention: any file under /api (relative to the
// Project's Root Directory, which is set to "frontend") becomes a
// serverless function automatically — no builds/routes config needed.
// This just forwards every request to our normal Express app.
module.exports = require('../backend/server');
