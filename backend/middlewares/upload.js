import multer from 'multer';
import { cloudinary } from '../config/cloudinary.js';
import ffmpeg from 'fluent-ffmpeg';
import sizeOf from 'image-size';

const isValidImage = (fileBuffer) => {
  try {
    const dimensions = sizeOf(fileBuffer);
    return dimensions.width > 0 && dimensions.height > 0;
  } catch (error) {
    return false;
  }
};

const getVideoDuration = (fileBuffer, fileType) => {
  return new Promise((resolve, reject) => {
    if (fileType !== 'video') {
      resolve(null);
    } else {
      ffmpeg()
        .input(fileBuffer)
        .on('end', function () {
          resolve(this.ffprobeData.format.duration);
        })
        .on('error', function (err) {
          reject(err);
        })
        .run();
    }
  });
};

const uploadFiles = (req, res, next) => {
  const fileType = req.body.type === 'videos' ? 'videos' : 'images';
  console.log('File Type:', fileType);

  try {
    // Check if the file is a valid image
    if (fileType === 'images' && !isValidImage(req.file.buffer)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image file. Please upload a valid image.',
      });
    }

    cloudinary.uploader.upload(
      req.file.path,
      { folder: fileType },
      async (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            success: false,
            message: 'Error',
          });
        } else {
          req.fileUrl = result.secure_url;
          req.duration = await getVideoDuration(req.file.buffer, fileType);
          next();
        }
      }
    );
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return res.status(500).json({ error: 'Error uploading to Cloudinary' });
  }
};

export { uploadFiles };
