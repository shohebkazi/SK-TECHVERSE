const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');
const path       = require('path');
require('dotenv').config();

const app = express();

// ── Security ──────────────────────────────────────────────────
// crossOriginResourcePolicy is relaxed to 'cross-origin' so that any
// legacy /uploads assets (or images from another origin during local dev)
// aren't silently blocked by Helmet's default 'same-origin' policy.
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
// Kept for backward compatibility with any already-uploaded files from local
// dev / pre-Cloudinary data. New uploads go straight to Cloudinary (see
// utils/cloudinaryUpload.js) since serverless platforms like Vercel don't
// offer a persistent filesystem for this folder to actually live on.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 120, message: 'Too many requests' });
app.use('/api/', limiter);

// ── Database (serverless-safe cached connection) ────────────────
// A serverless function can be invoked many times against the same warm
// container, so we cache the connection promise instead of reconnecting
// (and instead of crashing the whole process on a transient error, which
// would take the entire app down on Vercel).
let dbPromise = null;
function connectDB() {
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  if (!dbPromise) {
    dbPromise = mongoose
      .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sk-techverse', {
        // Fail fast (5s) instead of the ~30s default — on a serverless
        // function with a ~10s execution limit, a slow/blocked connection
        // (e.g. MongoDB Atlas IP whitelist not including Vercel) would
        // otherwise get killed mid-request with no response at all, which
        // shows up in the browser as "Unexpected end of JSON input".
        serverSelectionTimeoutMS: 5000,
      })
      .then(() => console.log('✅  MongoDB connected'))
      .catch((err) => {
        dbPromise = null;
        console.error('❌  MongoDB error:', err.message);
        throw err;
      });
  }
  return dbPromise;
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(503).json({ message: 'Database connection failed' });
  }
});

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/projects',     require('./routes/projects'));
app.use('/api/services',     require('./routes/services'));
app.use('/api/contacts',     require('./routes/contacts'));
app.use('/api/orders',       require('./routes/orders'));
app.use('/api/blog',         require('./routes/blog'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/admin',        require('./routes/admin'));

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (req, res) =>
  res.json({ status: 'OK', app: 'SK TECHVERSE API', timestamp: new Date() })
);

// ── 404 ───────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// ── Error handler ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

// ── Start (local / traditional server only) ─────────────────────
// On Vercel, this file is required by api/index.js as a serverless
// function handler — Vercel manages the listening itself, so app.listen()
// must NOT run there (it would just be ignored, but we skip it cleanly).
if (!process.env.VERCEL) {
  connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`🚀  SK TECHVERSE API running on http://localhost:${PORT}`)
  );
}

module.exports = app;
