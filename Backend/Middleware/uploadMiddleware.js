const multer = require('multer');
const path   = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_PATH || './uploads');
  },
  filename: (req, file, cb) => {
    const ext  = path.extname(file.originalname);
    const name = `visitor_${Date.now()}${ext}`;
    cb(null, name);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  allowed.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error('Only JPEG/PNG/WEBP allowed'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: +process.env.MAX_FILE_SIZE || 5_000_000 }
});

module.exports = upload;