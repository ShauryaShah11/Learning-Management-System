import User from '../models/User.model.js';
import Course from '../models/Course.model.js';
const courseController = {
    createCourse: async (req, res) => {
        try{
            const {courseName, price, duration, description, level, language} = req.body;
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
                language,
                tutor: userId
            });

            await Course.save();

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
            const { courseName, price, duration, description, level, language } = req.body;
            const userId = req.user.__id;
    
            const course = await Course.findById(courseId);
    
            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }
    
            if (course.tutor !== userId || req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Unauthorized access' });
            }
    
            const updatedCourse = await Course.findByIdAndUpdate(
                courseId,
                { courseName, price, duration, description, level, language },
                { new: true }
            );
    
            return res.status(200).json({
                message: 'Course successfully updated',
                updatedCourse // Send updated course details in the response
            });
        } catch (error) {
            console.error('Error updating course:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    deleteCourse: async (req, res) => {
        try {
            const courseId = req.params.courseId;
            const course = await Course.findById(courseId);
            const userId = req.user.__id;
    
            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }
    
            if (course.tutor !== userId && req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Unauthorized access' });
            }
    
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