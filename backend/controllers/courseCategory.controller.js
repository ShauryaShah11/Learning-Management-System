import express from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import CourseCategory from '../models/CourseCategory.model.js';
import Course from '../models/Course.model.js';
import { uploadFiles } from '../utils/uploadFiles.js';

const categorySchema = z.object({
    categoryName: z.string().min(6).max(50),
    description: z.string().min(10),
    coverImageUrl: z.string(),
});

const categoryIdSchema = z.string().refine((val) => {
    return mongoose.Types.ObjectId.isValid(val);
}, {
    message: 'Invalid categoryId format',
});

const validateCategoryId = (categoryId) => {
    const validationResult = categoryIdSchema.safeParse(categoryId);
    return validationResult.success ? null : {
        error: 'Invalid category id format',
        details: validationResult.error.errors,
    };
};

const courseCategoryController = {
    addCategory: async (req, res) => {
        try {
            const { categoryName, description } = req.body;
            const category = await CourseCategory.findOne({ categoryName: categoryName });
            if (category) {
                return res.status(400).json({
                    error: 'Category name aleady exists',
                });
            }
            const {file, body: {type}} = req;
            const uploadResult = await uploadFiles(file, type);
            const coverImageUrl = uploadResult.fileUrl;
            const courseCategory = new CourseCategory({
                categoryName,
                description,
                coverImageUrl,
            });

            const validationResult = categorySchema.safeParse(courseCategory);
            if (!validationResult.success) {
                return res.status(400).json({
                    error: 'Invalid category format',
                    details: validationResult.error.errors,
                });
            }

            await courseCategory.save();

            return res.status(201).json({
                message: 'Course Category is successfully added',
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                error: 'Internal server error',
            });
        }
    },

    updateCategory: async (req, res) => {
        try {
            const courseCategoryId = req.params.categoryId;
            const validationIdError = validateCategoryId(courseCategoryId);
            if (validationIdError) {
                console.log(validationIdError);
                return res.status(400).json(validationIdError);
            }
            let imageUrl;
            const {file, body: {type}} = req;
            if(file){
                const uploadResult = await uploadFiles(file, type);
                imageUrl = uploadResult.fileUrl;
            }
            
            const { categoryName, description } = req.body;
    
            const courseCategory = await CourseCategory.findById(courseCategoryId);
            const coverImageUrl = file === undefined ? courseCategory.coverImageUrl : imageUrl;
    
            if (!courseCategory) {
                return res.status(404).json({
                    error: 'Course category not found',
                });
            }
    
            const updatedCategory = {
                categoryName,
                description,
                coverImageUrl,
            };
    
            const validationResult = categorySchema.safeParse(updatedCategory);
            if (!validationResult.success) {
                console.log(validationResult.error.errors);
                return res.status(400).json({
                    error: 'Invalid category format',
                    details: validationResult.error.errors,
                });
            }
            
            await CourseCategory.findByIdAndUpdate(courseCategoryId, updatedCategory);
    
            return res.status(201).json({
                message: 'Course Category is successfully updated',
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                error: 'Internal server error',
            });
        }
    },

    removeCategory: async (req, res) => {
        try {
            const courseCategoryId = req.params.categoryId;
            const validationIdError = validateCategoryId(courseCategoryId);
            if (validationIdError) {
                return res.status(400).json(validationIdError);
            }

            const courseCategory = await CourseCategory.findById(courseCategoryId);
            if (!courseCategory) {
                return res.status(404).json({
                    error: 'Course category not found',
                });
            }
            await CourseCategory.findByIdAndUpdate(courseCategoryId, {isRemoved: true});
            return res.status(200).json({
                message: 'Course category is successfully removed',
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                error: 'Internal server error',
            });
        }
    },

    getCourseByCategoryId: async (req, res) => {
        try {
            const courseCategoryId = req.params.categoryId;
            const validationIdError = validateCategoryId(courseCategoryId);
            if (validationIdError) {
                return res.status(400).json(validationIdError);
            }

            const courseCategory = await CourseCategory.findById(courseCategoryId);
            if (!courseCategory) {
                return res.status(404).json({
                    error: 'Course category not found',
                });
            }

            const courseIds = courseCategory.courses;

            const courses = await Course.find({
               _id: { 
                  $in: courseIds 
                },
                published: true 
            });

            const courseCategoryWithCourses = {
                coverImageUrl: courseCategory.coverImageUrl,
                courseCount: courseCategory.courseCount,
                categoryName: courseCategory.categoryName,
                courses: courses,
            };

            return res.status(200).json(courseCategoryWithCourses);
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                error: 'Internal server error',
            });
        }
    },

    getCategories: async (req, res) => {
        try {
            const categories = await CourseCategory.find({});
            return res.status(200).json(categories);
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                error: 'Internal server error',
            });
        }
    },

    getCategoryById: async (req, res) => {
        try {
            const categoryId = req.params.categoryId;
            const validationIdError = validateCategoryId(categoryId);
            if (validationIdError) {
                return res.status(400).json(validationIdError);
            }

            const categoryData = await CourseCategory.findById(categoryId);

            return res.status(200).json(categoryData);
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                error: 'Internal server error',
            });
        }
    },
};

export default courseCategoryController;
