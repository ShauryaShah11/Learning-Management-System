import { z } from "zod";
import { cloudinary } from "../config/cloudinary.js";
import ffmpeg from "fluent-ffmpeg";
import { getVideoDurationInSeconds } from "get-video-duration";

const getVideoDuration = (fileType, fileUrl) => {
    return new Promise(async (resolve, reject) => {
        if (fileType !== "videos") {
            resolve(null);
        } else {
            try {
                const duration = await getVideoDurationInSeconds(fileUrl);
                resolve(Math.round(duration));
            } catch (error) {
                reject(error);
            }
        }
    });
};

const fileTypeSchema = z.enum(["videos", "images", "pdf", "others"]);

const uploadFiles = async (req, res, next) => {
    const fileType = req.body.type;
    try {
        const validationResult = fileTypeSchema.safeParse(fileType);

        if (!validationResult.success) {
            return res.status(400).json({
                error: "Invalid file format",
                details: validationResult.error.errors,
            });
        }

        if (!req.file) {
            return res.status(400).json({
                error: "No file attached to the request",
            });
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: fileType,
            public_id: `${Date.now()}`,
            resource_type: "auto",
        });
        if (fileType === "videos") {
            req.duration = await getVideoDuration(fileType, result.secure_url);
        }
        req.fileUrl = result.secure_url;
        next();
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return res.status(500).json({ error: "Error uploading to Cloudinary" });
    }
};

export { uploadFiles };
