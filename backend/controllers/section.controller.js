import { z } from "zod";
import mongoose from "mongoose";
import Section from "../models/Section.model.js";
import Course from "../models/Course.model.js";
import { uploadFiles } from "../utils/uploadFiles.js";
import Subsection from "../models/Subsection.model.js";

const subSectionSchema = z.object({
    title: z.string().min(1),
    type: z.string(),
    url: z.string(),
    duration: z
        .number()
        .optional()
        .transform((value) => value ?? 0),
    order: z.number().default(0),
    completedByStudents: z.array(z.string()).optional(), // Assuming it's an array of user IDs
});

const IdSchema = z.string().refine(
    (val) => {
        return mongoose.Types.ObjectId.isValid(val);
    },
    {
        message: "Invalid Id format",
    }
);

const validateId = (Id) => {
    const validationResult = IdSchema.safeParse(Id);
    return validationResult.success
        ? null
        : {
              error: "Invalid id format",
              details: validationResult.error.errors,
          };
};

const courseMaterialController = {
    addSection: async (req, res) => {
        try {
            const courseId = req.params.courseId;
            const title = req.body.title;
            const validationIdError = validateId(courseId);
            if (validationIdError) {
                return res.status(400).json(validationIdError);
            }
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({
                    error: "Course not found",
                });
            }
            await Section.create({
                title,
                course: courseId,
            });
            return res.status(201).json({
                message: "Section Added Successfully"
            })
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: "Internal Server Error",
            });
        }
    },

    getSection: async (req, res) => {
        try{
            const courseId = req.params.courseId;
            const validationIdError = validateId(courseId);
            if (validationIdError){
                return res.status(400).json(validationIdError);
            }
            const course = await Course.findById(courseId);
            if(!course){
                return res.status(404).json({
                    error: "Course not found"
                });
            }
            const section = await Section.find({
                course: courseId
            })
            return res.status(200).json(section);
        }
        catch(error){
            console.error(error);
            return res.status(500).json({
                error: "Internal Server Error",
            });
        }
    },

    getSubSection: async (req, res) => {
        try{
            const sectionId = req.params.sectionId;
            const validationIdError = validateId(sectionId);
            if (validationIdError){
                return res.status(400).json(validationIdError);
            }
            const section = await Section.findById(sectionId);
            if(!section){
                return res.status(404).json({
                    error: "Section not found"
                });
            }
            const subsectionIds = section.subsections;
            const subsections = await Subsection.find({
                '_id': { $in: subsectionIds }
            })
            return res.status(200).json(subsections);
        }
        catch(error){
            console.error(error);
            return res.status(500).json({
                error: "Internal Server Error",
            });
        }
    },

    getSectionById: async (req, res) => {
        try{
            const sectionId = req.params.sectionId;
            const validationIdError = validateId(sectionId);
            if (validationIdError){
                return res.status(400).json(validationIdError);
            }
            const section = await Section.findById(sectionId);
            if(!section){
                return res.status(404).json({
                    error: "section not found"
                });
            }
            return res.status(200).json(section);
        }
        catch(error){
            console.error(error);
            return res.status(500).json({
                error: "Internal Server Error",
            });
        }
    },

    getSubSectionById: async (req, res) => {
        try{
            const subsectionId = req.params.subsectionId;
            const validationIdError = validateId(subsectionId);
            if (validationIdError){
                return res.status(400).json(validationIdError);
            }
            const subsection = await Subsection.findById(subsectionId);
            if(!subsection){
                return res.status(404).json({
                    error: "sub section not found"
                });
            }
            return res.status(200).json(subsection);
        }
        catch(error){
            console.error(error);
            return res.status(500).json({
                error: "Internal Server Error",
            });
        }
    },

    addSubSection: async (req, res) => {
        try {
            const sectionId = req.params.sectionId;
            const { title, order } = req.body;
            const validationIdError = validateId(sectionId);
            if (validationIdError) {
                return res.status(400).json(validationIdError);
            }
            const section = await Section.findById(sectionId);
            if (!section) {
                return res.status(404).json({
                    error: "Section not found",
                });
            }
            const {
                file,
                body: { type },
            } = req;
            const uploadResult = await uploadFiles(file, type);

            const url = uploadResult.fileUrl;
            const duration = uploadResult.duration;
            const subsection = new Subsection({
                title,
                type,
                url,
                duration,
                order,
                section: sectionId,
            });
            const savedSection = await subsection.save();

            await Section.findByIdAndUpdate(sectionId, {
                $push: {
                    subsections: savedSection._id,
                },
            });

            const course = await Course.findById(section.course);
            course.numberOfMaterials += 1;
            await course.save();

            return res.status(201).json({
                message: "Section created and added to the course successfully",
                section,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: "Internal Server Error",
            });
        }
    },

    removeSection: async (req, res) => {
        try {
            const sectionId = req.params.sectionId;
            const validationIdError = validateId(sectionId);
            if (validationIdError) {
                return res.status(400).json(validationIdError);
            }
            await Section.findByIdAndDelete(sectionId, { new: true });
            return res
                .status(201)
                .json({ message: "Section deleted successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    updateSection: async (req, res) => {
        try {
            const sectionId = req.params.sectionId;
            const validationIdError = validateId(sectionId);
            if (validationIdError) {
                return res.status(400).json(validationIdError);
            }
            const title = req.body.title;

            const section = await Section.findById(sectionId);
            if (!section) {
                return res.status(404).json({
                    error: "section not found",
                });
            }

            await Section.findByIdAndUpdate(sectionId, { title: title });

            return res.status(201).json({
                message: "section is succesfully updated",
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    updateSubSection: async (req, res) => {
        try {
            const subSectionId = req.params.subsectionId;

            const validationSubSectionIdError = validateId(subSectionId);
            if (validationSubSectionIdError) {
                return res.status(400).json(validationSubSectionIdError);
            }

            const subsection = await Subsection.findById(subSectionId);

            if (!subsection) {
                return res.status(404).json({ error: "SubSection not found" });
            }
            const {
                file,
                body: { type },
            } = req;
            let fileUrl, videoDuration;
            if (file) {
                const uploadResult = await uploadFiles(file, type);
                fileUrl = uploadResult.fileUrl;
                videoDuration = uploadResult.duration;
            }

            const { title } = req.body;

            subsection.title = title;
            subsection.url = fileUrl === undefined ? subsection.url : fileUrl;
            subsection.duration = videoDuration === undefined ? subsection.duration : videoDuration;

            await subsection.save();
            return res.status(200).json({
                message: "Subsection updated successfully",
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    removeSubSection: async (req, res) => {
        try {
            const sectionId = req.body.sectionId;
            const validationIdError = validateId(sectionId);
            if (validationIdError) {
                return res.status(400).json(validationIdError);
            }
            const subSectionId = req.params.subSectionId;

            const section = await Section.findById(sectionId);

            if (!section) {
                return res.status(404).json({ error: "Section not found" });
            }
            // Find the index of the subsection in the subsections array
            const subSectionIndex = section.subsections.findIndex(
                (subSection) => subSection._id == subSectionId
            );
            // Check if the subsection exists
            if (subSectionIndex === -1) {
                return res.status(404).json({ error: "Subsection not found" });
            }
            // Remove the subsection from the array
            section.subsections.splice(subSectionIndex, 1);

            await section.save();

            return res
                .status(200)
                .json({ message: "Subsection deleted successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
};

export default courseMaterialController;
