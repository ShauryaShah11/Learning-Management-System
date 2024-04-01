import mongoose from 'mongoose';
import Subsection from '../../models/Subsection.model.js';

describe('Subsection Model', () => {
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
        await Subsection.deleteMany({});
    });

    // Disconnect from MongoDB after all tests are done
    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('Subsection Creation', () => {
        it('should create a new subsection', async () => {
            // Sample data for creating a new subsection
            const subsectionData = {
                title: 'Introduction Video', // Replace with the subsection title
                type: 'video', // Replace with the type of subsection
                url: 'https://example.com/intro_video.mp4', // Replace with the URL or CMS reference
                duration: 120, // Optional: Replace with the duration in seconds
                order: 1, // Optional: Replace with the order of the subsection
                section: mongoose.Types.ObjectId(), // Replace with a valid section ID
            };

            const subsection = await Subsection.create(subsectionData);
            expect(subsection).toBeDefined();
            expect(subsection.title).toBe(subsectionData.title);
            expect(subsection.type).toBe(subsectionData.type);
            expect(subsection.url).toBe(subsectionData.url);
            expect(subsection.duration).toBe(subsectionData.duration);
            expect(subsection.order).toBe(subsectionData.order);
            expect(subsection.section).toEqual(subsectionData.section);
        });

        it('should require title, type, url, and section fields', async () => {
            try {
                await Subsection.create({});
            } catch (error) {
                expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
                expect(error.errors.title).toBeDefined();
                expect(error.errors.type).toBeDefined();
                expect(error.errors.url).toBeDefined();
                expect(error.errors.section).toBeDefined();
            }
        });

        // Add more test cases as needed to cover other functionalities of the Subsection model
    });
});
