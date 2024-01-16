import Course from '../models/Course.model.js';
import CourseEnrolled from '../models/CourseEnrolled.model.js';
import Payment from '../models/Payment.model.js';
import { z } from 'zod';

const IdSchema = z.string().uuid();

const courseEnrolledController = {
    enrollInCourse: async (req, res) => {
        try{
            const userId = req.user.__id;
            const courseId = req.params.courseId;
            
            const validationResult = IdSchema.safeParse(courseId);
            if(!validationResult.success){
                return res.status(400).json({
                    error: 'Invalid course id format',
                    details: validationResult.error.errors
                })
            }
            const course = await Course.findById(courseId);
            if(!course){
                return res.status(404).json({
                    error: 'Course not found'
                })
            }
            const payment = await Payment.findOne({
                user: userId,
                course: courseId
            })
            if(!payment){
                return res.status(404).json({
                    error: 'payment not found'
                })
            }
            const courseEnrolled = new CourseEnrolled({
                student: userId,
                course: courseId
            })
            course.studentsEnrolled.push(userId);
            await courseEnrolled.save();
            await course.save();

            return res.status(200).json({
                message: 'User is succesfully enrolled in course'
            })
        }
        catch(error){
            return res.status(500).json({
                error: 'Internal server error'
            })
        }
    },

    updateProgress: async (req, res) => {
        try{

        }
        catch(error){
            return res.status(500).json({
                error: 'Internal server error'
            })
        }
    },

    getEnrolledUsers: async (req, res) => {
        try {
            const courseId = req.params.courseId;
            const validationResult = IdSchema.safeParse(courseId);
            if(!validationResult.success){
                return res.status(400).json({
                    error: 'Invalid course id format',
                    details: validationResult.error.errors
                })
            }
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }
    
            if (!course.studentsEnrolled || course.studentsEnrolled.length === 0) {
                return res.status(404).json({ error: 'No users are enrolled in the course' });
            }    
            // Assuming studentsEnrolled contains user IDs
            const enrolledUserIds = course.studentsEnrolled;    
            // Fetch user details based on user IDs
            const enrolledUsers = await User.find({ _id: { $in: enrolledUserIds } }, 'username email age');
    
            return res.status(200).json(enrolledUsers);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    unEnrollUser: async (req, res) => {
        try {
            const enrollmentId = req.params.id;
            const validationResult = IdSchema.safeParse(enrollmentId);
            if(!validationResult.success){
                return res.status(400).json({
                    error: 'Invalid enrollment id format',
                    details: validationResult.error.errors
                })
            }
            const courseEnrolled = await CourseEnrolled.findById(enrollmentId);
    
            if (!courseEnrolled) {
                return res.status(404).json({ error: 'Enrollment record not found' });
            }
    
            await CourseEnrolled.findByIdAndUpdate(enrollmentId, { status: 'dropped out' }, { new: true });
            
            return res.status(200).json({
                message: 'Successfully unenrolled',
            });
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }   
    
}

export default courseEnrolledController;