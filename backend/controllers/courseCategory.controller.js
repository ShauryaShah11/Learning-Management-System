import express from 'express';
import { z } from 'zod';
import CourseCategory from '../models/CourseCategory.model.js';
import Course from '../models/Course.model.js';

const categorySchema = z.object({
    categoryName: z.string().min(6).max(50),
    description: z.string().min(10),
    accessRestrictions: z.coerce.number()
                            .int()
                            .gte(1)
                            .lte(50),
    coverImageUrl: z.string()
})
const categoryIdSchema = z.string().uuid();

const courseCategoryController = {
    addCategory: async (req, res) => {
        try{
            const {categoryName, description, accessRestrictions} = req.body;
            const coverImageUrl = req.imagePath;

            const courseCategory = new CourseCategory({
                categoryName,
                description,
                accessRestrictions,
                coverImageUrl,
            })

            const validationResult = categorySchema.safeParse(courseCategory);
            if(!validationResult.success){
                return res.status(400).json({
                    error: 'Invalid course categry format',
                    details: validationResult.error.errors
                })
            }

            await courseCategory.save();

            return res.status(201).json({
                message: 'Course Category is successfully added'
            })
        }
        catch(err){
            console.error(err);
            return res.status(500).json({
                error: 'Internal server error'
            });
        }
    },

    updateCategory: async (req, res) => {
        try{
            const courseCategoryId = req.params.courseCategoryId;

            const {categoryName, description, accessRestrictions} = req.body;
            const coverImageUrl = req.imagePath;

            const updatedCategory = new CourseCategory({
                categoryName,
                description,
                accessRestrictions,
                coverImageUrl,
            })
            const validationResult = categorySchema.safeParse(updatedCategory);
            if(!validationResult.success){
                return res.status(400).json({
                    error: 'Invalid course categry format',
                    details: validationResult.error.errors
                })
            }
            const courseCategory = await CourseCategory.findByIdAndUpdate(courseCategoryId, updatedCategory);

            if(!courseCategory){
                return res.status(404).json({
                    error: 'Course category not found'
                })
            }
            return res.status(201).json({
                message: 'Course Category is succesfully updated'
            })
        }
        catch(err){
            console.error(err);
            return res.status(500).json({
                error: 'Internal server error'
            });
        }
    },

    removeCategory: async(req, res) => {
        try{
            const courseCategoryId = req.params.courseCategoryId;
            const validationResult = categoryIdSchema.safeParse(courseCategoryId);
            if(!validationResult.success){
                return res.status(400).json({
                    error: 'Invalid category id format',
                    details: validationResult.error.errors
                })
            }

            const courseCategory = await CourseCategory.findByIdAndDelete(courseCategoryId);
            if(!courseCategory){
                return res.status(404).json({
                    error: 'Course category not found'
                });
            }
            return res.status(200).json({
                message: 'Course is succesfully removed'
            })
        }
        catch(err){
            console.error(err);
            return res.status(500).json({
                error: 'Internal server error'
            });
        }
    },

    getCourseByCategoryId : async (eq,res) => {
        try{
            const courseCategoryId = req.params.courseCategoryId;
            const validationResult = categoryIdSchema.safeParse(courseCategoryId);
            if(!validationResult.success){
                return res.status(400).json({
                    error: 'Invalid category id format',
                    details: validationResult.error.errors
                })
            }
            const courseCategory = await CourseCategory.findById(courseCategoryId);
            if(!courseCategory){
                return res.status(404).json({
                    error: 'Course category not found'
                });
            }
            
            const courseIds = courseCategory.courses;

            const courses = await Course.find({ __id: { $in: courseIds }});
            
            const courseCategoryWithCourses = {
                coverImageUrl: courseCategory.coverImageUrl,
                courseCount: courseCategory.courseCount,
                courses: courses
            }
            return res.status(200).json(courseCategoryWithCourses);
        }
        catch(err){
            console.error(err);
            return res.status(500).json({
                error: 'Internal server error'
            });
        }
    }
};

export default courseCategoryController;
