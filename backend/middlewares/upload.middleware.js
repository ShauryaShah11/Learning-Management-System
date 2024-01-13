import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads/")); // Use an absolute path with join
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Generate unique filenames
  },
});

const upload = multer({
  storage: storage,
});

// Middleware to handle file upload and attach file path to request object
const uploadFile = (req, res, next) => {
  upload.single('file')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return res.status(500).json({ error: 'Multer error' });
    } else if (err) {
      // An unknown error occurred
      return res.status(500).json({ error: 'Unknown error' });
    }

    // File uploaded successfully, attach file path to request object
    req.filePath = req.file ? path.join(__dirname, "../public/uploads/", req.file.filename) : null;
    next();
  });
};

export { uploadFile };
