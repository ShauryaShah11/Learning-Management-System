import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';
import mongoose from 'mongoose';
import validator from 'validator';
import User from '../models/User.model.js';
import Tutor from '../models/Tutor.model.js';
import emailController from '../controllers/email.controller.js';
import { constants } from 'buffer';

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;

const userSchema = z.object({
  username: z.string().min(1).max(50),
  email: z.string().min(1, { message: 'This field has to be filled.' }).email(),
  password: z.string().min(8),
  firstName: z.string(),
  lastName: z.string(),
  age: z.coerce.number().int().gte(1).lte(150),
  role: z.enum(['tutor', 'student', 'admin']).optional(),
  contactNumber: z.string().refine(validator.isMobilePhone),
  verificationToken: z.string().optional(),
});

const tutorSchema = z.object({
  userId: z.instanceof(mongoose.Types.ObjectId),
  yearOfExperience: z.coerce.number().int().gte(0).lte(50),
  bio: z.string().min(1).max(100),
  expertise: z.string(),
  achievements: z.string(),
});

const authController = {
    login: async (req, res) => {
        try{
            const email = req.body.email;
            const password = req.body.password;
            const user = await User.findOne({email: email, isVerified: true});
            if(!user || !(await bcrypt.compare(password, user.password))){
                return res.status(401).json({
                    success: false,
                    error: 'email or password is incorrect'
                })
            }
            const token = jwt.sign(
                {
                    id: user._id,
                    role: user.role
                },
                secretKey,
                {
                    expiresIn: '1h'
                }
            );

            res.status(200).json({
                success: true,
                message: 'Login successful',
                token
            })

        }
        catch(error){
            console.error(error);
            return res.status(500).json({
                error: 'Internal server error'
            })
        }
    },

    registerUser: async (userData) => {
        try{
            const newUser = new User(userData);
            const savedUser = await newUser.save();
            return savedUser._id;
        }catch(error){
            return res.status(500).json({
                error: 'Error Registering User. please try again later'
            })
        }
    },

    userRegister: async (req, res) => {
        try{
            const {username, email, password, firstName, lastName, age, contactNumber} = req.body;
            const verificationToken = crypto.randomBytes(20).toString('hex');
            const user = new User({
                username,
                email,
                password,
                firstName, 
                lastName,
                age,
                contactNumber,
                verificationToken
            })
                const validationResult = userSchema.safeParse(user);
            if(!validationResult.success){
                return res.status(400).json({
                    error: 'Invalid user format',
                    details: validationResult.error.errors
                })
            }
            const userId = await authController.registerUser(user);
            
            if(!userId){
                return res.status(500).json({error: 'Error Registrating user'})
            }
            await emailController.sendVerificationEmail(email, username, verificationToken);
            return res.status(201).json({message: 'User is Successfully regsitered'});
        }
        catch(error){
            console.error(error);
            return res.status(500).json({
                error: 'Error Registrating user. Please Try again later'
            })
        }
    },

    tutorRegister: async (req, res) => {
        try{
            const {username, email, password, firstName, lastName, age, contactNumber, yearOfExperience, bio, expertise, achievements} = req.body;
            const verificationToken = crypto.randomBytes(20).toString('hex');

            const user = new User({
                username,
                email,
                password,
                firstName, 
                lastName,
                age,
                contactNumber,
                role: 'tutor',
                verificationToken
            })
            const validationResult = userSchema.safeParse(user);
            if(!validationResult.success){
                return res.status(400).json({
                    error: 'Invalid user format',
                    details: validationResult.error.errors
                })
            }
            const userId = await authController.registerUser(user);
            if(!userId){
                return res.status(500).json({error: 'Error Registrating user'})
            }
            const newTutor = new Tutor({
                userId: userId.toString(),
                yearOfExperience: parseInt(yearOfExperience),
                bio,
                expertise,
                achievements                
            })
            const validationTutorResult = tutorSchema.safeParse(newTutor);
            if(!validationTutorResult.success){
                return res.status(400).json({
                    error: 'Invalid tutor format',
                    details: validationTutorResult.error.errors
                })
            }
            await newTutor.save();
            await emailController.sendVerificationEmail(email, username, verificationToken);
            return res.status(201).json({message: 'Tutor is Successfully registered'});
        }
        catch(error){
            console.error(error);
            return res.status(500).json({error: 'Error Registrating user'})
        }
    },
}

export default authController;