import { z } from "zod";
import { cloudinary } from "../config/cloudinary.js";
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

const getVideoDuration = (fileType, fileUrl) => {
    return new Promise((resolve, reject) => {
        if (fileType !== "videos") {
            resolve(null);
        } else {
            ffmpeg.ffprobe(fileUrl, function(err, metadata) {
                if (err) {
                    reject(err);
                } else {
                    resolve(Math.round(metadata.format.duration));
                }
            });
        }
    });
};

const fileTypeSchema = z.enum(["videos", "images", "pdf", "others"]);

const uploadFiles = async (file, fileType) => {
    try {
        const validationResult = fileTypeSchema.safeParse(fileType);

        if (!validationResult.success) {
            throw new Error("Invalid file format");
        }

        if (!file) {
            throw new Error("No file provided");
        }

        // Define upload options based on file type
        let uploadOptions = {
            folder: fileType,
            public_id: `${Date.now()}`,
            resource_type: "auto",
        };

        // Special handling for PDFs
        if (fileType === "pdf") {
            // For PDFs, we need to use raw resource type
            uploadOptions = {
                folder: fileType,
                // Don't include the extension in the public_id
                public_id: `${Date.now()}`,
                resource_type: "raw",
            };
        }

        const result = await cloudinary.uploader.upload(file.path, uploadOptions);

        let duration = 0;
        if (fileType === "videos") {
            duration = await getVideoDuration(fileType, result.secure_url);
        }
        
        // Use the Cloudinary URL directly without modification
        let fileUrl = result.secure_url;
        
        return {
            fileUrl,
            duration,
            publicId: result.public_id,
            format: result.format || (fileType === "pdf" ? "pdf" : undefined)
        };
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        console.error("File details:", file ? { 
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size 
        } : "No file");
        throw error;
    }
};

export { uploadFiles };