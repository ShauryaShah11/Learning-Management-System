import mongoose from 'mongoose';
import Course from '../../models/Course.model.js';

describe('Course Model', () => {
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
        await Course.deleteMany({});
    });

    // Disconnect from MongoDB after all tests are done
    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('Course Creation', () => {
        it('should create a new course', async () => {
            // Sample data for creating a new course
            const courseData = {
                courseName: 'Test Course',
                price: 100,
                duration: '1 month',
                description: 'Test description',
                level: 'beginner',
                prerequisites: ['HTML', 'CSS'],
                language: 'English',
                thumbnailUrl: 'https://example.com/image.jpg',
                tutor: mongoose.Types.ObjectId(), // Replace with an actual tutor ID
                category: mongoose.Types.ObjectId(), // Replace with an actual category ID
            };

            const course = await Course.create(courseData);
            expect(course).toBeDefined();
            expect(course.courseName).toBe(courseData.courseName);
            expect(course.price).toBe(courseData.price);
            expect(course.duration).toBe(courseData.duration);
            expect(course.description).toBe(courseData.description);
            expect(course.level).toBe(courseData.level);
            expect(course.prerequisites).toEqual(courseData.prerequisites);
            expect(course.language).toBe(courseData.language);
            expect(course.thumbnailUrl).toBe(courseData.thumbnailUrl);
            expect(course.tutor).toBe(courseData.tutor);
            expect(course.category).toBe(courseData.category);
        });

        it('should require courseName, price, duration, level, language, tutor, and category', async () => {
            try {
                await Course.create({});
            } catch (error) {
                expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
                expect(error.errors.courseName).toBeDefined();
                expect(error.errors.price).toBeDefined();
                expect(error.errors.duration).toBeDefined();
                expect(error.errors.level).toBeDefined();
                expect(error.errors.language).toBeDefined();
                expect(error.errors.tutor).toBeDefined();
                expect(error.errors.category).toBeDefined();
            }
        });

        it('should ensure non-negative price', async () => {
            try {
                await Course.create({
                    courseName: 'Test Course',
                    price: -50,
                    duration: '1 month',
                    description: 'Test description',
                    level: 'beginner',
                    language: 'English',
                    tutor: mongoose.Types.ObjectId(),
                    category: mongoose.Types.ObjectId(),
                });
            } catch (error) {
                expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
                expect(error.errors.price).toBeDefined();
            }
        });

        // Add more test cases as needed to cover other functionalities of the Course model
    });
});
