import request from "supertest";
import app from "../../index.js"; // your express app
import { generateToken } from "../../utils"; // function to generate a token for a test user

describe("Review Routes", () => {
    let userToken;
    let courseId;
    let reviewId;

    beforeAll(async () => {
        // setup: create a user and generate a token for them
        userToken = generateToken({ id: "user", role: "user" });

        // setup: create a course and get its id
        // replace this with your actual implementation
        courseId = await createCourse({ title: "Test Course", userId: "user" });
    });

    it("should add a review", async () => {
        const response = await request(app)
            .post(`/add/${courseId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({ content: "Great course!", rating: 5 });
        expect(response.status).toBe(200);
        reviewId = response.body.reviewId;
    });

    it("should update a review", async () => {
        const response = await request(app)
            .put(`/update/${reviewId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({ content: "Excellent course!", rating: 5 });
        expect(response.status).toBe(200);
    });

    it("should delete a review", async () => {
        const response = await request(app)
            .delete(`/delete/${reviewId}`)
            .set("Authorization", `Bearer ${userToken}`);
        expect(response.status).toBe(200);
    });

    it("should get reviews for a course", async () => {
        const response = await request(app).get(`/${courseId}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([]));
    });
});
