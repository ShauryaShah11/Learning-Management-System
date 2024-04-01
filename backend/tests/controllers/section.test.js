import courseMaterialController from '../../controllers/courseMaterial.controller.js';

describe('courseMaterialController', () => {
    describe('addSection', () => {
        it('should return 400 for empty section title', async () => {
            const req = { params: { courseId: 'validCourseId' }, body: { title: '' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            await courseMaterialController.addSection(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid section title' });
        });
    
        it('should return 400 for missing section title', async () => {
            const req = { params: { courseId: 'validCourseId' }, body: {} };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            await courseMaterialController.addSection(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Missing section title' });
        });
    
        it('should return 400 for invalid courseId', async () => {
            const req = { params: { courseId: 'invalidCourseId' }, body: { title: 'Test' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            await courseMaterialController.addSection(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid courseId' });
        });
    
        it('should return 404 for non-existing courseId', async () => {
            const req = { params: { courseId: 'nonExistingCourseId' }, body: { title: 'Test' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            Course.findById.mockResolvedValue(null);
    
            await courseMaterialController.addSection(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Course not found' });
        });
    });

    describe('getSection', () => {
        it('should return 400 for invalid courseId', async () => {
            const req = { params: { courseId: 'invalidCourseId' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            await courseMaterialController.getSection(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid courseId' });
        });
    
        it('should return 404 for non-existing courseId', async () => {
            const req = { params: { courseId: 'nonExistingCourseId' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            Course.findById.mockResolvedValue(null);
    
            await courseMaterialController.getSection(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Course not found' });
        });
    
        it('should return 404 if course has no sections', async () => {
            const req = { params: { courseId: 'validCourseIdWithNoSections' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            Course.findById.mockResolvedValue({ sections: [] });
    
            await courseMaterialController.getSection(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'No sections found for this course' });
        });
    });

    describe('getSubSection', () => {
        it('should return 400 for invalid subsectionId', async () => {
            const req = { params: { subsectionId: 'invalidSubsectionId' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            await courseMaterialController.getSubsection(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid subsectionId' });
        });
    
        it('should return 404 for non-existing subsectionId', async () => {
            const req = { params: { subsectionId: 'nonExistingSubsectionId' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            Subsection.findById.mockResolvedValue(null);
    
            await courseMaterialController.getSubsection(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Subsection not found' });
        });
    });

    describe('getSectionById', () => {
        it('should return 400 for invalid sectionId', async () => {
            const req = { params: { sectionId: 'invalidSectionId' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            await courseMaterialController.getSectionById(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid sectionId' });
        });
    
        it('should return 404 for non-existing sectionId', async () => {
            const req = { params: { sectionId: 'nonExistingSectionId' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            Section.findById.mockResolvedValue(null);
    
            await courseMaterialController.getSectionById(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Section not found' });
        });
    });
    
    describe('getSubSectionById', () => {
        it('should return 400 for invalid subsectionId', async () => {
            const req = { params: { subsectionId: 'invalidSubsectionId' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            await courseMaterialController.getSubSectionById(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid subsectionId' });
        });
    
        it('should return 404 for non-existing subsectionId', async () => {
            const req = { params: { subsectionId: 'nonExistingSubsectionId' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            Subsection.findById.mockResolvedValue(null);
    
            await courseMaterialController.getSubSectionById(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Subsection not found' });
        });
    });
    
    describe('addSubSection', () => {
        it('should return 400 for empty subsection title', async () => {
            const req = { params: { sectionId: 'validSectionId' }, body: { title: '' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            await courseMaterialController.addSubSection(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid subsection title' });
        });
    
        it('should return 400 for invalid sectionId', async () => {
            const req = { params: { sectionId: 'invalidSectionId' }, body: { title: 'Test' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            await courseMaterialController.addSubSection(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid sectionId' });
        });
    
        it('should return 404 for non-existing sectionId', async () => {
            const req = { params: { sectionId: 'nonExistingSectionId' }, body: { title: 'Test' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            Section.findById.mockResolvedValue(null);
    
            await courseMaterialController.addSubSection(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Section not found' });
        });
    });

    describe('removeSection', () => {
        it('should return 400 for invalid sectionId', async () => {
            const req = { params: { sectionId: 'invalidSectionId' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            await courseMaterialController.removeSection(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid sectionId' });
        });
    
        it('should return 404 for non-existing sectionId', async () => {
            const req = { params: { sectionId: 'nonExistingSectionId' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            Section.findById.mockResolvedValue(null);
    
            await courseMaterialController.removeSection(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Section not found' });
        });
    });
    
    describe('updateSection', () => {
        it('should return 400 for invalid sectionId', async () => {
            const req = { params: { sectionId: 'invalidSectionId' }, body: { title: 'Test' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            await courseMaterialController.updateSection(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid sectionId' });
        });
    
        it('should return 404 for non-existing sectionId', async () => {
            const req = { params: { sectionId: 'nonExistingSectionId' }, body: { title: 'Test' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            Section.findById.mockResolvedValue(null);
    
            await courseMaterialController.updateSection(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Section not found' });
        });
    });
    
    describe('updateSubSection', () => {
        it('should return 400 for invalid subsectionId', async () => {
            const req = { params: { subsectionId: 'invalidSubsectionId' }, body: { title: 'Test' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            await courseMaterialController.updateSubSection(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid subsectionId' });
        });
    
        it('should return 404 for non-existing subsectionId', async () => {
            const req = { params: { subsectionId: 'nonExistingSubsectionId' }, body: { title: 'Test' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            Subsection.findById.mockResolvedValue(null);
    
            await courseMaterialController.updateSubSection(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Subsection not found' });
        });
    });
    
    describe('removeSubSection', () => {
        it('should return 400 for invalid subsectionId', async () => {
            const req = { params: { subsectionId: 'invalidSubsectionId' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            await courseMaterialController.removeSubSection(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid subsectionId' });
        });
    
        it('should return 404 for non-existing subsectionId', async () => {
            const req = { params: { subsectionId: 'nonExistingSubsectionId' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            Subsection.findById.mockResolvedValue(null);
    
            await courseMaterialController.removeSubSection(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Subsection not found' });
        });
    });
});
