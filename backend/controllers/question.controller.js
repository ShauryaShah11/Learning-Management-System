import Course from '../models/Course.model.js';
import User from '../models/User.model.js';
import Question from '../models/Question.model.js';

const questionController = {
    addQuestion: async (req, res) => {
        try{
            const courseId = req.params.courseId;
            const questionText = req.body.questionText;
            const course = await Course.findById(courseId);
            const userId = req.user.__id;

            if(!course){
                return res.status(404).json({error: 'Course not found'});
            }
            const question = new Question({
                course: courseId, 
                questionText: questionText,
                user: userId
            })
            await question.save();
            return res.status(200).json({
                message: 'Question added successfully'
            });
        }
        catch(error){
            console.error(error);
            return res.status(500).json({
                error: 'Internal server error'
            })
        }
    },

    removeQuestion: async (req, res) => {
        try{
            const questionId = req.params.questionId;

            const questionToDelete = await Question.findById(questionId);
            if (!questionToDelete) {
                return res.status(404).json({
                    error: 'Question not found.'
                });
            }
            await Question.findByIdAndDelete(questionId);

            return res.status(200).json({
                message: 'Question deleted successfully'
            });
        }
        catch(error){
            return res.status(500).json({
                error: 'Internal server error.'
            })
        }
    },

    getQuestion: async (req, res) => {
        try{
            const courseId = req.params.courseId;
            const question = await Question.find({course: courseId});

            if (question.length === 0) {
                return res.status(404).json({
                    error: 'No questions found for this course ID.'
                });
            }

            return res.status(200).json(question);
        }
        catch(error){
            return res.status(500).json({
                error: 'Internal server error.'
            })
        }
    },
}

export default questionController;