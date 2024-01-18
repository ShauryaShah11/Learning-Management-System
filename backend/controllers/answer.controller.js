import { z } from 'zod';
import mongoose from 'mongoose';
import Answer from '../models/Answer.model.js';
import Question from '../models/Question.model.js';

const answerSchema = z.object({
    user: z.instanceof(mongoose.Types.ObjectId),
    question: z.instanceof(mongoose.Types.ObjectId),
    answerText: z.string().min(1).max(500)
});

const IdSchema = z.string().refine((val) => {
    return mongoose.Types.ObjectId.isValid(val);
  }, {
    message: 'Invalid Id format',
});
  
const validateId = (Id) => {
  const validationResult = IdSchema.safeParse(Id);
  return validationResult.success ? null : {
    error: 'Invalid id format',
    details: validationResult.error.errors,
  };
};

const answerTextSchema = z.string().min(1).max(500);

const answerController = {
    addAnswer: async (req, res) => {
        try{
            const questionId = req.params.questionId;
            const answerText = req.body.answerText;
            const validationIdError = validateId(questionId);
            if (validationIdError) {
                return res.status(400).json(validationIdError);
            }
            const question = await Question.findById(questionId);
            if(!question){
                return res.status(404).json({
                    error: 'question not found'
                })
            }
            const answer = new Answer({
                question: questionId,
                answerText: answerText,
                user: req.user._id
            })
            const validationResult = answerSchema.safeParse(answer);
            if(!validationResult.success){
                return res.status(400).json({
                    error: 'Invalid answer format',
                    details: validationResult.error.errors
                })
            }

            const savedAnswer = await answer.save();
            await Question.findByIdAndUpdate(questionId, {
                "$push":{
                    answers: savedAnswer._id
                }
            })
            
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

            const validationIdError = validateId(answerId);
            if (validationIdError) {
                return res.status(400).json(validationIdError);
            }

            const answer = await Answer.findById(answerId);
            if(!answer){
                return res.status(404).json({
                    error: 'Answer is not found'
                })
            }
            await Question.findOneAndUpdate(
                { answers: answerId },
                { $pull: { answers: answerId } },
                { new: true }
            );
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

            const validationIdError = validateId(answerId);
            if (validationIdError) {
                return res.status(400).json(validationIdError);
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