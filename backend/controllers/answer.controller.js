import Answer from "../models/Answer.model.js";

const answerController = {
    addAnswer: async (req, res) => {
        try{
            const questionId = req.params.questionId;
            const answerText = req.body.answerText;
            console.log("hello")
            if (!questionId || !answerText) {
                return res.status(400).json({
                    error: 'Missing required fields: questionId or answerText.'
                });
            }
            const answer = new Answer({
                question: questionId,
                answerText: answerText,
                user: req.userId
            })

            await answer.save();

            return res.status(200).json({
                message: 'Answer saved successfully'
            })
        }
        catch(error){
            console.error(error);
            return res.status(500).json({
                error: 'Internal server error.'
            })
        }
    },

    removeAnser: async (req, res) => {
        try{
            const answerId = req.params.answerId;

            const answer = await Answer.findById(answerId);
            if(!answer){
                return res.status(404).json({
                    error: 'Answer is not found'
                })
            }

            await Answer.findByIdAndDelete(answerId);

            return res.status(200).json({
                message: 'answer deleted successfully'
            });
        }
        catch(error){
            return res.status(500).json({
                error: 'Internal server error.'
            })
        }
    },

    updateAnswer: async(req, res) => {
        try{
            const answerId = req.body.answerId;
            const answerText = req.body.answerText;

            if(!answerId || !answerText){
                return res.status(404).jsom({
                    error: 'Missing required fields: answerId or answerText.'
                })
            }

            const answer = await Answer.findByIdAndUpdate(
                answerId,
                { answerText: answerText, datePosted: new Date() },
                { new: true }
            );

            if (!answer) {
                return res.status(404).json({
                    error: 'Answer not found.'
                });
            }

            return res.status(200).json({
                message: 'answer updated successfully'
            })
        }
        catch(error){
            return res.status(500).json({
                error: 'Internal server error.'
            })
        }
    }
}

export default answerController;