/**
 * New project screenshots are uploaded straight to Cloudinary, which
 * already returns a full https:// URL — that must be used as-is.
 * Any older/legacy images (uploaded back when files were saved to local
 * disk) are still stored as a relative "/uploads/..." path and need the
 * API's origin prefixed to become loadable.
 */
export function resolveImageUrl(path, fileBase) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${fileBase}${path}`;
}
