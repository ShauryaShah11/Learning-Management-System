import { z } from 'zod';
import mongoose from 'mongoose';
import CourseMaterial from '../models/CourseMaterial.model.js';
import Section from '../models/Section.model.js';
import Course from '../models/Course.model.js';

const subSectionSchema = z.object({
    title: z.string().min(1),
    type: z.string(),
    url: z.string(),
    duration: z.number().optional().transform(value => value ?? 0),
    order: z.number().default(0),
    completedByStudents: z.array(z.string()).optional(), // Assuming it's an array of user IDs
});

const IdSchema = z.string().refine((val) => {
    return mongoose.Types.ObjectId.isValid(val);
}, {
    message: 'Invalid Id format',
});

const validateId = (Id) => {
    const validationResult = IdSchema.safeParse(Id);
    return validationResult.success ? null : {
        error: 'Invalid id format',
        details: validationResult.error.errors,
    };
};

const courseMaterialController = {
    addSection: async (req, res) => {
        try {
            const courseId = req.params.courseId;
            const { title, subsections} = req.body;
            const validationIdError = validateId(courseId);
            if (validationIdError) {
                return res.status(400).json(validationIdError);
            }
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({
                    error: 'Course not found',
                });
            }
            subsections.url = req.fileUrl;
            subsections.duration = req.duration;
            const validationSubsections = subSectionSchema.safeParse(subsections);
            if (!validationSubsections.success) {
              return res.status(400).json({
                error: 'Invalid subsections format',
                details: validationSubsections.error.errors,
              });
            }
            const section = new Section({
              title,
              subsections,
            });
            const savedSection = await section.save();

            // Find or create CourseMaterial for the course
            const courseMaterial = await CourseMaterial.findOne({ course: courseId });

            if (!courseMaterial) {
              const newCourseMaterial = new CourseMaterial({ course: courseId, sections: [savedSection._id] });
              await newCourseMaterial.save();
            } else {
              // Update existing CourseMaterial with the new section
              await CourseMaterial.findByIdAndUpdate(courseMaterial._id, {
                $push: { sections: savedSection._id },
              });
            }
            course.duration += subsections.duration;
            course.numberOfMaterials += 1;
            await Course.save();

            return res.status(201).json({
                message: 'Section created and added to the course successfully',
                section,
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                error: 'Internal Server Error',
            });
        }
    },

    removeSection: async (req, res) => {
        try {
            const sectionId = req.params.sectionId;
            const validationIdError = validateId(sectionId);
            if (validationIdError) {
                return res.status(400).json(validationIdError);
            }
            await Section.findByIdAndDelete(sectionId, { new: true });
            await CourseMaterial.findOneAndUpdate(
                { sections: sectionId }, // Condition to match the section to be removed
                { $pull: { sections: sectionId } }, // Update operation to remove the section
                { new: true }
            );
            return res.status(201).json({ message: 'Section deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }, 

    updateSection: async (req, res) => {
        try {
            const sectionId = req.params.sectionId;
            const validationIdError = validateId(sectionId);
            if (validationIdError) {
                return res.status(400).json(validationIdError);
            }
            const title = req.body.title;

            const section = await Section.findById(sectionId);
            if (!section) {
                return res.status(404).json({
                    error: 'section not found'
                });
            }
            await Section.findByIdAndUpdate({ title: title });

            return res.status(201).json({
                message: 'section is succesfully updated'
            })
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    addSubSection: async (req, res) => {
        try{
            const sectionId = req.params.sectionId;
            const subsection = req.body.subsection;
            subsection.url = req.fileUrl;
            subsection.duration = req.duration;

            const section = await Section.findById(sectionId);
            if(!section) {
                return res.status(404).json({
                    error: 'Section not found'
                })
            }
            await Section.findByIdAndUpdate(sectionId,{
                $push: {
                    subsections: subsection
                }
            }, { new: true })

            return res.status(201).json({
                message: 'Subsection succesfully added'
            })
        }
        catch(error){
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    updateSubSection: async (req, res) => {
        try {
            const sectionId = req.body.sectionId;
            const subSectionId = req.params.subSectionId;

            const validationSectionIdError = validateId(sectionId);
            const validationSubSectionIdError = validateId(subSectionId);
            if (validationSectionIdError || validationSubSectionIdError) {
                return res.status(400).json(validationSectionIdError || validationSubSectionIdError);
            }

            const section = await Section.findById(sectionId);

            if (!section) {
                return res.status(404).json({ error: 'Section not found' });
            }

            const subSectionIndex = section.subsections.findIndex(subSection => subSection._id == subSectionId);

            if (subSectionIndex === -1) {
                return res.status(404).json({ error: 'Subsection not found' });
            }
            const updatedSubsectionData = req.body.subsections;

            section.subsections[subSectionIndex].title = updatedSubsectionData.title;
            section.subsections[subSectionIndex].type = updatedSubsectionData.type;
            section.subsections[subSectionIndex].url = updatedSubsectionData.url;
            section.subsections[subSectionIndex].duration = updatedSubsectionData.duration;


            await section.save();
            return res.status(200).json({ 
                    message: 'Subsection updated successfully' 
                }
            );
        } 
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    removeSubSection: async (req, res) => {
        try {
            const sectionId = req.body.sectionId;
            const validationIdError = validateId(sectionId);
            if (validationIdError) {
                return res.status(400).json(validationIdError);
            }
            const subSectionId = req.params.subSectionId;

            const section = await Section.findById(sectionId);

            if (!section) {
                return res.status(404).json({ error: 'Section not found' });
            }
            // Find the index of the subsection in the subsections array
            const subSectionIndex = section.subsections.findIndex(subSection => subSection._id == subSectionId);
            // Check if the subsection exists
            if (subSectionIndex === -1) {
                return res.status(404).json({ error: 'Subsection not found' });
            }
            // Remove the subsection from the array
            section.subsections.splice(subSectionIndex, 1);

            await section.save();

            return res.status(200).json({ message: 'Subsection deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },    
};

export default courseMaterialController;
