import revieweController from "../../controllers/review.controller.js";
import Review from "../../models/Review.model.js";
import Course from "../../models/Course.model.js";

jest.mock("../../models/Review.model.js");
jest.mock("../../models/Course.model.js");

describe("revieweController", () => {
    describe("addReview", () => {
        it("should successfully add a review for a valid course ID", async () => {
            // Mock request and response objects
            const req = {
                params: {
                    courseId: "valid_course_id",
                },
                body: {
                    reviewText: "Great course!",
                    rating: 5,
                },
                user: {
                    _id: "user_id",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const mockSave = jest.fn().mockResolvedValueOnce({
                _id: "review_id",
            });
            Review.mockReturnValueOnce({
                save: mockSave,
            });
            const mockCourseSave = jest.fn().mockResolvedValueOnce({});
            Course.findById.mockResolvedValueOnce({
                save: mockCourseSave,
            });

            await revieweController.addReview(req, res);

            expect(Review).toHaveBeenCalledWith({
                user: "user_id",
                course: "valid_course_id",
                reviewText: "Great course!",
                rating: 5,
            });
            expect(mockSave).toHaveBeenCalled();
            expect(Course.findById).toHaveBeenCalledWith("valid_course_id");
            expect(mockCourseSave).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Review added successfully",
            });
        });

        // Add more test cases for other scenarios
    });

    describe("updateReview", () => {
        it("should successfully update a review with valid review ID and data", async () => {
            // Mock request and response objects
            const req = {
                params: {
                    reviewId: "valid_review_id",
                },
                body: {
                    reviewText: "Updated review text",
                    rating: 4,
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const mockUpdatedReview = {
                _id: "valid_review_id",
                reviewText: "Updated review text",
                rating: 4,
            };
            const mockFindByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedReview);
            Review.findByIdAndUpdate = mockFindByIdAndUpdate;
    
            await revieweController.updateReview(req, res);
    
            expect(Review.findByIdAndUpdate).toHaveBeenCalledWith(
                "valid_review_id",
                { reviewText: "Updated review text", rating: 4 },
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "review is successfully updated",
            });
        });
    
        it("should return 404 if review is not found", async () => {
            // Mock request and response objects
            const req = {
                params: {
                    reviewId: "non_existing_review_id",
                },
                body: {
                    reviewText: "Updated review text",
                    rating: 4,
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const mockFindByIdAndUpdate = jest.fn().mockResolvedValue(null);
            Review.findByIdAndUpdate = mockFindByIdAndUpdate;
    
            await revieweController.updateReview(req, res);
    
            expect(Review.findByIdAndUpdate).toHaveBeenCalledWith(
                "non_existing_review_id",
                { reviewText: "Updated review text", rating: 4 },
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Review not found" });
        });
    
        // Add more edge test cases for other scenarios
    });

    describe("deleteReview", () => {
        it("should successfully delete a review with valid review ID", async () => {
            // Mock request and response objects
            const req = {
                params: {
                    reviewId: "valid_review_id",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const mockDeletedReview = {
                _id: "valid_review_id",
                course: "valid_course_id",
            };
            const mockFindById = jest.fn().mockResolvedValue(mockDeletedReview);
            const mockFindByIdAndDelete = jest.fn().mockResolvedValue(mockDeletedReview);
            Review.findById = mockFindById;
            Review.findByIdAndDelete = mockFindByIdAndDelete;
    
            await revieweController.deleteReview(req, res);
    
            expect(Review.findByIdAndDelete).toHaveBeenCalledWith("valid_review_id");
            expect(Course.findByIdAndUpdate).toHaveBeenCalledWith(
                "valid_course_id",
                { $pull: { reviews: "valid_review_id" } },
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Review successfully updated",
            });
        });
    
        it("should return 404 if review is not found", async () => {
            // Mock request and response objects
            const req = {
                params: {
                    reviewId: "non_existing_review_id",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const mockFindById = jest.fn().mockResolvedValue(null);
            Review.findById = mockFindById;
    
            await revieweController.deleteReview(req, res);
    
            expect(Review.findByIdAndDelete).toHaveBeenCalledWith("non_existing_review_id");
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Review not found" });
        });
    
        // Add more edge test cases for other scenarios
    });

    describe("getReviews", () => {
        it("should successfully get reviews for a course with valid course ID", async () => {
            // Mock request and response objects
            const req = {
                params: {
                    courseId: "valid_course_id",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const mockCourse = {
                _id: "valid_course_id",
                reviews: ["review_id_1", "review_id_2"],
            };
            const mockReviews = [
                { _id: "review_id_1", user: "user_id_1" },
                { _id: "review_id_2", user: "user_id_2" },
            ];
            const mockFindById = jest.fn().mockResolvedValue(mockCourse);
            const mockFind = jest.fn().mockResolvedValue(mockReviews);
            Course.findById = mockFindById;
            Review.find = mockFind;
    
            await revieweController.getReviews(req, res);
    
            expect(Course.findById).toHaveBeenCalledWith("valid_course_id");
            expect(Review.find).toHaveBeenCalledWith({
                _id: { $in: ["review_id_1", "review_id_2"] },
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockReviews);
        });
    
        it("should return 404 if course is not found", async () => {
            // Mock request and response objects
            const req = {
                params: {
                    courseId: "non_existing_course_id",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const mockFindById = jest.fn().mockResolvedValue(null);
            Course.findById = mockFindById;
    
            await revieweController.getReviews(req, res);
    
            expect(Course.findById).toHaveBeenCalledWith("non_existing_course_id");
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Course not found" });
        });
    
        // Add more edge test cases for other scenarios
    });
});
