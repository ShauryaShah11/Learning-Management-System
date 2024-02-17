import { z } from 'zod';
import mongoose from 'mongoose';
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
    tutor: z.instanceof(mongoose.Types.ObjectId),
    category: z.instanceof(mongoose.Types.ObjectId)
})

const courseIdSchema = z.string().refine((val) => {
    return mongoose.Types.ObjectId.isValid(val);
  }, {
    message: 'Invalid courseId format',
});
  
const validateCourseId = (courseId) => {
  const validationResult = courseIdSchema.safeParse(courseId);
  return validationResult.success ? null : {
    error: 'Invalid course id format',
    details: validationResult.error.errors,
  };
};  

const courseController = {
    // analyze createCourse function and debug why course is not saved
    createCourse: async (req, res) => {
        try{
            const {courseName, price, duration, description, level, language, prerequisites, category} = req.body;
            const userId = req.user._id;
            if(req.user.role !== 'tutor'){
                return res.status(403).json({error: 'Unauthorized access'})
            }
            const thumbnailUrl = req.fileUrl;
            const course = new Course({
                courseName,
                price: parseInt(price),
                duration,
                description,
                level,
                prerequisites,
                language,
                tutor: userId,
                category,
                thumbnailUrl
            });
            const validateCourse = coureSchema.safeParse(course);
            if(!validateCourse.success){
                return res.status(400).json({
                    error: 'Invalid course format',
                    details: validateCourse.error.errors
                })
            }
            const savedCourse = await course.save();

            const courseCategory = await CourseCategory.findById(category);
            await CourseCategory.findByIdAndUpdate(category, {
                "$push":{
                    courses: savedCourse._id
                }
            })
            return res.status(200).json({message: 'Course saved successfully'});
        }
        catch(error){
            return res.status(500).json({
                error : 'Internal Server Error',
                message: error.message
            })
        }
    },

    updateCourse: async (req, res) => {
        try {
            const courseId = req.params.courseId;
            const { courseName, price, duration, description, level, prerequisites, language, category } = req.body;
    
            const course = await Course.findById(courseId);
    
            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
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
                category
            });
            const validateCourse = coureSchema.safeParse(updateCourse);
            if (!validateCourse.success) {
                return res.status(400).json({
                    error: 'Invalid course format',
                    details: validateCourse.error.errors,
                });
            }
            const updatedCourse = await Course.findByIdAndUpdate(courseId, updateCourse, { new: true });
    
            if(course.category !== category) {
                await CourseCategory.findOneAndUpdate(
                    { courses: course._id },
                    { $pull: { courses: course._id } },
                    { new: true }
                );
            }
    
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
            const validationIdError = validateCourseId(courseId);
            if (validationIdError) {
                return res.status(400).json(validationIdError);
            }
            const course = await Course.findById(courseId);
    
            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }   
            await CourseCategory.findOneAndUpdate(
                { courses: course._id },
                { $pull: { courses: course._id } }
            );
    
            await Course.findByIdAndDelete(courseId);
    
            return res.status(200).json({
                message: 'Course successfully deleted',
                deletedCourse: course 
            });
        } catch (error) {
            console.error('Error deleting course:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    getCourse: async (req, res) => {
        try{
            const course = await Course.find({
                published: false
            });
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
            const validationIdError = validateCourseId(courseId);
            if (validationIdError) {
                return res.status(400).json(validationIdError);
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