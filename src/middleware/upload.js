import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    !file.mimetype ||
    file.mimetype.startsWith('image/') ||
    file.mimetype.startsWith('video/') ||
    file.mimetype.includes('pdf') ||
    file.mimetype.includes('document') ||
    file.mimetype.includes('word') ||
    file.mimetype.includes('octet-stream')
  ) {
    cb(null, true);
  } else {
    cb(null, true);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024 // 25 MB limit
  },
  fileFilter
});
