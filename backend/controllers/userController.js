import User from "./models/User";

const userController = {
    getUser: async (req, res) => {
        try{
            const user = await User.find({});
            res.status(200).json(user);
        }catch(error){
            console.error(error);
            return res.status(500).json({error: 'error retrieving user details'});
        }
    },

    getUserById: async(req,res) => {

    },

    removeUserById: async(req, res) => {
        try{
            const userId = req.params.id;


        }catch(error){
            console.error(error);
            return res.status(500).json({error: 'Cant remove user'});
        }
    }

    
}