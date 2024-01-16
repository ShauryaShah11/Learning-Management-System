import { z } from 'zod';
import User from '../models/User.model.js';
import Course from '../models/Course.model.js';
import CourseCategory from '../models/CourseCategory.model.js';

const coureSchema = z.object({
    courseName: z.string().min(1).max(50),
    price: z.number().min(0),
    duration: z.string().min(1).max(50).optional(),
    description: z.string().min(1).max(200),
    level: z.enum(['beginner', 'intermediate', 'advanced']),
    prerequisites: z.array(z.string()), 
    language: z.string(),
    tutor: z.string().uuid(),
    category: z.string().uuid()
})

const courseIdSchema = z.string().uuid();

const courseController = {
    createCourse: async (req, res) => {
        try{
            const {courseName, price, duration, description, level, language, prerequisites, category} = req.body;
            const userId = req.user.__id;
            const user = await User.findById(userId);
            if(!user){
                return res.status(404).json({error: 'User not found'})
            }
            if(user.role !== 'tutor' ){
                return res.status(403).json({error: 'Unauthorized access'})
            }
            const course = new Course({
                courseName,
                price,
                duration,
                description,
                level,
                prerequisites,
                language,
                tutor: userId,
                category
            });
            const validateCourse = coureSchema.safeParse(course);
            if(!validateCourse.success){
                return res.status(400).json({
                    error: 'Invalid course format',
                    details: validateCourse.error.errors
                })
            }
            const courseCategory = await CourseCategory.findById(category);
            const savedCourse = await course.save();
            courseCategory.courses.push(savedCourse.__id);
            await courseCategory.save();

            return res.status(200).json({message: 'Course saved successfully'});
        }
        catch(error){
            return res.status(500).json({
                error : 'Internal Server Error'
            })
        }
    },

    updateCourse: async (req, res) => {
        try {
            const courseId = req.params.courseId;
            const { courseName, price, duration, description, level, prerequisites, language, category } = req.body;
            const userId = req.user.__id;
    
            const course = await Course.findById(courseId);
    
            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }
    
            if (course.tutor !== userId && req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Unauthorized access' });
            }
    
            const updateCourse = new Course({
                courseName,
                price,
                duration,
                description,
                level,
                prerequisites,
                language,
                tutor: course.tutor,
            });
            const validateCourse = coureSchema.safeParse(updateCourse);
            if (!validateCourse.success) {
                return res.status(400).json({
                    error: 'Invalid course format',
                    details: validateCourse.error.errors,
                });
            }
            const updatedCourse = await Course.findByIdAndUpdate(courseId, updateCourse, { new: true });
    
            const oldCourseCategory = await CourseCategory.findOneAndUpdate(
                { courses: course._id },
                { $pull: { courses: course._id } },
                { new: true }
            );
    
            // Updated: Use findOneAndUpdate to update the new CourseCategory
            const updatedCourseCategory = await CourseCategory.findOneAndUpdate(
                { _id: category },
                { $addToSet: { courses: updatedCourse._id } },
                { new: true }
            );
    
            return res.status(200).json({
                message: 'Course successfully updated',
                updatedCourse,
            });
        } catch (error) {
            console.error('Error updating course:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },    

    deleteCourse: async (req, res) => {
        try {
            const courseId = req.params.courseId;
            const validationResult = courseIdSchema.safeParse(courseId);
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
            const oldCourseCategory = await CourseCategory.findOneAndUpdate(
                { courses: course._id },
                { $pull: { courses: course._id } },
                { new: true }
            );
    
            await Course.findByIdAndDelete(courseId);
    
            return res.status(200).json({
                message: 'Course successfully deleted',
                deletedCourse: course // Send deleted course details in the response
            });
        } catch (error) {
            console.error('Error deleting course:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    getCourse: async (req, res) => {
        try{
            const course = await Course.find();

            if(course.length === 0){
                return res.status(404).json({error: 'no course found'});
            }

            return res.status(200).json(course);
        }
        catch(error){
            return res.status(500).json({
                error: 'Internal server error'
            })
        }
    },

    getCourseById: async (req, res) => {
        try{    
            const courseId = req.params.courseId;
            const validationResult = courseIdSchema.safeParse(courseId);
            if(!validationResult.success){
                return res.status(400).json({
                    error: 'Invalid course id format',
                    details: validationResult.error.errors
                })
            }
            const course = await Course.findById(courseId);

            if(!course){
                return res.status(404).json({error: 'Course not found'});
            }

            return res.status(200).json(course);
        }
        catch(error){
            return res.status(500).json({
                error: 'Interna server error'
            })
        }
    }  
    
}

export default courseController;