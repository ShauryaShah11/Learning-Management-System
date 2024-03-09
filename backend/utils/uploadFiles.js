import { z } from "zod";
import { cloudinary } from "../config/cloudinary.js";
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

const uploadFiles = async (file, fileType) => {
    try {
        const validationResult = fileTypeSchema.safeParse(fileType);

        if (!validationResult.success) {
            throw new Error("Invalid file format");
        }

        if (!file) {
            throw new Error("No file provided");
        }

        const result = await cloudinary.uploader.upload(file.path, {
            folder: fileType,
            public_id: `${Date.now()}`,
            resource_type: "auto",
        });

        let duration;
        if (fileType === "videos") {
            duration = await getVideoDuration(fileType, result.secure_url);
        }

        return {
            fileUrl: result.secure_url,
            duration,
        };
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        throw error;
    }
};

export { uploadFiles };
