import authController from '../../controllers/auth.controller.js';
import User from '../../models/User.model.js';
import Tutor from '../../models/Tutor.model.js';
import emailController from '../../controllers/email.controller.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Mocking the required modules
jest.mock('../../models/User.model.js');
jest.mock('../../models/Tutor.model.js');
jest.mock('../../controllers/email.controller');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('crypto');

describe('Auth Controller', () => {
    describe('login', () => {
        it('should successfully log in a user', async () => {
            const req = {
                body: { email: 'test@example.com', password: 'password' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const user = { _id: 'userId', email: 'test@example.com', password: 'hashedPassword', role: 'student' };
            User.findOne.mockResolvedValueOnce(user);
            bcrypt.compare.mockResolvedValueOnce(true);
            jwt.sign.mockReturnValueOnce('token');

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Login successful', token: 'token' });
        });

        it('should return 401 if email or password is incorrect', async () => {
            const req = {
                body: { email: 'test@example.com', password: 'wrongPassword' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            User.findOne.mockResolvedValueOnce(null);

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ success: false, error: 'email or password is incorrect' });
        });

        it('should return 500 if an error occurs during execution', async () => {
            const req = {
                body: { email: 'test@example.com', password: 'password' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            User.findOne.mockRejectedValueOnce('Internal Server Error');

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        });
    });

    describe('userRegister', () => {
        it('should successfully register a user', async () => {
            const req = {
                body: {
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password',
                    firstName: 'John',
                    lastName: 'Doe',
                    age: 25,
                    contactNumber: '1234567890'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const savedUser = { _id: 'userId', username: 'testuser', email: 'test@example.com' };
            User.mockReturnValueOnce({ save: jest.fn().mockResolvedValueOnce(savedUser) });
    
            await authController.userRegister(req, res);
    
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'User is Successfully registered' });
        });
    
        it('should return 400 if user data is invalid', async () => {
            const req = {
                body: {
                    // Incomplete user data
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            await authController.userRegister(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid user format', details: /* Error details */ });
        });
    
        it('should return 500 if an error occurs during user registration', async () => {
            const req = {
                body: {
                    // User data
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            User.mockReturnValueOnce({ save: jest.fn().mockRejectedValueOnce('Database error') });
    
            await authController.userRegister(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error Registrating user. Please Try again later' });
        });
    
    });

    describe('tutorRegister', () => {
        it('should successfully register a tutor', async () => {
            const req = {
                body: {
                    username: 'testtutor',
                    email: 'tutor@example.com',
                    password: 'password',
                    firstName: 'Jane',
                    lastName: 'Doe',
                    age: 30,
                    contactNumber: '1234567890',
                    yearOfExperience: 5,
                    bio: 'Experienced tutor',
                    expertise: 'Mathematics',
                    achievements: 'Best Tutor Award'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const savedUser = { _id: 'userId', username: 'testtutor', email: 'tutor@example.com' };
            const savedTutor = { _id: 'tutorId', userId: 'userId', expertise: 'Mathematics' };
            User.mockReturnValueOnce({ save: jest.fn().mockResolvedValueOnce(savedUser) });
            Tutor.mockReturnValueOnce({ save: jest.fn().mockResolvedValueOnce(savedTutor) });
    
            await authController.tutorRegister(req, res);
    
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'Tutor is Successfully registered' });
        });
    
        it('should return 400 if tutor data is invalid', async () => {
            const req = {
                body: {
                    // Incomplete tutor data
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            await authController.tutorRegister(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid user format', details: /* Error details */ });
        });
    
        it('should return 500 if an error occurs during tutor registration', async () => {
            const req = {
                body: {
                    // Tutor data
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            User.mockReturnValueOnce({ save: jest.fn().mockRejectedValueOnce('Database error') });
    
            await authController.tutorRegister(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error Registrating user' });
        });
    
    });
});
