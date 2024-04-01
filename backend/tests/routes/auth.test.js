import request from 'supertest';
import server from '../../index.js';

describe('Auth Routes', () => {
    describe('POST /login', () => {
        it('should return 400 if no username or password is provided', async () => {
            const res = await request(server).post('/login');
            expect(res.statusCode).toEqual(400);
        });

        it('should return 200 for valid credentials', async () => {
            const res = await request(server).post('/login').send({
                username: 'validUsername', // replace with actual username
                password: 'validPassword', // replace with actual password
            });
            expect(res.statusCode).toEqual(200);
        });
    });

    describe('POST /user-register', () => {
        it('should return 400 if username, email or contact number already exists', async () => {
            const res = await request(server).post('/user-register').send({
                username: 'existingUsername', // replace with existing username
                email: 'existingEmail', // replace with existing email
                contactNumber: 'existingContactNumber', // replace with existing contact number
                password: 'validPassword', // replace with valid password
            });
            expect(res.statusCode).toEqual(400);
        });

        it('should return 200 for valid registration details', async () => {
            const res = await request(server).post('/user-register').send({
                username: 'newUsername', // replace with new username
                email: 'newEmail', // replace with new email
                contactNumber: 'newContactNumber', // replace with new contact number
                password: 'validPassword', // replace with valid password
            });
            expect(res.statusCode).toEqual(200);
        });
    });

    describe('POST /tutor-register', () => {
        it('should return 400 if username, email or contact number already exists', async () => {
            const res = await request(server).post('/tutor-register').send({
                username: 'existingUsername', // replace with existing username
                email: 'existingEmail', // replace with existing email
                contactNumber: 'existingContactNumber', // replace with existing contact number
                password: 'validPassword', // replace with valid password
            });
            expect(res.statusCode).toEqual(400);
        });

        it('should return 200 for valid registration details', async () => {
            const res = await request(server).post('/tutor-register').send({
                username: 'newUsername', // replace with new username
                email: 'newEmail', // replace with new email
                contactNumber: 'newContactNumber', // replace with new contact number
                password: 'validPassword', // replace with valid password
            });
            expect(res.statusCode).toEqual(200);
        });
    });

    describe('GET /verification/:token', () => {
        it('should return 400 for invalid token', async () => {
            const res = await request(server).get('/verification/invalidToken');
            expect(res.statusCode).toEqual(400);
        });

        it('should return 200 for valid token', async () => {
            const res = await request(server).get('/verification/validToken'); // replace with actual valid token
            expect(res.statusCode).toEqual(200);
        });
    });
});