import mongoose from 'mongoose';
import Review from '../../models/Review.model.js';

describe('Review Model', () => {
    // Connect to MongoDB before running tests
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/testdb', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
    });

    // Clear the database after each test
    afterEach(async () => {
        await Review.deleteMany({});
    });

    // Disconnect from MongoDB after all tests are done
    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('Review Creation', () => {
        it('should create a new review', async () => {
            // Sample data for creating a new review
            const reviewData = {
                course: mongoose.Types.ObjectId(), // Replace with a valid course ID
                user: mongoose.Types.ObjectId(), // Replace with a valid user ID
                reviewText: 'This course is excellent!', // Replace with the review text
                rating: 5, // Replace with the rating (1-5)
            };

            const review = await Review.create(reviewData);
            expect(review).toBeDefined();
            expect(review.course).toEqual(reviewData.course);
            expect(review.user).toEqual(reviewData.user);
            expect(review.reviewText).toBe(reviewData.reviewText);
            expect(review.rating).toBe(reviewData.rating);
        });

        it('should require all required fields', async () => {
            try {
                await Review.create({});
            } catch (error) {
                expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
                expect(error.errors.course).toBeDefined();
                expect(error.errors.user).toBeDefined();
                expect(error.errors.reviewText).toBeDefined();
                expect(error.errors.rating).toBeDefined();
            }
        });

        it('should enforce rating range between 1 and 5', async () => {
            try {
                await Review.create({
                    course: mongoose.Types.ObjectId(),
                    user: mongoose.Types.ObjectId(),
                    reviewText: 'Test review',
                    rating: 10, // Rating outside the valid range
                });
            } catch (error) {
                expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
                expect(error.errors.rating).toBeDefined();
            }
        });

        // Add more test cases as needed to cover other functionalities of the Review model
    });
});
