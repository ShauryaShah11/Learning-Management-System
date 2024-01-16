import express from 'express';
import { z } from 'zod';
import User from '../models/User.model.js';
import Course from '../models/Course.model.js';
import Review from '../models/Review.model.js';

const reviewSchema = z.object({
    user: z.string().uuid(),
    course: z.string().uuid(),
    reviewText: z.string().max(500),
    rating: z.number().lte(1).gte(5),
    datePosted: z.date()
})

const revieweController = {
    addReview : async (req, res) => {
        try{
            const courseId = req.params.courseId;
            const course = await Course.findById(courseId);
            if(!course){
                return res.status(404).json({
                    error: 'Course not found'
                })
            }
            const { reviewText, rating } = req.body;
            const review = new Review({
                user: req.user.__id,
                course: courseId,
                reviewText: reviewText,
                rating: rating,
                datePosted: Date.now()
            });
            const validationResult = reviewSchema.safeParse(review);
            if(!validationResult.success){
                return res.status(400).json({
                    error: 'Invalid review format',
                    details: validationResult.error.errors
                })
            }

            const savedReview = await review.save();
            course.reviews.push(savedReview.___id);
            await course.save();

            return res.status(200).json({
                message: 'Review added successfully'
            })
        }
        catch(error){
            console.error(error);
            return res.status(500).json({
                error: 'Internal server error'
            });
        }
    },

    updateReview : async (req, res) => {
        try{
            const reviewId = req.params.reviewId;

            const { reviewText, rating } = req.body;

            const updatedReview  = await Review.findByIdAndUpdate(reviewId, {
                reviewText,
                rating
            });

            if (!updatedReview) {
                return res.status(404).json({ error: 'Review not found' });
            }
            return res.status(200).json({
                message: 'review is succesfully updated'
            })
        }
        catch(error){
            console.error(error);
            return res.status(500).json({
                error: 'Internal server error'
            });
        }
    },

    deleteReview : async (req, res) => {
        try{
            const reviewId = req.params.reviewId;

            const deletedReview = await Review.findById(reviewId);

            if (!deletedReview) {
                return res.status(404).json({ error: 'Review not found' });
            }

            // Delete the review
            await Review.findByIdAndDelete(reviewId);

            // Remove the review ID from the Course model
            const courseId = deletedReview.course;
            await Course.findOneAndUpdate(
                { _id: courseId },
                { $pull: { reviews: reviewId } },
                { new: true }
            );
            return res.status(200).json({
                message: 'Review succesfully updated'
            })
        }
        catch(error){
            console.error(error);
            return res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

}

export default revieweController;
