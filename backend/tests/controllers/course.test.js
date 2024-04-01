import courseController from "../../controllers/course.controller.js";
import Course from "../../models/Course.model.js";
import CourseCategory from "../../models/CourseCategory.model.js";

// Mocking the required modules
jest.mock("../../models/Course.model.js");
jest.mock("../../models/CourseCategory.model.js");
jest.mock("../../utils/uploadFiles.js");

describe("courseController", () => {
    describe("createCourse", () => {
        it("should successfully create a course", async () => {
            const req = {
                body: {
                    courseName: "Test Course",
                    price: 100,
                    duration: "2 months",
                    description: "Test description",
                    level: "beginner",
                    prerequisites: ["prerequisite1", "prerequisite2"],
                    language: "English",
                    category: "validCategoryId",
                },
                user: {
                    _id: "validUserId",
                    role: "tutor",
                },
                file: "validFile",
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            Course.mockReturnValueOnce({
                save: jest.fn().mockResolvedValueOnce({ _id: "validCourseId" }),
            });

            await courseController.createCourse(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Course saved successfully",
            });
        });

        it("should return 403 if user is not a tutor", async () => {
            const req = {
                user: {
                    _id: "validUserId",
                    role: "student",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await courseController.createCourse(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                error: "Unauthorized access",
            });
        });

        it("should return 400 if course data is missing", async () => {
            const req = {
                body: {},
                user: {
                    _id: "validUserId",
                    role: "tutor",
                },
                file: "validFile",
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await courseController.createCourse(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "Course data is missing",
            });
        });

        it("should return 500 if an error occurs during course creation", async () => {
            const req = {
                body: {
                    courseName: "Test Course",
                    price: 100,
                    duration: "2 months",
                    description: "Test description",
                    level: "beginner",
                    prerequisites: ["prerequisite1", "prerequisite2"],
                    language: "English",
                    category: "validCategoryId",
                },
                user: {
                    _id: "validUserId",
                    role: "tutor",
                },
                file: "validFile",
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            Course.mockReturnValueOnce({
                save: jest
                    .fn()
                    .mockRejectedValueOnce(new Error("Database error")),
            });

            await courseController.createCourse(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: "An error occurred during course creation",
            });
        });

    });

    describe("updateCourse", () => {
        it("should successfully update a course", async () => {
            const req = {
                params: {
                    courseId: "validCourseId"
                },
                body: {
                    courseName: "Updated Course",
                    price: 200,
                    duration: "3 months",
                    description: "Updated description",
                    level: "intermediate",
                    prerequisites: ["new prerequisite"],
                    language: "French",
                    category: "validCategoryId"
                },
                file: "validFile"
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            Course.findById.mockResolvedValueOnce({
                _id: "validCourseId",
                tutor: "validUserId",
                thumbnailUrl: "validThumbnailUrl"
            });
            Course.findByIdAndUpdate.mockResolvedValueOnce({
                _id: "validCourseId",
                courseName: "Updated Course",
                price: 200,
                duration: "3 months",
                description: "Updated description",
                level: "intermediate",
                prerequisites: ["new prerequisite"],
                language: "French",
                tutor: "validUserId",
                category: "validCategoryId",
                thumbnailUrl: "validThumbnailUrl"
            });
    
            await courseController.updateCourse(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Course successfully updated",
                updatedCourse: {
                    _id: "validCourseId",
                    courseName: "Updated Course",
                    price: 200,
                    duration: "3 months",
                    description: "Updated description",
                    level: "intermediate",
                    prerequisites: ["new prerequisite"],
                    language: "French",
                    tutor: "validUserId",
                    category: "validCategoryId",
                    thumbnailUrl: "validThumbnailUrl"
                }
            });
        });
    
        it("should return 404 if course is not found", async () => {
            const req = {
                params: {
                    courseId: "invalidCourseId"
                },
                body: {
                    courseName: "Updated Course",
                    price: 200,
                    duration: "3 months",
                    description: "Updated description",
                    level: "intermediate",
                    prerequisites: ["new prerequisite"],
                    language: "French",
                    category: "validCategoryId"
                },
                file: "validFile"
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            Course.findById.mockResolvedValueOnce(null);
    
            await courseController.updateCourse(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: "Course not found"
            });
        });
    
        it("should return 400 if course data is invalid", async () => {
            const req = {
                params: {
                    courseId: "validCourseId"
                },
                body: {}, // Invalid course data
                file: "validFile"
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            Course.findById.mockResolvedValueOnce({
                _id: "validCourseId",
                tutor: "validUserId",
                thumbnailUrl: "validThumbnailUrl"
            });
    
            await courseController.updateCourse(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "Invalid course format",
                details: // Provide details of the validation errors here
            });
        });
    
        it("should return 500 if an error occurs during course update", async () => {
            const req = {
                params: {
                    courseId: "validCourseId"
                },
                body: {
                    courseName: "Updated Course",
                    price: 200,
                    duration: "3 months",
                    description: "Updated description",
                    level: "intermediate",
                    prerequisites: ["new prerequisite"],
                    language: "French",
                    category: "validCategoryId"
                },
                file: "validFile"
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            Course.findById.mockResolvedValueOnce({
                _id: "validCourseId",
                tutor: "validUserId",
                thumbnailUrl: "validThumbnailUrl"
            });
            Course.findByIdAndUpdate.mockRejectedValueOnce(new Error("Database error"));
    
            await courseController.updateCourse(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: "An error occurred during course update"
            });
        });
    });    

    describe("deleteCourse", () => {
        it("should successfully delete a course", async () => {
            const req = {
                params: {
                    courseId: "validCourseId"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const deletedCourse = {
                _id: "validCourseId",

            };
            Course.findByIdAndDelete.mockResolvedValueOnce(deletedCourse);
    
            await courseController.deleteCourse(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Course successfully deleted",
                deletedCourse
            });
        });
    
        it("should return 404 if course is not found", async () => {
            const req = {
                params: {
                    courseId: "invalidCourseId"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            Course.findByIdAndDelete.mockResolvedValueOnce(null);
    
            await courseController.deleteCourse(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: "Course not found"
            });
        });
    
        it("should return 500 if an error occurs during course deletion", async () => {
            const req = {
                params: {
                    courseId: "validCourseId"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            Course.findByIdAndDelete.mockRejectedValueOnce(new Error("Database error"));
    
            await courseController.deleteCourse(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: "An error occurred during course deletion"
            });
        });
    });
    

    describe("getCourse", () => {
        it("should successfully get published courses", async () => {
            const publishedCourses = [
                {
                    _id: "validCourseId1",
                },
                {
                    _id: "validCourseId2",
                }
            ];
    
            Course.find.mockResolvedValueOnce(publishedCourses);
    
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            await courseController.getCourse(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                course: publishedCourses,
            });
        });
    
        it("should return 500 if an error occurs during course retrieval", async () => {
            const errorMessage = "Internal server error";
    
            Course.find.mockRejectedValueOnce(new Error(errorMessage));
    
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            await courseController.getCourse(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: errorMessage,
            });
        });
    });
    

    describe("getAllCourse", () => {
        it("should successfully get all courses", async () => {
            const allCourses = [
                {
                    _id: "validCourseId1",
                    courseName: "Course 1",
                    // Add other properties as needed
                },
                {
                    _id: "validCourseId2",
                    courseName: "Course 2",
                    // Add other properties as needed
                }
                // Add more courses if needed
            ];
    
            Course.find.mockResolvedValueOnce(allCourses);
    
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            await courseController.getAllCourse(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(allCourses);
        });
    
        it("should return 500 if an error occurs during course retrieval", async () => {
            const errorMessage = "Internal server error";
    
            Course.find.mockRejectedValueOnce(new Error(errorMessage));
    
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            await courseController.getAllCourse(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: errorMessage,
            });
        });
    });
    

    describe("getCourseById", () => {
        it("should successfully get a course by ID", async () => {
            const courseId = "validCourseId";
            const course = {
                _id: courseId,
                courseName: "Test Course",
                // Add other properties as needed
            };
    
            Course.findById.mockResolvedValueOnce(course);
    
            const req = {
                params: {
                    courseId: courseId
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            await courseController.getCourseById(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(course);
        });
    
        it("should return 404 if course is not found", async () => {
            const invalidCourseId = "invalidCourseId";
    
            Course.findById.mockResolvedValueOnce(null);
    
            const req = {
                params: {
                    courseId: invalidCourseId
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            await courseController.getCourseById(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: "Course not found",
            });
        });
    
        it("should return 400 if course ID is invalid", async () => {
            const invalidCourseId = "invalidCourseId";
    
            const req = {
                params: {
                    courseId: invalidCourseId
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            await courseController.getCourseById(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "Invalid course id format",
            });
        });
    
        it("should return 500 if an error occurs during course retrieval", async () => {
            const courseId = "validCourseId";
            const errorMessage = "Internal server error";
    
            Course.findById.mockRejectedValueOnce(new Error(errorMessage));
    
            const req = {
                params: {
                    courseId: courseId
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            await courseController.getCourseById(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: errorMessage,
            });
        });
    });    

    describe("getCourseByTutorId", () => {
        it("should successfully get courses by tutor ID", async () => {
            const tutorId = "validTutorId";
            const courses = [
                {
                    _id: "courseId1",
                    courseName: "Course 1",
                    // Add other properties as needed
                },
                {
                    _id: "courseId2",
                    courseName: "Course 2",
                    // Add other properties as needed
                }
            ];
    
            Course.find.mockResolvedValueOnce(courses);
    
            const req = {
                params: {
                    tutorId: tutorId
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            await courseController.getCourseByTutorId(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(courses);
        });
    
        it("should return 500 if an error occurs during course retrieval", async () => {
            const tutorId = "validTutorId";
            const errorMessage = "Internal server error";
    
            Course.find.mockRejectedValueOnce(new Error(errorMessage));
    
            const req = {
                params: {
                    tutorId: tutorId
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            await courseController.getCourseByTutorId(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: errorMessage,
            });
        });
    });
    
    describe("getCourseContent", () => {
        it("should successfully get course content", async () => {
            const courseId = "validCourseId";
            const sections = [
                {
                    _id: "sectionId1",
                    title: "Section 1",
                    // Add other properties as needed
                    subsections: [
                        {
                            _id: "subsectionId1",
                            title: "Subsection 1",
                            // Add other properties as needed
                        },
                        {
                            _id: "subsectionId2",
                            title: "Subsection 2",
                            // Add other properties as needed
                        }
                    ]
                },
                {
                    _id: "sectionId2",
                    title: "Section 2",
                    // Add other properties as needed
                    subsections: [
                        {
                            _id: "subsectionId3",
                            title: "Subsection 3",
                            // Add other properties as needed
                        },
                        {
                            _id: "subsectionId4",
                            title: "Subsection 4",
                            // Add other properties as needed
                        }
                    ]
                }
            ];
    
            Course.findById.mockResolvedValueOnce({});
    
            Section.find.mockResolvedValueOnce(sections);
    
            const req = {
                params: {
                    courseId: courseId
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            await courseController.getCourseContent(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(sections);
        });
    
        it("should return 404 if course is not found", async () => {
            const courseId = "invalidCourseId";
            const errorMessage = "Course not found";
    
            Course.findById.mockResolvedValueOnce(null);
    
            const req = {
                params: {
                    courseId: courseId
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            await courseController.getCourseContent(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: errorMessage,
            });
        });
    
        it("should return 500 if an error occurs during course content retrieval", async () => {
            const courseId = "validCourseId";
            const errorMessage = "Internal server error";
    
            Course.findById.mockRejectedValueOnce(new Error(errorMessage));
    
            const req = {
                params: {
                    courseId: courseId
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            await courseController.getCourseContent(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: errorMessage,
            });
        });
    });
    
});
