import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import CourseEnrolled from '../../models/CourseEnrolled.model.js';

describe('CourseEnrolled Model', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await CourseEnrolled.deleteMany({});
  });

  it('should create and save a course enrolled instance', async () => {
    const courseEnrolledData = {
      course: mongoose.Types.ObjectId(),
      student: mongoose.Types.ObjectId(),
      enrolledDate: new Date(),
      status: 'in progress',
      progress: 50,
      certificateIssued: false,
    };

    const courseEnrolled = new CourseEnrolled(courseEnrolledData);
    const savedCourseEnrolled = await courseEnrolled.save();

    expect(savedCourseEnrolled._id).toBeDefined();
    expect(savedCourseEnrolled.course).toEqual(courseEnrolledData.course);
    expect(savedCourseEnrolled.student).toEqual(courseEnrolledData.student);
    expect(savedCourseEnrolled.enrolledDate).toEqual(courseEnrolledData.enrolledDate);
    expect(savedCourseEnrolled.status).toEqual(courseEnrolledData.status);
    expect(savedCourseEnrolled.progress).toEqual(courseEnrolledData.progress);
    expect(savedCourseEnrolled.certificateIssued).toEqual(courseEnrolledData.certificateIssued);
  });

  it('should not save a course enrolled instance with missing required fields', async () => {
    const courseEnrolledData = {
      student: mongoose.Types.ObjectId(),
      enrolledDate: new Date(),
      status: 'in progress',
      progress: 50,
      certificateIssued: false,
    };

    const courseEnrolled = new CourseEnrolled(courseEnrolledData);

    let err;
    try {
      await courseEnrolled.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.message).toContain('CourseEnrolled validation failed');
  });

  // Add more test cases as needed
});
