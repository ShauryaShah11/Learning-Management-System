import { z } from "zod";
import mongoose from "mongoose";
import User from "../models/User.model.js";
import Course from "../models/Course.model.js";
import CourseCategory from "../models/CourseCategory.model.js";

const coureSchema = z.object({
    courseName: z.string().min(1).max(50),
    price: z.number().min(0),
    duration: z.string().min(1).max(50).optional(),
    description: z.string().min(1).max(200),
    level: z.enum(["beginner", "intermediate", "advanced"]),
    prerequisites: z.array(z.string()),
    language: z.string(),
    tutor: z.instanceof(mongoose.Types.ObjectId),
    category: z.instanceof(mongoose.Types.ObjectId),
});

const courseIdSchema = z.string().refine(
    (val) => {
        return mongoose.Types.ObjectId.isValid(val);
    },
    {
        message: "Invalid courseId format",
    }
);

const validateCourseId = (courseId) => {
    const validationResult = courseIdSchema.safeParse(courseId);
    return validationResult.success
        ? null
        : {
              error: "Invalid course id format",
              details: validationResult.error.errors,
          };
};

const courseController = {
    createCourse: async (req, res) => {
        try {
            const { courseName, duration, description, level, language } =
                req.body;
            const price = parseFloat(req.body.price);
            const prerequisites = req.body.prerequisites.split(",");
            const category = new mongoose.Types.ObjectId(req.body.category);
            const userId = req.user._id;
            if (req.user.role !== "tutor") {
                return res.status(403).json({ error: "Unauthorized access" });
            }
            const thumbnailUrl = req.fileUrl;
            const course = new Course({
                courseName,
                price,
                duration,
                description,
                level,
                prerequisites,
                language,
                tutor: userId,
                category,
                thumbnailUrl,
            });
            const validateCourse = coureSchema.safeParse(course);
            if (!validateCourse.success) {
                console.log(validateCourse.error.errors)
                return res.status(400).json({
                    error: "Invalid course format",
                    details: validateCourse.error.errors,
                });
            }
            const savedCourse = await course.save();

            const courseCategory = await CourseCategory.findById(category);
            await CourseCategory.findByIdAndUpdate(category, {
                $push: {
                    courses: savedCourse._id,
                },
            });
            return res
                .status(200)
                .json({ message: "Course saved successfully" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Internal Server Error",
                message: error.message,
            });
        }
    },

    updateCourse: async (req, res) => {
        try {
            const courseId = req.params.courseId;
            const { courseName, duration, description, level, language } =
                req.body;
            const price = parseFloat(req.body.price);
            const prerequisites = req.body.prerequisites.split(",");
            const category = new mongoose.Types.ObjectId(req.body.category);
            const course = await Course.findById(courseId);

            if (!course) {
                return res.status(404).json({ error: "Course not found" });
            }
            const thumbnailUrl = req.fileUrl;
            const updateCourse = {
                courseName,
                price,
                duration,
                description,
                level,
                prerequisites,
                language,
                tutor: course.tutor,
                category,
                thumbnailUrl,
            };
            const validateCourse = coureSchema.safeParse(updateCourse);
            if (!validateCourse.success) {
                console.log(validateCourse.error.errors);
                return res.status(400).json({
                    error: "Invalid course format",
                    details: validateCourse.error.errors,
                });
            }

            const updatedCourse = await Course.findByIdAndUpdate(
                courseId,
                updateCourse,
                { new: true }
            );
            if (course.category !== category) {
                await CourseCategory.findByIdAndUpdate(
                    category,
                    { $pull: { courses: course._id } },
                    { new: true }
                );
                await CourseCategory.findByIdAndUpdate(category, {
                    $push: {
                        courses: updatedCourse._id,
                    },
                });
            }

            return res.status(200).json({
                message: "Course successfully updated",
                updatedCourse,
            });
        } catch (error) {
            console.error("Error updating course:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    deleteCourse: async (req, res) => {
        try {
            const courseId = req.params.courseId;
            const validationIdError = validateCourseId(courseId);
            if (validationIdError) {
                return res.status(400).json(validationIdError);
            }
            const course = await Course.findById(courseId);

            if (!course) {
                return res.status(404).json({ error: "Course not found" });
            }
            await CourseCategory.findOneAndUpdate(
                { courses: course._id },
                { $pull: { courses: course._id } }
            );

            await Course.findByIdAndDelete(courseId);

            return res.status(200).json({
                message: "Course successfully deleted",
                deletedCourse: course,
            });
        } catch (error) {
            console.error("Error deleting course:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    publishCourse: async (req, res) => {
        try {
            const id = req.params.courseId;
            const course = await Course.findById(id);
            if (!course) {
                return res.status(404).json({ error: "Course not found" });
            }
            course.published = true;
            await course.save();
            return res
                .status(200)
                .json({ message: "Course published successfully" });
        } catch (error) {
            return res.status(500).json({
                error: "Internal server error",
            });
        }
    },

    getCourse: async (req, res) => {
        try {
            const course = await Course.find({
                published: true,
            });
            return res.status(200).json({
                success: true,
                course,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: "Internal server error",
            });
        }
    },

    getAllCourse: async (req, res) => {
        try {
            const course = await Course.find()
                .populate("tutor")
                .populate("category");
            return res.status(200).json(course);
        } catch (error) {
            return res.status(500).json({
                error: "Internal server error",
            });
        }
    },

    getCourseById: async (req, res) => {
        try {
            const courseId = req.params.courseId;
            const validationIdError = validateCourseId(courseId);
            if (validationIdError) {
                return res.status(400).json(validationIdError);
            }
            const course = await Course.findById(courseId).populate("tutor");
            if (!course) {
                return res.status(404).json({ error: "Course not found" });
            }

            return res.status(200).json(course);
        } catch (error) {
            console.error("Error getting course by id:", error);
            return res.status(500).json({
                error: "Internal server error",
            });
        }
    },

    getCourseByTutorId: async (req, res) => {
        try {
            const id = req.params.tutorId;
            const courses = await Course.find({ tutor: id });

            return res.status(200).json(courses);
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: "Internal server error",
            });
        }
    },
};

export default courseController;
