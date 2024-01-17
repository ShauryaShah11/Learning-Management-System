import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';

const storage = multer.memoryStorage(); // Use memory storage for handling files as buffers
const upload = multer({ storage });
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

const getVideoDuration = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    // Check if the file is a video before attempting to get duration
    if (!req.type === 'video') {
      resolve(null);
    }

    ffmpeg()
      .input(fileBuffer)
      .ffprobe((err, metadata) => {
        if (err) {
          reject(err);
        } else {
          const durationInSeconds = metadata.format.duration;
          resolve(durationInSeconds);
        }
      });
  });
};

const uploadFiles = async (req, res, next) => {
  const singleUpload = upload.single('file');

  singleUpload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error uploading file' });
    }
    const type = req.type === 'video' ? 'videos' : 'images'

    // If file upload is successful, upload to Cloudinary
    try {
      const result = await cloudinary.uploader.upload(req.file.buffer, {
        folder: type, 
      });

      // Attach file URL to req object
      req.fileUrl = result.secure_url;
      req.fileSize = req.file.size
      req.duration = await getVideoDuration(result.file.buffer);
      next();
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      return res.status(500).json({ error: 'Error uploading to Cloudinary' });
    }
  });
}
export { uploadFiles };
