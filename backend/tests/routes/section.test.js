import request from "supertest";
import app from "../../index.js"; // your express app
import { generateToken } from "../../utils"; // function to generate a token for a test user

describe("Section Routes", () => {
    let userToken;
    let courseId;
    let sectionId;
    let subsectionId;

    beforeAll(async () => {
        // setup: create a user and generate a token for them
        userToken = await generateToken({ id: "user", role: "user" });

        // setup: create a course, section, and subsection and get their ids
        // replace these with your actual implementation
        courseId = await createCourse({ title: "Test Course", userId: "user" });
        sectionId = await createSection({ title: "Test Section", courseId });
        subsectionId = await createSubsection({
            title: "Test Subsection",
            sectionId,
        });
    });

    it("should add a section to a course", async () => {
        const response = await request(app)
            .post(`/add/${courseId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .field("name", "Test Section")
            .attach("file", "path/to/test/file.jpg");
        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Test Section");
    });

    it("should update a section", async () => {
        const response = await request(app)
            .put(`/update/${sectionId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .field("name", "Updated Section")
            .attach("file", "path/to/test/file.jpg");
        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Updated Section");
    });

    it("should delete a section", async () => {
        const response = await request(app)
            .delete(`/remove/${courseId}`)
            .set("Authorization", `Bearer ${userToken}`);
        expect(response.status).toBe(200);
    });

    it("should add a subsection to a section", async () => {
        const response = await request(app)
            .post(`/subsection/add/${sectionId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .field("name", "Test Subsection")
            .attach("file", "path/to/test/file.jpg");
        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Test Subsection");
    });

    it("should update a subsection", async () => {
        const response = await request(app)
            .put(`/subsection/update/${subsectionId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .field("name", "Updated Subsection")
            .attach("file", "path/to/test/file.jpg");
        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Updated Subsection");
    });

    it("should delete a subsection", async () => {
        const response = await request(app)
            .delete(`/subsection/remove/${courseId}`)
            .set("Authorization", `Bearer ${userToken}`);
        expect(response.status).toBe(200);
    });

    it("should get a section by id", async () => {
        const response = await request(app).get(`/${sectionId}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(sectionId);
    });

    it("should get a subsection by id", async () => {
        const response = await request(app).get(`/subsection/${subsectionId}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(subsectionId);
    });

    it("should get all subsections of a section", async () => {
        const response = await request(app).get(`/${sectionId}/subsections`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });
});
