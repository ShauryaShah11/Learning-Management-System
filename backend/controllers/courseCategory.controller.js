import express from 'express';
import CourseCategory from '../models/CourseCategory.model.js';

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
