import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../../models/User.model.js';

describe('User Model', () => {
    // Connect to MongoDB before running tests
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/testdb', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
    });

    // Clear the database after each test
    afterEach(async () => {
        await User.deleteMany({});
    });

    // Disconnect from MongoDB after all tests are done
    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('User Creation', () => {
        it('should create a new user', async () => {
            // Sample data for creating a new user
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe',
                contactNumber: '1234567890',
                age: 25,
                role: 'student',
                isVerified: true,
            };

            const user = await User.create(userData);
            expect(user).toBeDefined();
            expect(user.username).toEqual(userData.username);
            expect(user.email).toEqual(userData.email);
            expect(user.firstName).toEqual(userData.firstName);
            expect(user.lastName).toEqual(userData.lastName);
            expect(user.contactNumber).toEqual(userData.contactNumber);
            expect(user.age).toEqual(userData.age);
            expect(user.role).toEqual(userData.role);
            expect(user.isVerified).toEqual(userData.isVerified);
        });

        it('should hash the password before saving', async () => {
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
            };

            const user = await User.create(userData);
            expect(user.password).toBeDefined();
            expect(await bcrypt.compare('password123', user.password)).toBeTruthy();
        });

        it('should require username, email, password fields', async () => {
            try {
                await User.create({});
            } catch (error) {
                expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
                expect(error.errors.username).toBeDefined();
                expect(error.errors.email).toBeDefined();
                expect(error.errors.password).toBeDefined();
            }
        });

        // Add more test cases as needed to cover other functionalities of the User model
    });
});
