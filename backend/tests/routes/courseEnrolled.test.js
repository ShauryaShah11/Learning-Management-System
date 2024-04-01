import request from "supertest";
import app from "../../index.js"; // your express app
import { generateToken } from "../../utils"; // function to generate a token for a test user

describe("Course Enrolled Routes", () => {
    let userToken;
    let anotherUserToken;
    let courseId;

    beforeAll(async () => {
        // setup: create a user and generate a token for them
        userToken = await generateToken({ id: "user", role: "user" });
        anotherUserToken = await generateToken({
            id: "anotherUser",
            role: "user",
        });

        // setup: create a course and get its id
        // replace this with your actual implementation
        courseId = await createCourse({ title: "Test Course", userId: "user" });
    });

    it("should enroll a user in a course", async () => {
        const response = await request(app)
            .post(`/${courseId}`)
            .set("Authorization", `Bearer ${userToken}`);
        expect(response.status).toBe(200);
    });

    it("should get enrolled users of a course", async () => {
        const response = await request(app).get(`/user/${courseId}`);
        expect(response.status).toBe(200);
        expect(response.body).toContainEqual({ userId: "user" });
    });

    it("should unenroll a user from a course", async () => {
        const response = await request(app)
            .put(`/unenroll/${courseId}`)
            .set("Authorization", `Bearer ${userToken}`);
        expect(response.status).toBe(200);
    });

    it("should get courses of the authenticated user", async () => {
        const response = await request(app)
            .get("/mycourses")
            .set("Authorization", `Bearer ${userToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toContainEqual({ courseId });
    });

    it("should not get courses of another user", async () => {
        const response = await request(app)
            .get(`/usercourses/anotherUser`)
            .set("Authorization", `Bearer ${userToken}`);
        expect(response.status).toBe(403);
    });
});
