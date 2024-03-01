import mongoose from "mongoose";
import { z } from "zod";
import Course from "../models/Course.model.js";
import CourseEnrolled from "../models/CourseEnrolled.model.js";
import Payment from "../models/Payment.model.js";
import User from "../models/User.model.js";

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

const courseEnrolledController = {
    enrollInCourse: async (req, res) => {
        try {
            const userId = req.user._id;
            const courseId = req.params.courseId;
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

            const payment = await Payment.findOne({
                user: userId,
                course: courseId,
            });
            if (!payment) {
                return res.status(404).json({
                    error: "payment not found",
                });
            }

            const courseEnrolled = new CourseEnrolled({
                student: userId,
                course: courseId,
            });

            await Course.findByIdAndUpdate(courseId, {
                $push: {
                    studentsEnrolled: userId,
                },
            });
            await courseEnrolled.save();

            return res.status(200).json({
                message: "User is succesfully enrolled in course",
            });
        } catch (error) {
            return res.status(500).json({
                error: "Internal server error",
            });
        }
    },

    updateProgress: async (req, res) => {
        try {
        } catch (error) {
            return res.status(500).json({
                error: "Internal server error",
            });
        }
    },

    getEnrolledUsers: async (req, res) => {
        try {
            const courseId = req.params.courseId;
            const validationIdError = validateId(courseId);
            if (validationIdError) {
                return res.status(400).json(validationIdError);
            }
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ error: "Course not found" });
            }

            const enrolledUserIds = course.studentsEnrolled;
            const enrolledUsers = await User.find({
                _id: {
                    $in: enrolledUserIds,
                },
            });
            return res.status(200).json(enrolledUsers);
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    unEnrollUser: async (req, res) => {
        try {
            const enrollmentId = req.params.id;
            const validationIdError = validateId(enrollmentId);
            if (validationIdError) {
                return res.status(400).json(validationIdError);
            }
            const courseEnrolled = await CourseEnrolled.findById(enrollmentId);

            if (!courseEnrolled) {
                return res
                    .status(404)
                    .json({ error: "Enrollment record not found" });
            }

            await CourseEnrolled.findByIdAndUpdate(enrollmentId, {
                status: "dropped out",
            });

            return res.status(200).json({
                message: "Successfully unenrolled",
            });
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    getUserCourses: async (req, res) => {
        try {
            const userId = req.params.userId;
            const validationIdError = validateId(userId);
            if (validationIdError) {
                return res.status(400).json(validationIdError);
            }
            const courses = await CourseEnrolled.find({
                student: userId,
            }).populate("course");
            return res.status(200).json(courses);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    getMyCourses: async (req, res) => {
        try {
            const userId = req.user._id;
            const courses = await CourseEnrolled.find({
                student: userId,
            }).populate("course");
            return res.status(200).json(courses);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },
};

export default courseEnrolledController;
