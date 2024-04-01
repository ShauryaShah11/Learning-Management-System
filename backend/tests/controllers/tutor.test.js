import tutorController from '../../controllers/tutor.controller.js';

describe('tutorController', () => {
    describe('getTutor', () => {
        it('should return 500 if an error occurs', async () => {
            const req = {};
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            Tutor.find.mockRejectedValue(new Error());

            await tutorController.getTutor(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        });
    });

    describe('getTutorById', () => {
        it('should return 400 for invalid tutorId', async () => {
            const req = { params: { tutorId: 'invalidTutorId' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await tutorController.getTutorById(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid tutorId' });
        });

        it('should return 404 for non-existing tutorId', async () => {
            const req = { params: { tutorId: 'nonExistingTutorId' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            Tutor.findById.mockResolvedValue(null);

            await tutorController.getTutorById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Tutor not found' });
        });
    });

    describe('updateTutor', () => {
        it('should return 400 for invalid tutorId', async () => {
            const req = { params: { tutorId: 'invalidTutorId' }, body: { yearOfExperience: 5 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await tutorController.updateTutor(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid tutorId' });
        });

        it('should return 404 for non-existing tutorId', async () => {
            const req = { params: { tutorId: 'nonExistingTutorId' }, body: { yearOfExperience: 5 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            Tutor.findByIdAndUpdate.mockResolvedValue(null);

            await tutorController.updateTutor(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Tutor not found' });
        });

        it('should return 400 for invalid user format', async () => {
            const req = { params: { tutorId: 'validTutorId' }, body: { yearOfExperience: 5, firstName: 'John', lastName: 'Doe', username: 'johndoe', email: 'invalidEmail', contactNumber: '1234567890', age: 30 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await tutorController.updateTutor(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid user format' });
        });
    });
});
