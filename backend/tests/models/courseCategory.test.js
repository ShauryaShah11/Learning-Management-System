import mongoose from 'mongoose';
import CourseCategory from '../../models/CourseCategory.model.js';

describe('CourseCategory Model', () => {
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
        await CourseCategory.deleteMany({});
    });

    // Disconnect from MongoDB after all tests are done
    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('CourseCategory Creation', () => {
        it('should create a new course category', async () => {
            // Sample data for creating a new course category
            const categoryData = {
                categoryName: 'Test Category',
                description: 'Test description',
                coverImageUrl: 'https://example.com/image.jpg',
            };

            const category = await CourseCategory.create(categoryData);
            expect(category).toBeDefined();
            expect(category.categoryName).toBe(categoryData.categoryName);
            expect(category.description).toBe(categoryData.description);
            expect(category.coverImageUrl).toBe(categoryData.coverImageUrl);
        });

        it('should require categoryName', async () => {
            try {
                await CourseCategory.create({});
            } catch (error) {
                expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
                expect(error.errors.categoryName).toBeDefined();
            }
        });

        it('should enforce unique categoryName', async () => {
            try {
                await CourseCategory.create({
                    categoryName: 'Test Category',
                });
                await CourseCategory.create({
                    categoryName: 'Test Category', // Same category name as before
                });
            } catch (error) {
                expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
                expect(error.errors.categoryName).toBeDefined();
            }
        });

        it('should ensure categoryName length does not exceed 50 characters', async () => {
            try {
                await CourseCategory.create({
                    categoryName: 'A very long category name that exceeds fifty characters limit',
                });
            } catch (error) {
                expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
                expect(error.errors.categoryName).toBeDefined();
            }
        });

        // Add more test cases as needed to cover other functionalities of the CourseCategory model
    });
});
