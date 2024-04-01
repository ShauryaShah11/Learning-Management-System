import userController from "../../controllers/user.controller.js";

describe('userController', () => {
    describe('getUsers', () => {
        it('should return 500 if an error occurs', async () => {
            const req = {};
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            User.find.mockRejectedValue(new Error());

            await userController.getUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'error retrieving user details' });
        });
    });

    describe('getUserById', () => {
        it('should return 400 for invalid userId', async () => {
            const req = { params: { userId: 'invalidUserId' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await userController.getUserById(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid userId' });
        });

        it('should return 404 for non-existing userId', async () => {
            const req = { params: { userId: 'nonExistingUserId' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            User.findById.mockResolvedValue(null);

            await userController.getUserById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
        });
    });

    describe('getUserByAuthToken', () => {
        it('should return 500 if an error occurs', async () => {
            const req = { user: null };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await userController.getUserByAuthToken(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error Retrieving user' });
        });
    });

    describe('removeUserById', () => {
        it('should return 400 for invalid userId', async () => {
            const req = { params: { id: 'invalidUserId' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await userController.removeUserById(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid userId' });
        });

        it('should return 404 for non-existing userId', async () => {
            const req = { params: { id: 'nonExistingUserId' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            User.findById.mockResolvedValue(null);

            await userController.removeUserById(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
        });
    });

    describe('updateUser', () => {
        it('should return 400 for invalid userId', async () => {
            const req = { params: { userId: 'invalidUserId' }, body: { username: 'username', email: 'email@example.com', firstName: 'John', lastName: 'Doe', age: 30, contactNumber: '1234567890' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await userController.updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid userId' });
        });

        it('should return 404 for non-existing userId', async () => {
            const req = { params: { userId: 'nonExistingUserId' }, body: { username: 'username', email: 'email@example.com', firstName: 'John', lastName: 'Doe', age: 30, contactNumber: '1234567890' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            User.findById.mockResolvedValue(null);

            await userController.updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'user not found' });
        });

        it('should return 400 for invalid user format', async () => {
            const req = { params: { userId: 'validUserId' }, body: { username: 'username', email: 'invalidEmail', firstName: 'John', lastName: 'Doe', age: 30, contactNumber: '1234567890' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await userController.updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid user format' });
        });
    });
});