import Course from '../models/Course.model.js';
import CourseEnrolled from '../models/CourseEnrolled.model.js';
import Payment from '../models/Payment.model.js';

const courseEnrolledController = {
    enrollInCourse: async (req, res) => {
        try{
            const userId = req.user.__id;
            const courseId = req.params.courseId;

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
            await courseEnrolled.save();

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
            const course = await Course.findById(courseId);
    
            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }
    
            const courseEnrolled = await CourseEnrolled.findOne({ course: courseId })
                .populate('user', 'username  email age')
                .populate('course', 'courseName');
    
            if (!courseEnrolled) {
                return res.status(404).json({ error: 'No users are enrolled in the course' });
            }
    
            return res.status(200).json(courseEnrolled);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    unEnrollUser: async (req, res) => {
        try {
            const enrollmentId = req.params.id;
    
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