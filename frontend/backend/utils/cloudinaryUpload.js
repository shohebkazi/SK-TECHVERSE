const cloudinary = require('../config/cloudinary');

/**
 * Uploads an in-memory file buffer (from multer's memoryStorage) to Cloudinary
 * and resolves with the permanent, publicly-accessible secure_url.
 *
 * We use memoryStorage + this upload_stream helper (instead of multer's disk
 * storage) because serverless platforms like Vercel give each function an
 * ephemeral, read-mostly filesystem — anything written to disk during a
 * request is gone by the next invocation. Cloudinary gives us a real,
 * permanent home for uploaded project screenshots.
 */
function uploadBufferToCloudinary(buffer, folder = 'sk-techverse/projects') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
}

async function uploadManyBuffers(files, folder) {
  const results = await Promise.all(files.map((f) => uploadBufferToCloudinary(f.buffer, folder)));
  return results.map((r) => r.secure_url);
}

module.exports = { uploadBufferToCloudinary, uploadManyBuffers };
