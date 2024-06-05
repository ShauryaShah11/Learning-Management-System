import express from "express";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import User from "../models/User.model.js";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const backendUrl = process.env.BACKEND_URL;
const templatePath = path.join(
    __dirname,
    "..",
    "templates",
    "email-verification.html"
);
const htmlContent = await fs.promises.readFile(templatePath, {
    encoding: "utf-8",
});

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASS;

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: EMAIL,
        pass: PASSWORD,
    },
});

const emailController = {
    sendVerificationEmail: async (
        recipientEmail,
        username,
        verificationToken
    ) => {
        const verificationLink = `${backendUrl}/api/auth/verification/${verificationToken}`;
        try {
            const mailOptions = {
                from: EMAIL,
                to: recipientEmail,
                subject: "Email Verification Link",
                html: htmlContent
                    .replace("{{emailVerificationLink}}", verificationLink)
                    .replace("{{username}}", username),
            };
            await transporter.sendMail(mailOptions);
        } catch (error) {
            throw new Error("Failed to send verification email");
        }
    },

    verifyEmail: async (req, res) => {
        try {
            const verificationToken = req.params.token;

            const user = await User.findOne({
                verificationToken: verificationToken,
            });
            if (!user) {
                return res
                    .status(404)
                    .json({ error: "Invalid verification token" });
            }

            user.verificationToken = undefined;
            user.isVerified = true;

            await user.save();

            return res
                .status(200)
                .json({ message: "Email is succesfully verified" });
        } catch (error) {
            return res.status(500).json({
                error: "Internal server error",
            });
        }
    },

    forgotPassword: async (req, res) => {
        try {
            const email = req.body.email;

            const user = await User.findOne({ email: email });
            if (!user) {
                return res.status(404).json({ error: "User not found." });
            }
            const verificationToken = crypto.randomBytes(20).toString("hex");

            user.passwordResetToken = passwordResetToken;
            await user.save();

            return res
                .status(200)
                .json({ message: "Email is successfully send." });
        } catch (error) {
            return res.status(500).json({
                error: "Internal server error",
            });
        }
    },
};

export default emailController;
