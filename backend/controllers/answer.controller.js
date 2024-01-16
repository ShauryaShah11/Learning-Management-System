import Answer from '../models/Answer.model.js';
import { z } from 'zod';

const answerSchema = z.object({
    user: z.string().uuid(),
    questionId: z.string().uuid(),
    answerText: z.string().min(1).max(500)
});

const answerIdSchema = z.string().uuid();
const answerTextSchema = z.string().min(1).max(500);
const answerController = {
    addAnswer: async (req, res) => {
        try{
            const questionId = req.params.questionId;
            const answerText = req.body.answerText;
            
            const answer = new Answer({
                question: questionId,
                answerText: answerText,
                user: req.userId
            })

            const validationResult = answerSchema.safeParse(answer);
            if(!validationResult.success){
                return res.status(400).json({
                    error: 'Invalid answer format',
                    details: validationResult.error.errors
                })
            }

            await answer.save();

            return res.status(200).json({
                message: 'Answer saved successfully'
            })
        }
        catch(error){
            console.error(error);
            return res.status(500).json({
                error: 'Internal server error.'
            })
        }
    },

    removeAnser: async (req, res) => {
        try{
            const answerId = req.params.answerId;

            const validationResult = answerIdSchema.safeParse(answerId);
            if(!validationResult.success){
                return res.status(400).json({
                    error: 'Invalid answer id format',
                    details: validationResult.error.errors
                })
            }

            const answer = await Answer.findById(answerId);
            if(!answer){
                return res.status(404).json({
                    error: 'Answer is not found'
                })
            }

            await Answer.findByIdAndDelete(answerId);

            return res.status(200).json({
                message: 'answer deleted successfully'
            });
        }
        catch(error){
            return res.status(500).json({
                error: 'Internal server error.'
            })
        }
    },

    updateAnswer: async(req, res) => {
        try{
            const answerId = req.params.answerId;
            const answerText = req.body.answerText;

            const validationIdResult = answerIdSchema.safeParse(answerId);
            if (!validationIdResult.success) {
                return res.status(400).json({
                    error: 'Invalid answer ID format',
                    details: validationIdResult.error.errors,
                });
            }

            const validationTextResult = answerTextSchema.safeParse(answerText);
            if (!validationTextResult.success) {
                return res.status(400).json({
                    error: 'Invalid answer Text format',
                    details: validationTextResult.error.errors,
                });
            }

            const answer = await Answer.findById(answerId);            
            if (!answer) {
                return res.status(404).json({
                    error: 'Answer not found.'
                });
            }

            if(req.user.__id !== answer.user){
                return res.status(403).json({
                    error: 'Unauthorized access.'
                });
            }  
            answer.answerText = answerText;

            await answer.save();               

            return res.status(200).json({
                message: 'answer updated successfully'
            })
        }
        catch(error){
            return res.status(500).json({
                error: 'Internal server error.'
            })
        }
    }
}

export default answerController;