import request from "supertest";
import app from "../../index.js"; // your express app
import { generateToken } from "../../utils"; // function to generate a token for a test user

describe("Question Routes - Edge Cases", () => {
    let userToken;
    let courseId;
    let questionId;

    beforeAll(async () => {
        // setup: create a user and generate a token for them
        userToken = generateToken({ id: "user", role: "user" });

        // setup: create a course and get its id
        // replace this with your actual implementation
        courseId = await createCourse({ title: "Test Course", userId: "user" });
    });

    it("should not add a question if no content is provided", async () => {
        const response = await request(app)
            .post(`/add/${courseId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({ content: "" });
        expect(response.status).toBe(400);
    });

    it("should not update a question if it does not exist", async () => {
        const nonExistentQuestionId = "nonexistentid";
        const response = await request(app)
            .put(`/update/${nonExistentQuestionId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({ content: "Updated content" });
        expect(response.status).toBe(404);
    });

    it("should not remove a question if it does not exist", async () => {
        const nonExistentQuestionId = "nonexistentid";
        const response = await request(app)
            .delete(`/remove/${nonExistentQuestionId}`)
            .set("Authorization", `Bearer ${userToken}`);
        expect(response.status).toBe(404);
    });

    it("should not get questions if course does not exist", async () => {
        const nonExistentCourseId = "nonexistentid";
        const response = await request(app).get(`/${nonExistentCourseId}`);
        expect(response.status).toBe(404);
    });
});
