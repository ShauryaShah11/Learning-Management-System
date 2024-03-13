import { z } from "zod";
import mongoose from "mongoose";
import Course from "../models/Course.model.js";
import User from "../models/User.model.js";
import Question from "../models/Question.model.js";

const questionSchema = z.object({
    course: z.instanceof(mongoose.Types.ObjectId),
    user: z.instanceof(mongoose.Types.ObjectId),
    questionText: z.string().min(1).max(500),
});

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

const questionController = {
    addQuestion: async (req, res) => {
        try {
            console.log(req.body);
            const courseId = req.params.courseId;
            const questionText = req.body.questionText;
            const validationIdError = validateId(courseId);
            if (validationIdError) {
                return res.status(400).json(validationIdError);
            }
            const course = await Course.findById(courseId);
            const userId = req.user._id;

            if (!course) {
                return res.status(404).json({ error: "Course not found" });
            }
            const question = new Question({
                course: courseId,
                questionText: questionText,
                user: userId,
            });
            const validationQuestionSchema = questionSchema.safeParse(question);
            if (!validationQuestionSchema.success) {
                return res.status(400).json({
                    error: "Invalid question format",
                    details: validationQuestionSchema.error.errors,
                });
            }
            await question.save();
            return res.status(200).json({
                message: "Question added successfully",
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: "Internal server error",
            });
        }
    },

    updateQuestion: async (req, res) => {
        try {
            const questionId = req.params.questionId;
            const questionText = req.body.questionText;
            const validationIdError = validateId(questionId);
            if (validationIdError) {
                return res.status(400).json(validationIdError);
            }

            const question = await Question.findById(questionId);
            if (!question) {
                return res.status(404).json({
                    error: "Question not found",
                });
            }
            question.questionText = questionText;

            await question.save();

            return res.status(201).json({
                message: "Question succesfully updated",
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: "Internal server error",
            });
        }
    },

    removeQuestion: async (req, res) => {
        try {
            const questionId = req.params.questionId;
            const validationIdError = validateId(questionId);
            if (validationIdError) {
                return res.status(400).json(validationIdError);
            }

            const questionToDelete = await Question.findById(questionId);
            if (!questionToDelete) {
                return res.status(404).json({
                    error: "Question not found.",
                });
            }
            await Question.findByIdAndDelete(questionId);

            return res.status(200).json({
                message: "Question deleted successfully",
            });
        } catch (error) {
            return res.status(500).json({
                error: "Internal server error.",
            });
        }
    },

    getQuestion: async (req, res) => {
        try {
            const courseId = req.params.courseId;
            const validationIdError = validateId(courseId);
            if (validationIdError) {
                return res.status(400).json(validationIdError);
            }
    
            const questions = await Question.find({ course: courseId })
            .populate({
                path: 'user',
                model: 'User'
            })
            .populate({
                path: 'answers',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            });
    
            if (questions.length === 0) {
                return res.status(404).json({
                    error: "No questions found for this course ID.",
                });
            }
    
            return res.status(200).json(questions);
        } catch (error) {
            return res.status(500).json({
                error: "Internal server error.",
            });
        }
    },
    
};

export default questionController;
