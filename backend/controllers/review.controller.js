import express from "express";
import { z } from "zod";
import mongoose from "mongoose";
import User from "../models/User.model.js";
import Course from "../models/Course.model.js";
import Review from "../models/Review.model.js";

const reviewSchema = z.object({
    user: z.instanceof(mongoose.Types.ObjectId),
    course: z.instanceof(mongoose.Types.ObjectId),
    reviewText: z.string().max(500),
    rating: z.number().gte(1).lte(5),
});

const revieweController = {
    addReview: async (req, res) => {
        try {
            const courseId = req.params.courseId;
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({
                    error: "Course not found",
                });
            }
            const { reviewText, rating } = req.body;
            const review = new Review({
                user: req.user._id,
                course: courseId,
                reviewText: reviewText,
                rating: rating,
            });
            const validationResult = reviewSchema.safeParse(review);
            if (!validationResult.success) {
                return res.status(400).json({
                    error: "Invalid review format",
                    details: validationResult.error.errors,
                });
            }

            const savedReview = await review.save();
            await Course.findByIdAndUpdate(courseId, {
                $push: {
                    reviews: savedReview._id,
                },
            });
            await course.save();

            return res.status(200).json({
                message: "Review added successfully",
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: "Internal server error",
            });
        }
    },

    updateReview: async (req, res) => {
        try {
            const reviewId = req.params.reviewId;

            const { reviewText, rating } = req.body;

            const updatedReview = await Review.findByIdAndUpdate(reviewId, {
                reviewText,
                rating,
            });

            if (!updatedReview) {
                return res.status(404).json({ error: "Review not found" });
            }
            return res.status(200).json({
                message: "review is succesfully updated",
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: "Internal server error",
            });
        }
    },

    deleteReview: async (req, res) => {
        try {
            const reviewId = req.params.reviewId;

            const deletedReview = await Review.findById(reviewId);

            if (!deletedReview) {
                return res.status(404).json({ error: "Review not found" });
            }

            // Delete the review
            await Review.findByIdAndDelete(reviewId);

            const courseId = deletedReview.course;
            await Course.findByIdAndUpdate(
                courseId,
                { $pull: { reviews: reviewId } },
                { new: true }
            );
            return res.status(200).json({
                message: "Review succesfully updated",
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: "Internal server error",
            });
        }
    },

    getReviews: async (req, res) => {
        try {
            const courseId = req.params.courseId;

            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({
                    error: "Course not found",
                });
            }
            const reviewsId = course.reviews;
            const reviews = await Review.find({
                _id: {
                    $in: reviewsId,
                },
            }).populate("user");

            return res.status(200).json(reviews);
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: "Internal server error",
            });
        }
    },
};

export default revieweController;
