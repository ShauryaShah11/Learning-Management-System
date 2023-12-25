import User from '../models/User.js';
import Course from '../models/Course.js';
const courseController = {
    createCourse: async (req, res) => {
        try{
            const {courseName, price, duration, description, level, language} = req.body;
            const username = req.user.username;
            const user = await User.findOne({ username: username})
            if(!user){
                return res.status(404).json({error: 'User not found'})
            }
            if(user.role !== 'tutor'){
                return res.status(403).json({error: 'Unauthorized access'})
            }
            const course = new Course({
                courseName,
                price,
                duration,
                description,
                level,
                language,
                tutor: user.__id
            });

            await Course.save();

            return res.status(200).json({message: 'Course saved successfully'});
        }
        catch(error){
            return res.status(500).json({
                error : 'Internal Server Error'
            })
        }
    }
}

export default courseController;