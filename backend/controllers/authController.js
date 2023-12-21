import User from './models/User';
import Tutor from './models/Tutor';

const authController = {
    login: async (req, res) => {

    },

    register: async (user) => {

    },

    userRegister: async (req, res) => {
        try{
            const user = {

            }
            const userId = await register(user);
            return res.status(200).json({message: 'User is Successfully regsitered'});
        }
        catch(error){
            console.error(error);
            return res.status(500).json({error: 'Error Registrating user'})
        }
    },

    tutorRegister: async (req, res) => {
        try{
            const user = {

            }
            const userId = await register(user);
            if(!userId){
                return res.status(500).json({error: 'Error Registrating user'})
            }
            const newTutor = new Tutor({
                
            })
            const tutor = await newTutor.save();
            return res.status(200).json({message: 'Tutor is Successfully regsitered'});
        }
        catch(error){
            console.error(error);
            return res.status(500).json({error: 'Error Registrating user'})
        }
    },
}