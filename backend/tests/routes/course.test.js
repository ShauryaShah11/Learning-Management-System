import request from 'supertest';
import server from '../../index.js';

describe('Course Routes', () => {
    let token;

    beforeAll((done) => {
        request(server)
            .post("/api/auth/login") // replace with your actual login route
            .send({
                username: "actualTestUsername", // replace with actual test user username
                password: "actualTestPassword", // replace with actual test user password
            })
            .end((err, response) => {
                token = response.body.token; // save the token!
                done();
            });
    });

    describe('POST /add', () => {
        it('should return 401 if no token is provided', async () => {
            const res = await request(server).post('/add');
            expect(res.statusCode).toEqual(401);
        });

        it('should return 200 for valid course creation', async () => {
            const res = await request(server)
                .post('/add')
                .set('Authorization', `Bearer ${token}`)
                .attach('file', 'path/to/file'); // replace with actual file path
            expect(res.statusCode).toEqual(200);
        });
    });

    describe('GET /all', () => {
        it('should return 401 if no token is provided', async () => {
            const res = await request(server).get('/all');
            expect(res.statusCode).toEqual(401);
        });

        it('should return 200 for valid token', async () => {
            const res = await request(server)
                .get('/all')
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
        });
    });

    describe('GET /tutor/:tutorId', () => {
        it('should return 400 for invalid tutorId', async () => {
            const res = await request(server).get('/tutor/invalidTutorId');
            expect(res.statusCode).toEqual(400);
        });

        it('should return 200 for valid tutorId', async () => {
            const res = await request(server).get('/tutor/validTutorId'); // replace with actual valid tutorId
            expect(res.statusCode).toEqual(200);
        });
    });

    describe('GET /:courseId', () => {
        it('should return 400 for invalid courseId', async () => {
            const res = await request(server).get('/invalidCourseId');
            expect(res.statusCode).toEqual(400);
        });

        it('should return 200 for valid courseId', async () => {
            const res = await request(server).get('/validCourseId'); // replace with actual valid courseId
            expect(res.statusCode).toEqual(200);
        });
    });

    describe('POST /toggle/:courseId', () => {
        it('should return 401 if user is not admin', async () => {
            const response = await request(server)
                .post('/api/course/toggle/someCourseId')
                .set('Authorization', `Bearer ${token}`);
            expect(response.statusCode).toBe(401);
        });

        // Add more test cases for admin access, token validation, etc.
    });

    describe('PUT /:courseId', () => {
        it('should return 401 if user is not admin', async () => {
            const response = await request(server)
                .put('/api/course/someCourseId')
                .set('Authorization', `Bearer ${token}`);
            expect(response.statusCode).toBe(401);
        });

        // Add more test cases for admin access, token validation, file upload, etc.
    });

    describe('DELETE /delete/:courseId', () => {
        it('should return 401 if user is not admin', async () => {
            const response = await request(server)
                .delete('/api/course/delete/someCourseId')
                .set('Authorization', `Bearer ${token}`);
            expect(response.statusCode).toBe(401);
        });

        // Add more test cases for admin access, token validation, course deletion, etc.
    });

    describe('GET /:courseId/content', () => {
        it('should return 401 if no token is provided', async () => {
            const response = await request(server).get('/api/course/someCourseId/content');
            expect(response.statusCode).toBe(401);
        });

        // Add more test cases for course content retrieval, token validation, etc.
    });
});