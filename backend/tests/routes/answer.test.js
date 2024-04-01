import request from "supertest"
import server from "../../index.js";

describe("Answer Routes", () => {
    let token;

    beforeAll((done) => {
        request(server)
            .post("/api/auth/login") // replace with your actual login route
            .send({
                username: "actualTestUsername", // replace with actual test user username
                password: "actualTestPassword", // replace with actual test user password
            })
            .end((err, response) => {
                token = response.body.token; // save the token!
                done();
            });
    });

    describe("POST /api/answers/add/:questionId", () => {
        it("it should add an answer", async () => {
            const res = await request(server)
                .post("/api/answers/add/actualQuestionId") // replace with actual questionId
                .set("Authorization", `Bearer ${token}`)
                .send({ answer: "Test answer" });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("answer");
        });
    });

    describe("PUT /api/answers/update/:answerId", () => {
        it("it should update an answer", async () => {
            const res = await request(server)
                .put("/api/answers/update/actualAnswerId") // replace with actual answerId
                .set("Authorization", `Bearer ${token}`)
                .send({ answer: "Updated test answer" });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("answer");
        });
    });

    describe("DELETE /api/answers/delete/:answerId", () => {
        it("it should delete an answer", async () => {
            const res = await request(server)
                .delete("/api/answers/delete/actualAnswerId") // replace with actual answerId
                .set("Authorization", `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("message");
        });
    });
});