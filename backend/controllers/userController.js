import User from "../models/User.js";

const userController = {
    getUser: async (req, res) => {
        try{
            const user = await User.find();
            return res.status(200).json(user);
        }catch(error){
            console.error(error);
            return res.status(500).json({error: 'error retrieving user details'});
        }
    },

    getUserById: async(req,res) => {
        try{
            const userId = req.params.id;
            const user = await User.findById({userId: userId});
            if(!user){
                return res.status(404).json({
                    error: 'User not found'
                })
            }
            return res.status(200).json(user);
        }catch(error){
            console.error(error);
            return res.status(500).json({
                error: 'Error Retrieving user'
            })
        }
    },

    removeUserById: async(req, res) => {
        try{
            const userId = req.params.id;

            const user = await User.findById({userId : userId})
            if(!user){
                return res.status(400).json({
                    error: 'User not found'
                })
            }

            await User.findByIdAndDelete(user.__id);

            return res.status(201).json({
                message: 'User is succesfully removed'
            });

        }catch(error){
            console.error(error);
            return res.status(500).json({error: 'Cant remove user'});
        }
    }
    
}

export default userController;