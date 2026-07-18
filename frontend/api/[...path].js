// Vercel's native "catch-all" function convention: this file (using the
// [...path] filename syntax) automatically handles EVERY request under
// /api/* — /api/auth/login, /api/projects, /api/orders/123, etc. — without
// needing any custom rewrite rule for it in vercel.json. This is the most
// reliable way to run a full Express app as a single Vercel Function.
module.exports = require('../backend/server');
