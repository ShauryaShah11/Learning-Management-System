import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Course' }, // Reference to the Course model
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // Reference to the User model
  reviewText: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 }, // Rating scale (1-5)
  datePosted: { type: Date, default: Date.now },
  // Other review-related fields or attributes you may want to include
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
