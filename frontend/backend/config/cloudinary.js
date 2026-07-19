const cloudinary = require('cloudinary').v2;

// .trim() guards against the single most common cause of Cloudinary's
// "Invalid Signature" error: a stray trailing space or \r character that
// sneaks in when copy-pasting credentials into a .env file on Windows.
// Even one invisible extra character here changes the computed signature
// and every upload fails with a cryptic error.
const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || '').trim();
const apiKey    = (process.env.CLOUDINARY_API_KEY || '').trim();
const apiSecret = (process.env.CLOUDINARY_API_SECRET || '').trim();

cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

// Startup diagnostic — prints a masked summary so a missing/misconfigured
// credential shows up immediately in the server logs instead of only
// surfacing later as a cryptic "Invalid Signature" error on first upload.
if (!cloudName || !apiKey || !apiSecret) {
  console.warn('⚠️  Cloudinary is NOT fully configured — image uploads will fail. Missing:',
    [!cloudName && 'CLOUDINARY_CLOUD_NAME', !apiKey && 'CLOUDINARY_API_KEY', !apiSecret && 'CLOUDINARY_API_SECRET']
      .filter(Boolean).join(', '));
} else {
  console.log(`✅  Cloudinary configured — cloud_name="${cloudName}", api_key="${apiKey.slice(0, 4)}...${apiKey.slice(-2)}" (${apiKey.length} chars), api_secret length=${apiSecret.length} chars`);
}

module.exports = cloudinary;


