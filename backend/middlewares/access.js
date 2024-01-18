import Course from "../models/Course.model.js";
import CourseMaterial from "../models/CourseMaterial.model.js";
import Section from "../models/Section.model.js";

const validateSectionOwnership = async (req, res, next) => {
    try {
        const sectionId = req.params.sectionId;
        const userId = req.user.__id;

        // Find the section
        const section = await Section.findById(sectionId);
        if (!section) {
            return res.status(404).json({ error: 'Section not found' });
        }

        // Find the associated course material
        const courseMaterial = await CourseMaterial.findOne({ sections: sectionId });
        if (!courseMaterial) {
            return res.status(404).json({ error: 'Course material not found' });
        }

        // Find the associated course
        const course = await Course.findOne({ courseMaterials: courseMaterial._id });

        // Check user permissions
        if (userId !== course.tutor && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized access' });
        }

        // Attach the section and course information to the request for later use
        req.section = section;
        req.courseMaterial = courseMaterial;
        req.course = course;

        // Continue to the next middleware or route handler
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default validateSectionOwnership;
