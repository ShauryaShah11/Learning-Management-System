import { z } from 'zod';
import validator from 'validator';
import User from '../models/User.model.js';

const userSchema = z.object({
    username: z.string().min(1).max(50),
    email: z.string().min(1, { message: 'This field has to be filled.' }).email(),
    firstName: z.string(),
    lastName: z.string(),
    age: z.coerce.number()
            .int()
            .gte(1)
            .lte(150),
    contactNumber:  z.string().refine(validator.isMobilePhone),
});

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

    getUserByAuthToken: async(req,res) => {
        try{
            const user = req.user;
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

            await User.findByIdAndDelete(user._id);

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

            const {username, email, firstName, lastName, age, contactNumber} = req.body;
            const user = await User.findById(userId);

            if(!user){
                return res.status(404).json({
                    error: 'user not found'
                })
            }
            const updatedSchema = new User({
                username,
                email,
                firstName,
                lastName,
                age,
                contactNumber
            })
            const validationResult = userSchema.safeParse(updatedSchema);
            if(!validationResult.success){
                return res.status(400).json({
                    error: 'Invalid user format',
                    details: validationResult.error.errors
                })
            }
            const updateUser = await User.findByIdAndUpdate(userId, updatedSchema);

            return res.status(201).json({
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