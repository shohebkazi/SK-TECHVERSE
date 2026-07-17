const multer = require('multer');
const path = require('path');

// Files are kept in memory (not written to disk) and immediately streamed to
// Cloudinary by the route handler — see utils/cloudinaryUpload.js. This is
// what makes uploads survive on serverless platforms like Vercel, whose
// filesystem is ephemeral/read-only between invocations.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) return cb(null, true);
  cb(new Error('Only image files (jpg, png, webp, gif) are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per image
});

module.exports = upload;
