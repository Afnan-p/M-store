const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect, adminOnly } = require('../middleware/auth');

// Configure Cloudinary securely
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo_mstore',
  api_key: process.env.CLOUDINARY_API_KEY || '123456789012345',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'abcdefghijklmnopqrstuvwxyz12',
});

// Allowed Image MIME types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

// Configure Multer storage in memory with Strict File Validation
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WebP, GIF, and AVIF images are allowed.'));
    }
  },
});

// POST /api/upload - Single image upload route (Admin Only)
router.post('/', protect, adminOnly, (req, res, next) => {
  upload.single('image')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File size exceeds maximum 5MB limit' });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image file uploaded' });
      }

      // Check if Cloudinary credentials are configured
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'demo_mstore') {
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'mstore',
          transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto', fetch_format: 'webp' }],
        });

        return res.json({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }

      // Fallback response for dev mode
      const mockUrl = `/images/products/${Date.now()}-${req.file.originalname}`;
      return res.json({
        url: mockUrl,
        message: 'Image upload successful (Configure Cloudinary credentials in server/.env for live cloud storage)',
      });
    } catch (error) {
      console.error('[Cloudinary Upload Error]:', error.message);
      return res.status(500).json({ message: 'Image upload failed' });
    }
  });
});

// DELETE /api/upload - Delete image from Cloudinary (Admin Only)
router.delete('/', protect, adminOnly, async (req, res) => {
  const { public_id } = req.body;
  if (!public_id) {
    return res.status(400).json({ message: 'public_id is required for deletion' });
  }

  try {
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'demo_mstore') {
      const result = await cloudinary.uploader.destroy(public_id);
      return res.json({ message: 'Image deleted from Cloudinary', result });
    }
    return res.json({ message: 'Mock image deleted successfully' });
  } catch (err) {
    console.error('[Cloudinary Delete Error]:', err.message);
    return res.status(500).json({ message: 'Image deletion failed' });
  }
});

module.exports = router;
