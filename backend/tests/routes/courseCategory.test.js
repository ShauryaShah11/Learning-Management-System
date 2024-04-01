// courseCategory.test.js
import request from "supertest";
import app from "../../index.js"; // your express app
import { generateToken } from "../../utils"; // function to generate a token for a test user

describe("Course Category Routes", () => {
    let token;
    let categoryId;

    beforeAll(async () => {


        // setup: create a category and get its id
        const response = await request(app)
            .post("/add")
            .set("Authorization", `Bearer ${token}`)
            .field("name", "Test Category")
            .attach("file", "path/to/test/file.jpg");
        categoryId = response.body.id;
    });

    it("should not allow non-admin to add category", async () => {
        const response = await request(app)
            .post("/add")
            .set("Authorization", `Bearer ${token}`)
            .field("name", "Test Category")
            .attach("file", "path/to/test/file.jpg");
        expect(response.status).toBe(403);
    });

    it("should not allow non-admin to update category", async () => {
        const response = await request(app)
            .put(`/${categoryId}`)
            .set("Authorization", `Bearer ${token}`)
            .field("name", "Updated Category")
            .attach("file", "path/to/test/file.jpg");
        expect(response.status).toBe(403);
    });

    it("should not allow non-admin to delete category", async () => {
        const response = await request(app)
            .delete(`/${categoryId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(403);
    });

    it("should return 404 for non-existent category", async () => {
        const response = await request(app).get("/getCourses/nonexistentid");
        expect(response.status).toBe(404);
    });

    it("should return 404 for non-existent category", async () => {
        const response = await request(app).get("/nonexistentid");
        expect(response.status).toBe(404);
    });
});
