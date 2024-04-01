// tutor.test.js
import request from "supertest";
import app from "../../index.js"; // your express app
import { generateToken } from "../../utils"; // function to generate a token for a test user

describe("Tutor Routes - Edge Cases", () => {
    let userToken;
    let tutorId;

    beforeAll(async () => {
        // setup: create a user and generate a token for them
        userToken = generateToken({ id: "user", role: "user" });

        // setup: create a tutor and get its id
        // replace this with your actual implementation
        tutorId = await createTutor({ name: "Test Tutor", userId: "user" });
    });

    it("should not get a tutor if tutor does not exist", async () => {
        const nonExistentTutorId = "nonexistentid";
        const response = await request(app).get(`/${nonExistentTutorId}`);
        expect(response.status).toBe(404);
    });

    it("should not update a tutor if tutor does not exist", async () => {
        const nonExistentTutorId = "nonexistentid";
        const response = await request(app)
            .put(`/${nonExistentTutorId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({ name: "Updated Tutor" });
        expect(response.status).toBe(404);
    });

    it("should not update a tutor if no data is provided", async () => {
        const response = await request(app)
            .put(`/${tutorId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({});
        expect(response.status).toBe(400);
    });
});
