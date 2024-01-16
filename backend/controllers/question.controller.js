import Course from '../models/Course.model.js';
import User from '../models/User.model.js';
import Question from '../models/Question.model.js';
import { z } from 'zod';

const questionSchema = z.object({
    course: z.string().uuid(),
    user: z.string().uuid(),
    questionText: z.string().min(1).max(500)
})

const IdSchema = z.string().uuid();
const questionController = {
    addQuestion: async (req, res) => {
        try{
            const courseId = req.params.courseId;
            const questionText = req.body.questionText;
            const validationResult = IdSchema.safeParse(courseId);
            if(!validationResult.success){
                return res.status(400).json({
                    error: 'Invalid course id format',
                    details: validationResult.error.errors
                })
            }
            const course = await Course.findById(courseId);
            const userId = req.user.__id;

            if(!course){
                return res.status(404).json({error: 'Course not found'});
            }
            const question = new Question({
                course: courseId, 
                questionText: questionText,
                user: userId
            })
            const validationQuestionSchema = questionSchema.safeParse(question);
            if(!validationQuestionSchema.success){
                return res.status(400).json({
                    error: 'Invalid question format',
                    details: validationQuestionSchema.error.errors
                })
            }
            await question.save();
            return res.status(200).json({
                message: 'Question added successfully'
            });
        }
        catch(error){
            console.error(error);
            return res.status(500).json({
                error: 'Internal server error'
            })
        }
    },

    updateQyestion: async (req, res) => {
        try{
            const questionId = req.params.questionId;
            const questionText = req.body.questionText;
            const validationResult = IdSchema.safeParse(questionId);
            if(!validationResult.success){
                return res.status(400).json({
                    error: 'Invalid question id format',
                    details: validationResult.error.errors
                })
            }
            const question = await Question.findById(questionId);
            if(!question){
                return res.status(404).json({
                    error: 'Question not found'
                })
            }
            question.questionText = questionText;

            await question.save();

            return res.status(201).json({
                message: 'Question succesfully updated'
            })
        }
        catch(error){
            console.error(error);
            return res.status(500).json({
                error: 'Internal server error'
            }) 
        }
    },

    removeQuestion: async (req, res) => {
        try{
            const questionId = req.params.questionId;
            const validationResult = IdSchema.safeParse(questionId);
            if(!validationResult.success){
                return res.status(400).json({
                    error: 'Invalid question id format',
                    details: validationResult.error.errors
                })
            }
            const questionToDelete = await Question.findById(questionId);
            if (!questionToDelete) {
                return res.status(404).json({
                    error: 'Question not found.'
                });
            }
            await Question.findByIdAndDelete(questionId);

            return res.status(200).json({
                message: 'Question deleted successfully'
            });
        }
        catch(error){
            return res.status(500).json({
                error: 'Internal server error.'
            })
        }
    },

    getQuestion: async (req, res) => {
        try{
            const courseId = req.params.courseId;
            const validationResult = IdSchema.safeParse(questionId);
            if(!validationResult.success){
                return res.status(400).json({
                    error: 'Invalid course id format',
                    details: validationResult.error.errors
                })
            }
            const question = await Question.find({course: courseId});

            if (question.length === 0) {
                return res.status(404).json({
                    error: 'No questions found for this course ID.'
                });
            }

            return res.status(200).json(question);
        }
        catch(error){
            return res.status(500).json({
                error: 'Internal server error.'
            })
        }
    },
}

export default questionController;