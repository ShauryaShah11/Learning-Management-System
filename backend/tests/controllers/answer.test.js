import answerController from '../../controllers/answer.controller.js';
import Answer from '../../models/Answer.model.js';
import Question from '../../models/Question.model.js';
import { z } from 'zod';
import mongoose from 'mongoose';

// Mocking the required modules
jest.mock('../../models/Answer.model.js');
jest.mock('../../models/Question.model.js');

describe('Answer Controller', () => {
    describe('addAnswer', () => {
        it('should add an answer successfully', async () => {
            const req = {
                params: { questionId: 'validQuestionId' },
                body: { answerText: 'Valid answer text' },
                user: { _id: 'validUserId' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            Question.findById.mockResolvedValueOnce({ _id: 'validQuestionId' });
            Answer.mockReturnValueOnce({ save: jest.fn().mockResolvedValueOnce({ _id: 'validAnswerId' }) });

            await answerController.addAnswer(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Answer saved successfully' });
        });

        it('should return 404 if question is not found', async () => {
            const req = {
                params: { questionId: 'invalidQuestionId' },
                body: { answerText: 'Valid answer text' },
                user: { _id: 'validUserId' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            Question.findById.mockResolvedValueOnce(null);

            await answerController.addAnswer(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'question not found' });
        });

        it('should return 400 if questionId is invalid', async () => {
            const req = {
                params: { questionId: 'invalidQuestionId' },
                body: { answerText: 'Valid answer text' },
                user: { _id: 'validUserId' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            Question.findById.mockResolvedValueOnce({ _id: 'validQuestionId' });
            const validationIdError = { error: 'Invalid id format', details: ['Invalid format'] };
            answerController.validateId = jest.fn().mockReturnValueOnce(validationIdError);

            await answerController.addAnswer(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(validationIdError);
        });

        it('should return 400 if answer schema validation fails', async () => {
            const req = {
                params: { questionId: 'validQuestionId' },
                body: { answerText: 'Valid answer text' },
                user: { _id: 'validUserId' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            Question.findById.mockResolvedValueOnce({ _id: 'validQuestionId' });
            const validationResult = {
                success: false,
                error: { errors: ['Invalid answer format'] }
            };
            answerController.answerSchema.safeParse = jest.fn().mockReturnValueOnce(validationResult);

            await answerController.addAnswer(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid answer format', details: ['Invalid format'] });
        });

        it('should return 500 if an error occurs during execution', async () => {
            const req = {
                params: { questionId: 'validQuestionId' },
                body: { answerText: 'Valid answer text' },
                user: { _id: 'validUserId' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            Question.findById.mockRejectedValueOnce('Error');

            await answerController.addAnswer(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error.' });
        });

        // Add more test cases for other scenarios
    });

    describe('removeAnswer', () => {
        it('should remove an answer successfully', async () => {
            const req = {
                params: { answerId: 'validAnswerId' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const answerMock = { _id: 'validAnswerId' };
            Answer.findById.mockResolvedValueOnce(answerMock);
            Answer.findByIdAndDelete.mockResolvedValueOnce(answerMock);
    
            await answerController.removeAnswer(req, res);
    
            expect(Answer.findByIdAndDelete).toHaveBeenCalledWith('validAnswerId');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'answer deleted successfully' });
        });
    
        it('should return 404 if answer is not found', async () => {
            const req = {
                params: { answerId: 'invalidAnswerId' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            Answer.findById.mockResolvedValueOnce(null);
    
            await answerController.removeAnswer(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Answer is not found' });
        });
    
        it('should return 400 if answerId is invalid', async () => {
            const req = {
                params: { answerId: 'invalidAnswerId' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const validationIdError = { error: 'Invalid id format', details: ['Invalid format'] };
            answerController.validateId = jest.fn().mockReturnValueOnce(validationIdError);
    
            await answerController.removeAnswer(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(validationIdError);
        });
    
        it('should return 500 if an error occurs during execution', async () => {
            const req = {
                params: { answerId: 'validAnswerId' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            Answer.findById.mockRejectedValueOnce('Error');
    
            await answerController.removeAnswer(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error.' });
        });
    
        // Add more test cases for other scenarios
    });
    
    describe('updateAnswer', () => {
        it('should update an answer successfully', async () => {
            const req = {
                params: { answerId: 'validAnswerId' },
                body: { answerText: 'Updated answer text' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const answerMock = { _id: 'validAnswerId', save: jest.fn() };
            Answer.findById.mockResolvedValueOnce(answerMock);
            const validationResult = { success: true };
            answerController.answerTextSchema.safeParse = jest.fn().mockReturnValueOnce(validationResult);
    
            await answerController.updateAnswer(req, res);
    
            expect(answerMock.answerText).toBe('Updated answer text');
            expect(answerMock.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'answer updated successfully' });
        });
    
        it('should return 404 if answer is not found', async () => {
            const req = {
                params: { answerId: 'invalidAnswerId' },
                body: { answerText: 'Updated answer text' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            Answer.findById.mockResolvedValueOnce(null);
    
            await answerController.updateAnswer(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Answer not found.' });
        });
    
        it('should return 400 if answer text validation fails', async () => {
            const req = {
                params: { answerId: 'validAnswerId' },
                body: { answerText: '' } // Empty answer text
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const validationResult = { success: false, error: { errors: ['Invalid format'] } };
            answerController.answerTextSchema.safeParse = jest.fn().mockReturnValueOnce(validationResult);
    
            await answerController.updateAnswer(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid answer Text format', details: ['Invalid format'] });
        });
    
        it('should return 400 if answerId is invalid', async () => {
            const req = {
                params: { answerId: 'invalidAnswerId' },
                body: { answerText: 'Updated answer text' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const validationIdError = { error: 'Invalid id format', details: ['Invalid format'] };
            answerController.validateId = jest.fn().mockReturnValueOnce(validationIdError);
    
            await answerController.updateAnswer(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(validationIdError);
        });
    
        it('should return 500 if an error occurs during execution', async () => {
            const req = {
                params: { answerId: 'validAnswerId' },
                body: { answerText: 'Updated answer text' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            Answer.findById.mockRejectedValueOnce('Error');
    
            await answerController.updateAnswer(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error.' });
        });
    
        // Add more test cases for other scenarios
    });
    
});
