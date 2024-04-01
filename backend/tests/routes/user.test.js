import request from "supertest";
import app from "../../index.js"; // your express app
import { generateToken } from "../../utils"; // function to generate a token for a test user

describe("User Routes - Edge Cases", () => {
    let userToken;
    let adminToken;
    let userId;

    beforeAll(async () => {
        // setup: create a user and generate a token for them
        userToken = generateToken({ id: "user", role: "user" });

        // setup: create an admin and generate a token for them
        adminToken = generateToken({ id: "admin", role: "admin" });

        // setup: create a user and get its id
        // replace this with your actual implementation
        userId = await createUser({
            name: "Test User",
            email: "test@example.com",
            password: "password",
        });
    });

    it("should not get users if not admin", async () => {
        const response = await request(app)
            .get("/")
            .set("Authorization", `Bearer ${userToken}`);
        expect(response.status).toBe(403);
    });

    it("should not get a user if user does not exist", async () => {
        const nonExistentUserId = "nonexistentid";
        const response = await request(app).get(`/${nonExistentUserId}`);
        expect(response.status).toBe(404);
    });

    it("should not remove a user if not admin", async () => {
        const response = await request(app)
            .delete(`/${userId}`)
            .set("Authorization", `Bearer ${userToken}`);
        expect(response.status).toBe(403);
    });

    it("should not update a user if not admin", async () => {
        const response = await request(app)
            .put(`/${userId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({ name: "Updated User" });
        expect(response.status).toBe(403);
    });

    it("should not update a user if user does not exist", async () => {
        const nonExistentUserId = "nonexistentid";
        const response = await request(app)
            .put(`/${nonExistentUserId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ name: "Updated User" });
        expect(response.status).toBe(404);
    });

    it("should not update a user if no data is provided", async () => {
        const response = await request(app)
            .put(`/${userId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({});
        expect(response.status).toBe(400);
    });
});
