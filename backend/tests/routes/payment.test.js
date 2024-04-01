import request from "supertest";
import app from "../../index.js"; // your express app
import { generateToken } from "../../utils"; // function to generate a token for a test user

describe("Payment Routes", () => {
    let userToken;

    beforeAll(async () => {
        // setup: create a user and generate a token for them
        userToken = generateToken({ id: "user", role: "user" });
    });

    it("should checkout a payment", async () => {
        const response = await request(app)
            .post("/checkout")
            .set("Authorization", `Bearer ${userToken}`)
            .send({ amount: 100, currency: "usd" });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("paymentId");
    });

    it("should verify a payment", async () => {
        // setup: create a payment and get its id
        // replace this with your actual implementation
        const paymentId = await createPayment({
            userId: "user",
            amount: 100,
            currency: "usd",
        });

        const response = await request(app)
            .post("/paymentverification")
            .set("Authorization", `Bearer ${userToken}`)
            .send({ paymentId });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("verified", true);
    });
});
