import courseEnrolledController from "../../controllers/courseEnrolled.controller.js";
import Course from "../../models/Course.model.js";
import CourseEnrolled from "../../models/CourseEnrolled.model.js";
import Payment from "../../models/Payment.model.js";
import User from "../../models/User.model.js";

// Mocking the required modules
jest.mock("../../models/Course.model.js");
jest.mock("../../models/CourseEnrolled.model.js");
jest.mock("../../models/Payment.model.js");
jest.mock("../../models/User.model.js");

describe("courseEnrolledController", () => {
    describe("enrollInCourse", () => {
        it("should successfully enroll a user in a course", async () => {
            const req = {
                user: {
                    _id: "validUserId",
                },
                params: {
                    courseId: "validCourseId",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            Course.findById.mockResolvedValueOnce({
                _id: "validCourseId",
            });
            Payment.findOne.mockResolvedValueOnce({});
            CourseEnrolled.mockReturnValueOnce({
                save: jest.fn(),
            });

            await courseEnrolledController.enrollInCourse(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "User is successfully enrolled in course",
            });
        });

        it("should return 404 if course is not found", async () => {
            const req = {
                params: {
                    courseId: "invalidCourseId",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            Course.findById.mockResolvedValueOnce(null);

            await courseEnrolledController.enrollInCourse(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: "Course not found",
            });
        });

        it("should return 404 if payment is not found", async () => {
            const req = {
                user: {
                    _id: "validUserId",
                },
                params: {
                    courseId: "validCourseId",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            Course.findById.mockResolvedValueOnce({
                _id: "validCourseId",
            });
            Payment.findOne.mockResolvedValueOnce(null);

            await courseEnrolledController.enrollInCourse(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: "payment not found",
            });
        });

    });

    describe("updateProgress", () => {
        it("should successfully update progress for a course", async () => {
            // Write your test case for successful progress update
        });

        // Add more test cases for other scenarios
    });

    describe("getEnrolledUsers", () => {
        it("should successfully get enrolled users for a course", async () => {
            const req = {
                params: {
                    courseId: "validCourseId",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            Course.findById.mockResolvedValueOnce({
                _id: "validCourseId",
                studentsEnrolled: ["userId1", "userId2"],
            });
            User.find.mockResolvedValueOnce([
                { _id: "userId1", name: "User 1" },
                { _id: "userId2", name: "User 2" },
            ]);

            await courseEnrolledController.getEnrolledUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([
                { _id: "userId1", name: "User 1" },
                { _id: "userId2", name: "User 2" },
            ]);
        });

        it("should return 404 if course is not found", async () => {
            const req = {
                params: {
                    courseId: "invalidCourseId",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            Course.findById.mockResolvedValueOnce(null);

            await courseEnrolledController.getEnrolledUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: "Course not found",
            });
        });

        // Add more test cases for other scenarios
    });

    describe("unEnrollUser", () => {
        it("should successfully unenroll a user from a course", async () => {
            const req = {
                params: {
                    id: "validEnrollmentId",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            CourseEnrolled.findById.mockResolvedValueOnce({
                _id: "validEnrollmentId",
            });

            await courseEnrolledController.unEnrollUser(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Successfully unenrolled",
            });
        });

        it("should return 404 if enrollment record is not found", async () => {
            const req = {
                params: {
                    id: "invalidEnrollmentId",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            CourseEnrolled.findById.mockResolvedValueOnce(null);

            await courseEnrolledController.unEnrollUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: "Enrollment record not found",
            });
        });

        // Add more test cases for other scenarios
    });

    describe("getUserCourses", () => {
        it("should successfully get courses for a user", async () => {
            const req = {
                params: {
                    userId: "validUserId",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            User.findById.mockResolvedValueOnce({
                _id: "validUserId",
            });
            CourseEnrolled.find.mockResolvedValueOnce([
                { courseId: "courseId1" },
                { courseId: "courseId2" },
            ]);

            await courseEnrolledController.getUserCourses(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([
                { courseId: "courseId1" },
                { courseId: "courseId2" },
            ]);
        });

        it("should return 400 if user ID is invalid", async () => {
            const req = {
                params: {
                    userId: "invalidUserId",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            User.findById.mockResolvedValueOnce(null);

            await courseEnrolledController.getUserCourses(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "Invalid id format",
            });
        });

        // Add more test cases for other scenarios
    });

    describe("getMyCourses", () => {
        it("should successfully get courses for the authenticated user", async () => {
            const req = {
                user: {
                    _id: "validUserId",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            CourseEnrolled.find.mockResolvedValueOnce([
                { courseId: "courseId1" },
                { courseId: "courseId2" },
            ]);

            await courseEnrolledController.getMyCourses(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([
                { courseId: "courseId1" },
                { courseId: "courseId2" },
            ]);
        });

        // Add more test cases for other scenarios
    });
});
