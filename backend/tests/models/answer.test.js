import mongoose from 'mongoose';
import Answer from '../../models/Answer.model.js';

describe('Answer Model', () => {
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
        await Answer.deleteMany({});
    });

    // Disconnect from MongoDB after all tests are done
    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('Answer Creation', () => {
        it('should create a new answer', async () => {
            // Sample data for creating a new answer
            const answerData = {
                question: mongoose.Types.ObjectId(), // Replace with an actual question ID
                user: mongoose.Types.ObjectId(), // Replace with an actual user ID
                answerText: 'This is a test answer',
            };

            const answer = await Answer.create(answerData);
            expect(answer).toBeDefined();
            expect(answer.question).toBe(answerData.question);
            expect(answer.user).toBe(answerData.user);
            expect(answer.answerText).toBe(answerData.answerText);
        });
    });

    // Add more test cases as needed to cover other functionalities of the Answer model
});
