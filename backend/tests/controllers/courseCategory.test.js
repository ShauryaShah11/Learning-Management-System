import courseCategoryController from "../../controllers/courseCategory.controller.js";
import CourseCategory from "../../models/CourseCategory.model.js";
import Course from "../../models/Course.model.js";
import { uploadFiles } from "../../utils/uploadFiles.js";

// Mocking the required modules
jest.mock("../../models/CourseCategory.model.js");
jest.mock("../../models/Course.model.js");
jest.mock("../../utils/uploadFiles");

describe("courseCategoryController", () => {
    describe("addCategory", () => {
        it("should successfully add a category", async () => {
            const req = {
                body: {
                    categoryName: "Test Category",
                    description: "Test description",
                },
                file: "validFile",
                user: {
                    _id: "validUserId",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            CourseCategory.findOne.mockResolvedValueOnce(null);
            uploadFiles.mockResolvedValueOnce({ fileUrl: "validImageUrl" });

            await courseCategoryController.addCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: "Course Category is successfully added",
            });
        });

        it("should return 400 if category name already exists", async () => {
            const req = {
                body: {
                    categoryName: "Test Category",
                    description: "Test description",
                },
                file: "validFile",
                user: {
                    _id: "validUserId",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            CourseCategory.findOne.mockResolvedValueOnce({
                categoryName: "Test Category",
            });

            await courseCategoryController.addCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "Category name aleady exists",
            });
        });

        it("should return 400 if category data is invalid", async () => {
            const req = {
                body: {},
                file: "validFile",
                user: {
                    _id: "validUserId",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await courseCategoryController.addCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "Invalid category format",
                details: [
                    { message: "required", path: ["categoryName"] },
                    { message: "required", path: ["description"] },
                ],
            });
        });

        it("should return 500 if an error occurs during category addition", async () => {
            const req = {
                body: {
                    categoryName: "Test Category",
                    description: "Test description",
                },
                file: "validFile",
                user: {
                    _id: "validUserId",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            CourseCategory.findOne.mockRejectedValueOnce(
                new Error("Database error")
            );

            await courseCategoryController.addCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: "Internal server error",
            });
        });
    });

    describe("updateCategory", () => {
        it("should successfully update a category", async () => {
            const req = {
                params: {
                    categoryId: "validCategoryId",
                },
                body: {
                    categoryName: "Updated Category",
                    description: "Updated description",
                },
                file: "validFile",
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            const updatedCategory = {
                _id: "validCategoryId",
                categoryName: "Updated Category",
                description: "Updated description",
                coverImageUrl: "validUpdatedImageUrl",
            };

            CourseCategory.findById.mockResolvedValueOnce(updatedCategory);
            uploadFiles.mockResolvedValueOnce({
                fileUrl: "validUpdatedImageUrl",
            });
            CourseCategory.findByIdAndUpdate.mockResolvedValueOnce(
                updatedCategory
            );

            await courseCategoryController.updateCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: "Course Category is successfully updated",
            });
        });

        it("should return 404 if category is not found", async () => {
            const req = {
                params: {
                    categoryId: "invalidCategoryId",
                },
                body: {
                    categoryName: "Updated Category",
                    description: "Updated description",
                },
                file: "validFile",
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            CourseCategory.findById.mockResolvedValueOnce(null);

            await courseCategoryController.updateCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: "Course category not found",
            });
        });

        it("should return 400 if category data is invalid", async () => {
            const req = {
                params: {
                    categoryId: "validCategoryId",
                },
                body: {},
                file: "validFile",
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            const category = {
                _id: "validCategoryId",
                categoryName: "Existing Category",
                description: "Existing description",
                coverImageUrl: "validImageUrl",
            };

            CourseCategory.findById.mockResolvedValueOnce(category);

            await courseCategoryController.updateCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "Invalid category format",
                details: [
                    { message: "required", path: ["categoryName"] },
                    { message: "required", path: ["description"] },
                ],
            });
        });

        it("should return 500 if an error occurs during category update", async () => {
            const req = {
                params: {
                    categoryId: "validCategoryId",
                },
                body: {
                    categoryName: "Updated Category",
                    description: "Updated description",
                },
                file: "validFile",
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            const category = {
                _id: "validCategoryId",
                categoryName: "Existing Category",
                description: "Existing description",
                coverImageUrl: "validImageUrl",
            };

            CourseCategory.findById.mockResolvedValueOnce(category);
            uploadFiles.mockRejectedValueOnce(new Error("File upload error"));

            await courseCategoryController.updateCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: "Internal server error",
            });
        });
    });

    describe("removeCategory", () => {
        it("should successfully remove a category", async () => {
            const req = {
                params: {
                    categoryId: "validCategoryId",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            const removedCategory = {
                _id: "validCategoryId",
                categoryName: "Removed Category",
                description: "Removed description",
                coverImageUrl: "validRemovedImageUrl",
            };

            CourseCategory.findByIdAndDelete.mockResolvedValueOnce(
                removedCategory
            );

            await courseCategoryController.removeCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Course is successfully removed",
            });
        });

        it("should return 404 if category is not found", async () => {
            const req = {
                params: {
                    categoryId: "invalidCategoryId",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            CourseCategory.findByIdAndDelete.mockResolvedValueOnce(null);

            await courseCategoryController.removeCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: "Course category not found",
            });
        });

        it("should return 500 if an error occurs during category removal", async () => {
            const req = {
                params: {
                    categoryId: "validCategoryId",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            CourseCategory.findByIdAndDelete.mockRejectedValueOnce(
                new Error("Database error")
            );

            await courseCategoryController.removeCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: "Internal server error",
            });
        });
    });

    import courseCategoryController from "../../path/to/courseCategoryController";
    import CourseCategory from "../../models/CourseCategory.model.js";
    import Course from "../../models/Course.model.js";

    // Mocking the required modules
    jest.mock("../../models/CourseCategory.model.js");
    jest.mock("../../models/Course.model.js");

    describe("getCourseByCategoryId", () => {
        it("should successfully get courses by category ID", async () => {
            const req = {
                params: {
                    categoryId: "validCategoryId",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            const categoryWithCourses = {
                _id: "validCategoryId",
                categoryName: "Test Category",
                description: "Test description",
                coverImageUrl: "validImageUrl",
                courses: ["courseId1", "courseId2"],
            };

            const courses = [
                { _id: "courseId1", courseName: "Course 1", published: true },
                { _id: "courseId2", courseName: "Course 2", published: true },
            ];

            CourseCategory.findById.mockResolvedValueOnce(categoryWithCourses);
            Course.find.mockResolvedValueOnce(courses);

            await courseCategoryController.getCourseByCategoryId(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                coverImageUrl: "validImageUrl",
                courseCount: 2,
                categoryName: "Test Category",
                courses: courses,
            });
        });

        it("should return 404 if category is not found", async () => {
            const req = {
                params: {
                    categoryId: "invalidCategoryId",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            CourseCategory.findById.mockResolvedValueOnce(null);

            await courseCategoryController.getCourseByCategoryId(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: "Course category not found",
            });
        });

        it("should return 500 if an error occurs during course retrieval by category ID", async () => {
            const req = {
                params: {
                    categoryId: "validCategoryId",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            CourseCategory.findById.mockRejectedValueOnce(
                new Error("Database error")
            );

            await courseCategoryController.getCourseByCategoryId(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: "Internal server error",
            });
        });
    });

    describe("getCategories", () => {
        it("should successfully get all categories", async () => {
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            const categories = [
                {
                    _id: "categoryId1",
                    categoryName: "Category 1",
                    description: "Description 1",
                    coverImageUrl: "imageUrl1",
                },
                {
                    _id: "categoryId2",
                    categoryName: "Category 2",
                    description: "Description 2",
                    coverImageUrl: "imageUrl2",
                },
            ];

            CourseCategory.find.mockResolvedValueOnce(categories);

            await courseCategoryController.getCategories(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(categories);
        });

        it("should return 500 if an error occurs during category retrieval", async () => {
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            CourseCategory.find.mockRejectedValueOnce(
                new Error("Database error")
            );

            await courseCategoryController.getCategories(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: "Internal server error",
            });
        });
    });

    import courseCategoryController from "../../path/to/courseCategoryController";
    import CourseCategory from "../../models/CourseCategory.model.js";

    // Mocking the required module
    jest.mock("../../models/CourseCategory.model.js");

    describe("getCategoryById", () => {
        it("should successfully get a category by ID", async () => {
            const categoryId = "validCategoryId";
            const req = {
                params: {
                    categoryId: categoryId,
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            const category = {
                _id: categoryId,
                categoryName: "Category Name",
                description: "Category Description",
                coverImageUrl: "Cover Image URL",
            };

            CourseCategory.findById.mockResolvedValueOnce(category);

            await courseCategoryController.getCategoryById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(category);
        });

        it("should return 404 if category is not found", async () => {
            const categoryId = "invalidCategoryId";
            const req = {
                params: {
                    categoryId: categoryId,
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            CourseCategory.findById.mockResolvedValueOnce(null);

            await courseCategoryController.getCategoryById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: "Category not found",
            });
        });

        it("should return 500 if an error occurs during category retrieval by ID", async () => {
            const categoryId = "validCategoryId";
            const req = {
                params: {
                    categoryId: categoryId,
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            CourseCategory.findById.mockRejectedValueOnce(
                new Error("Database error")
            );

            await courseCategoryController.getCategoryById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: "Internal server error",
            });
        });
    });
});
