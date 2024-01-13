import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from "crypto";
import path  from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.model.js';
import Tutor from '../models/Tutor.model.js';
import emailController from "./email.controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({path: path.join(__dirname,'..', 'config', '.env')});

const secretKey = process.env.JWT_SECRET_KEY;

const authController = {
    login: async (req, res) => {
        try{
            const email = req.body.email;
            const password = req.body.password;
            const user = await User.findOne({email: email, isVerified: true});
            if(!user || !(await bcrypt.compare(password, user.password))){
                return res.status(401).json({
                    error: 'email or password is incorrect'
                })
            }
            const token = jwt.sign(
                {
                    username: user.username,
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
                verificationToken
            })
            const userId = await authController.registerUser(user);
            if(!userId){
                return res.status(500).json({error: 'Error Registrating user'})
            }
            const newTutor = new Tutor({
                userId: userId,
                yearOfExperience,
                bio,
                expertise,
                achievements                
            })
            const tutor = await newTutor.save();
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