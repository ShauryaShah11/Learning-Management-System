import questionController from "../../controllers/question.controller.js";
import Question from "../../models/Question.model.js";

jest.mock("../../models/Question.model.js");

describe("questionController", () => {
    describe("addQuestion", () => {
        it("should successfully add a question", async () => {
            const req = {
                params: {
                    courseId: "course_id",
                },
                body: {
                    questionText: "Sample question",
                },
                user: {
                    _id: "user_id",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const question = {
                save: jest.fn(),
            };
            Question.mockReturnValueOnce(question);

            await questionController.addQuestion(req, res);

            expect(Question).toHaveBeenCalledTimes(1);
            expect(Question).toHaveBeenCalledWith({
                course: "course_id",
                questionText: "Sample question",
                user: "user_id",
            });
            expect(question.save).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Question added successfully",
            });
        });

        it("should return 404 if course is not found", async () => {
            const req = {
                params: {
                    courseId: "non_existent_course_id",
                },
                body: {
                    questionText: "Sample question",
                },
                user: {
                    _id: "user_id",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            Question.mockReturnValueOnce(null);

            await questionController.addQuestion(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: "Course not found",
            });
        });

        // Add more test cases for other scenarios
    });

    describe("updateQuestion", () => {
        it("should successfully update a question", async () => {
            const req = {
                params: {
                    questionId: "question_id",
                },
                body: {
                    questionText: "Updated question text",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const question = {
                questionText: "Original question text",
                save: jest.fn(),
            };
            Question.findById.mockResolvedValueOnce(question);
    
            await questionController.updateQuestion(req, res);
    
            expect(Question.findById).toHaveBeenCalledTimes(1);
            expect(Question.findById).toHaveBeenCalledWith("question_id");
            expect(question.questionText).toBe("Updated question text");
            expect(question.save).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: "Question succesfully updated",
            });
        });
    
        it("should return 404 if question is not found", async () => {
            const req = {
                params: {
                    questionId: "non_existent_question_id",
                },
                body: {
                    questionText: "Updated question text",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            Question.findById.mockResolvedValueOnce(null);
    
            await questionController.updateQuestion(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: "Question not found",
            });
        });
    
        it("should return 400 if question ID is invalid", async () => {
            const req = {
                params: {
                    questionId: "invalid_question_id",
                },
                body: {
                    questionText: "Updated question text",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            await questionController.updateQuestion(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "Invalid id format",
            });
        });
    
        it("should return 500 if an error occurs during question update", async () => {
            const req = {
                params: {
                    questionId: "question_id",
                },
                body: {
                    questionText: "Updated question text",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            Question.findById.mockRejectedValueOnce(new Error("Database error"));
    
            await questionController.updateQuestion(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: "Internal server error",
            });
        });
    
        // Add more test cases for other scenarios
    });

    describe("removeQuestion", () => {
        it("should successfully remove a question", async () => {
            const req = {
                params: {
                    questionId: "question_id",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const questionToDelete = {
                _id: "question_id",
                save: jest.fn(),
            };
            Question.findById.mockResolvedValueOnce(questionToDelete);
    
            await questionController.removeQuestion(req, res);
    
            expect(Question.findById).toHaveBeenCalledTimes(1);
            expect(Question.findById).toHaveBeenCalledWith("question_id");
            expect(Question.findByIdAndDelete).toHaveBeenCalledTimes(1);
            expect(Question.findByIdAndDelete).toHaveBeenCalledWith("question_id");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Question deleted successfully",
            });
        });
    
        it("should return 404 if question is not found", async () => {
            const req = {
                params: {
                    questionId: "non_existent_question_id",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            Question.findById.mockResolvedValueOnce(null);
    
            await questionController.removeQuestion(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: "Question not found.",
            });
        });
    
        it("should return 400 if question ID is invalid", async () => {
            const req = {
                params: {
                    questionId: "invalid_question_id",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            await questionController.removeQuestion(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "Invalid id format",
            });
        });
    
        it("should return 500 if an error occurs during question removal", async () => {
            const req = {
                params: {
                    questionId: "question_id",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            Question.findById.mockResolvedValueOnce({
                _id: "question_id",
                save: jest.fn(),
            });
            Question.findByIdAndDelete.mockRejectedValueOnce(new Error("Database error"));
    
            await questionController.removeQuestion(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: "Internal server error.",
            });
        });
    
        // Add more test cases for other scenarios
    });

    describe("getQuestion", () => {
        it("should successfully get questions for a valid course ID", async () => {
            const req = {
                params: {
                    courseId: "valid_course_id",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const questions = [{
                _id: "question_id_1",
                course: "valid_course_id",
                questionText: "Question 1",
                user: "user_id_1",
                answers: [],
            }, {
                _id: "question_id_2",
                course: "valid_course_id",
                questionText: "Question 2",
                user: "user_id_2",
                answers: [],
            }];
            Question.find.mockResolvedValueOnce(questions);
    
            await questionController.getQuestion(req, res);
    
            expect(Question.find).toHaveBeenCalledTimes(1);
            expect(Question.find).toHaveBeenCalledWith({ course: "valid_course_id" });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(questions);
        });
    
        it("should return 404 if no questions are found for the given course ID", async () => {
            const req = {
                params: {
                    courseId: "non_existent_course_id",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            Question.find.mockResolvedValueOnce([]);
    
            await questionController.getQuestion(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: "No questions found for this course ID.",
            });
        });
    
        it("should return 400 if course ID is invalid", async () => {
            const req = {
                params: {
                    courseId: "invalid_course_id",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            await questionController.getQuestion(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "Invalid id format",
            });
        });
    
        it("should return 500 if an error occurs during question retrieval", async () => {
            const req = {
                params: {
                    courseId: "valid_course_id",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            Question.find.mockRejectedValueOnce(new Error("Database error"));
    
            await questionController.getQuestion(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: "Internal server error.",
            });
        });
    
        // Add more test cases for other scenarios
    });
});
