import mongoose from 'mongoose';
import Question from '../../models/Question.model.js';

describe('Question Model', () => {
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
        await Question.deleteMany({});
    });

    // Disconnect from MongoDB after all tests are done
    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('Question Creation', () => {
        it('should create a new question', async () => {
            // Sample data for creating a new question
            const questionData = {
                course: mongoose.Types.ObjectId(), // Replace with a valid course ID
                user: mongoose.Types.ObjectId(), // Replace with a valid user ID
                questionText: 'How to use React hooks?', // Replace with the question text
                answers: [], // Optionally, add answer references if needed
            };

            const question = await Question.create(questionData);
            expect(question).toBeDefined();
            expect(question.course).toEqual(questionData.course);
            expect(question.user).toEqual(questionData.user);
            expect(question.questionText).toBe(questionData.questionText);
            expect(question.answers).toEqual(questionData.answers);
        });

        it('should require all required fields', async () => {
            try {
                await Question.create({});
            } catch (error) {
                expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
                expect(error.errors.course).toBeDefined();
                expect(error.errors.user).toBeDefined();
                expect(error.errors.questionText).toBeDefined();
            }
        });

        // Add more test cases as needed to cover other functionalities of the Question model
    });
});
