import mongoose from 'mongoose';
import Tutor from '../../models/Tutor.model.js';

describe('Tutor Model', () => {
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
        await Tutor.deleteMany({});
    });

    // Disconnect from MongoDB after all tests are done
    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('Tutor Creation', () => {
        it('should create a new tutor', async () => {
            // Sample data for creating a new tutor
            const tutorData = {
                userId: mongoose.Types.ObjectId(), // Replace with a valid user ID
                yearOfExperience: 3, // Replace with the years of experience
                bio: 'Experienced tutor with a passion for teaching.', // Replace with the tutor's bio
                expertise: 'Mathematics', // Replace with the tutor's expertise
                achievements: 'Awarded Best Tutor 2020', // Replace with the tutor's achievements
                ratings: 4.5, // Replace with the tutor's ratings
            };

            const tutor = await Tutor.create(tutorData);
            expect(tutor).toBeDefined();
            expect(tutor.userId).toEqual(tutorData.userId);
            expect(tutor.yearOfExperience).toEqual(tutorData.yearOfExperience);
            expect(tutor.bio).toEqual(tutorData.bio);
            expect(tutor.expertise).toEqual(tutorData.expertise);
            expect(tutor.achievements).toEqual(tutorData.achievements);
            expect(tutor.ratings).toEqual(tutorData.ratings);
        });

        it('should require userId, yearOfExperience fields', async () => {
            try {
                await Tutor.create({});
            } catch (error) {
                expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
                expect(error.errors.userId).toBeDefined();
                expect(error.errors.yearOfExperience).toBeDefined();
            }
        });

        // Add more test cases as needed to cover other functionalities of the Tutor model
    });
});
