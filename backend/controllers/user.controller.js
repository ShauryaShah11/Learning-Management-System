import User from "../models/User.model.js";

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
    },

    updateUser: async(req, res) => {
        try{
            const userId = req.params.userId;

            const {username, email, password, firstName, lastName, age, contactNumber} = req.body;
            const user = await User.findById(userId);

            if(!user){
                return res.status(404).json({
                    error: 'user not found'
                })
            }

            const updateUser = await User.findByIdAndUpdate(userId, {
                username, email, password, firstName, lastName, age, contactNumber, dateUpdated: new Date()
            })


            return res.status(200).json({
                message: 'User succesfully updated'
            })
        }   
        catch(error){
            return res.status(500).json({
                error: 'Internal server error'
            })
        }
    }
    
}

export default userController;