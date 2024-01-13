import { zod } from "zod";
import CourseMaterial from "../models/CourseMaterial.model.js";
import Section from "../models/Section.model.js";
import Course from "../models/Course.model.js";

const subSectionSchema = z.object({
  title: z.string().required(),
  type: z.string().required(),
  url: z.string().required(),
  fileSize: z.number().optional(),
  duration: z.number().optional(),
  order: z.number().default(0),
  completedByStudents: z.array(z.string()), // Assuming it's an array of user IDs
});

const courseMaterialController = {
  addSection: async (req, res) => {
    try {
      const courseId = req.params.courseId;
      const { title, subsections } = req.body;

      // Create a new section
      const section = new Section({
        title,
        subsections,
      });

      // Find the corresponding course
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          error: "Course not found",
        });
      }

      // Find or create CourseMaterial for the course
      let courseMaterial = await CourseMaterial.findOne({ course: courseId });

      if (!courseMaterial) {
        courseMaterial = new CourseMaterial({
          course: courseId,
          subsections: [section._id], // Assuming subsections is an array of references in CourseMaterial
        });
      } else {
        courseMaterial.sections.push(section._id);
      }

      // Associate the section with the course and course material
      await courseMaterial.save();
      await section.save();

      return res.status(201).json({
        message: "Section created and added to the course successfully",
        section,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
  },

  removeSection: async (req, res) => {
    try {
        const sectionId = req.params.sectionId;

        await Section.findByIdAndDelete(sectionId);

        return res.status(201).json({ message: 'Section deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  updateSection: async(req, res) => {
    try{
      const sectionId = req.params.sectionId;
      const title = req.body.title;

      const section = await Section.findById(sectionId);
      if(!section){
        return res.status(404).json({
          error: 'section not found'
        });
      }

      await Section.findByIdAndUpdate({title: title});

      return res.status(201).json({
        message : 'section is succesfully updated'
      })
    }
    catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  removeSubSection: async(req, res) => {
    try {
      const sectionId = req.body.sectionId;
      const subSectionId = req.params.subSectionId;

      // Find the section
      const section = await Section.findById(sectionId);

      // Check if the section exists
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

  updateSubSection: async (req, res) => {
    try {
        const sectionId = req.body.sectionId;
        const subSectionId = req.params.subSectionId;
        const subsections = req.body.subsections;
        // Find the section
        const section = await Section.findById(sectionId);

        // Check if the section exists
        if (!section) {
            return res.status(404).json({ error: 'Section not found' });
        }

        // Find the index of the subsection in the subsections array
        const subSectionIndex = section.subsections.findIndex(subSection => subSection._id == subSectionId);

        // Check if the subsection exists
        if (subSectionIndex === -1) {
            return res.status(404).json({ error: 'Subsection not found' });
        }

        // Replace the old subsection with the updated one
        section.subsections.splice(subSectionIndex, 1, subsections);

        // Save the updated section
        await section.save();

        return res.status(200).json({ message: 'Subsection updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getSectionById: async (req, res) => {
    try{
      const courseId = req.params.courseId;
      const course = await Course.findById(courseId);
      if(!course){
        return res.status(404).json({ error: 'Course not found'});
      }
      
    }
    catch(error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export default courseMaterialController;
