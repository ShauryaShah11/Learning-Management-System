import Tutor from "../models/Tutor.model.js";
import { z } from "zod";
import User from "../models/User.model.js";
import validator from "validator";

const tutorSchema = z.object({
    yearOfExperience: z.number(),
    bio: z.string().max(50),
    expertise: z.string().max(200),
});

const userSchema = z.object({
    firstName: z.string().max(50),
    lastName: z.string().max(50),
    username: z.string().max(50),
    email: z
        .string()
        .min(1, { message: "This field has to be filled." })
        .email(),
    contactNumber: z.string().refine(validator.isMobilePhone),
    age: z.coerce.number().int().gte(1).lte(150),
});

const tutorController = {
    getTutor: async (req, res) => {
        try {
            const tutor = await Tutor.find().populate("userId");
            if (!tutor) {
                return res.status(404).json({
                    error: "tutor not found",
                });
            }
            return res.status(200).json(tutor);
        } catch (error) {
            return res.status(500).json({
                error: "Internal server error",
            });
        }
    },

    getTutorById: async (req, res) => {
        try {
            const tutorId = req.params.tutorId;
            const tutor = await Tutor.findById(tutorId).populate("userId");
            if (!tutor) {
                return res.status(404).json({
                    error: "tutor not found",
                });
            }
            return res.status(200).json(tutor);
        } catch (error) {
            return res.status(500).json({
                error: "Internal server error",
            });
        }
    },

    updateTutor: async (req, res) => {
        try {
            const tutorId = req.params.tutorId;
            const {
                firstName,
                lastName,
                username,
                email,
                contactNumber,
                age,
                yearOfExperience,
                bio,
                expertise,
            } = req.body;
            const updatedTutorSchema = {
                yearOfExperience,
                bio,
                expertise,
            };
            const validateTutorSchema =
                tutorSchema.safeParse(updatedTutorSchema);
            if (!validateTutorSchema.success) {
                return res.status(400).json({
                    error: "Invalid user format",
                    details: validateTutorSchema.error.errors,
                });
            }
            const updatedUserSchema = {
                firstName,
                lastName,
                username,
                email,
                contactNumber,
                age,
            };
            const validateUserSchema = userSchema.safeParse(updatedUserSchema);
            if (!validateUserSchema.success) {
                return res.status(400).json({
                    error: "Invalid user format",
                    details: validateUserSchema.error.errors,
                });
            }
            const tutor = await Tutor.findByIdAndUpdate(
                tutorId,
                updatedTutorSchema,
                { new: true }
            );
            const user = await User.findByIdAndUpdate(
                tutor.userId,
                updatedUserSchema,
                { new: true }
            );

            return res.status(200).json({
                message: "Tutor updated successfully",
            });
        } catch (error) {
            return res.status(500).json({
                error: "Internal server error",
            });
        }
    },

    removeTutor : async (req, res) => {
        try{
            const tutorId = req.params.tutorId;
            const tutor = await Tutor.findById(tutorId);
            if(!tutor){
                return res.status(404).json({
                    error: "Tutor not found",
                });
            }
            await User.findByIdAndUpdate(tutor.userId, {isRemoved: true});
            return res.status(200).json({
                message: "Tutor removed successfully",
            });
        }
        catch(error){
            console.log(error);
            return res.status(500).json({
                error: "Internal server error",
            });
        }
    }
};

export default tutorController;
