const multer = require('multer');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_EXT = ['.jpeg', '.jpg', '.png', '.gif', '.mp4', '.mov', '.avi', '.webm'];
const ALLOWED_MIME = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'video/mp4',
  'video/quicktime', // .mov
  'video/x-msvideo', // .avi
  'video/avi',
  'video/msvideo',
  'video/webm',
];

const fileFilter = (req, file, cb) => {
  const extValid = ALLOWED_EXT.includes(path.extname(file.originalname).toLowerCase());
  const mimeValid = ALLOWED_MIME.includes(file.mimetype);

  if (extValid && mimeValid) {
    cb(null, true);
  } else {
    cb(new Error('Only images (jpg, png, gif) and videos (mp4, mov, avi, webm) are allowed'));
  }
};

// File memory me aati hai, phir seedha Cloudinary pe jaati hai (disk pe kuch save nahi hota)
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});

const uploadToCloudinary = (file) =>
  new Promise((resolve, reject) => {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return reject(new Error('Cloudinary env variables are missing'));
    }
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'urbanvoice', resource_type: 'auto' },
      (error, result) => (error ? reject(error) : resolve(result.secure_url))
    );
    stream.end(file.buffer);
  });

module.exports = upload;
module.exports.uploadToCloudinary = uploadToCloudinary;