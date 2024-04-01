import nodemailer from "nodemailer";
import fs from "fs";
import crypto from "crypto";
import emailController from "../../controllers/email.controller.js";
import User from "../../models/User.model.js";

// Mocking the required modules
jest.mock("nodemailer");
jest.mock("fs");
jest.mock("crypto");
jest.mock("../../models/User.model.js");

describe("emailController", () => {
    describe("sendVerificationEmail", () => {
        it("should successfully send a verification email", async () => {
            const recipientEmail = "test@example.com";
            const username = "testuser";
            const verificationToken = "validToken";

            await emailController.sendVerificationEmail(
                recipientEmail,
                username,
                verificationToken
            );

            expect(nodemailer.createTransport).toHaveBeenCalledTimes(1);
            expect(nodemailer.createTransport).toHaveBeenCalledWith({
                service: "gmail",
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASS,
                },
            });

            const mailOptions = {
                from: process.env.EMAIL,
                to: recipientEmail,
                subject: "Email Verification Link",
                html: expect.any(String),
            };

            expect(nodemailer.createTransport().sendMail).toHaveBeenCalledTimes(1);
            expect(nodemailer.createTransport().sendMail).toHaveBeenCalledWith(
                mailOptions
            );
        });

        // Add more test cases for other scenarios
    });

    describe("verifyEmail", () => {
        it("should successfully verify an email", async () => {
            const req = {
                params: {
                    token: "validToken",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const user = {
                save: jest.fn(),
            };
            User.findOne.mockResolvedValueOnce(user);

            await emailController.verifyEmail(req, res);

            expect(User.findOne).toHaveBeenCalledTimes(1);
            expect(User.findOne).toHaveBeenCalledWith({
                verificationToken: "validToken",
            });
            expect(user.verificationToken).toBeUndefined();
            expect(user.isVerified).toBe(true);
            expect(user.save).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Email is succesfully verified",
            });
        });

        // Add more test cases for other scenarios
    });

    describe("forgotPassword", () => {
        it("should successfully send a password reset email", async () => {
            const req = {
                body: {
                    email: "test@example.com",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const user = {
                passwordResetToken: "validToken",
                save: jest.fn(),
            };
            User.findOne.mockResolvedValueOnce(user);
            crypto.randomBytes.mockReturnValueOnce({
                toString: jest.fn().mockReturnValueOnce("validToken"),
            });

            await emailController.forgotPassword(req, res);

            expect(User.findOne).toHaveBeenCalledTimes(1);
            expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
            expect(user.passwordResetToken).toBe("validToken");
            expect(user.save).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Email is successfully send.",
            });
        });

        // Add more test cases for other scenarios
    });
});
