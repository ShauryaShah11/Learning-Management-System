import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDb } from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import answerRoutes from "./routes/answer.routes.js";
import questionRoutes from "./routes/question.routes.js";
import courseRoutes from "./routes/course.routes.js";
import categoryRoutes from "./routes/courseCategory.routes.js";
import enrollRoutes from "./routes/courseEnrolled.routes.js";
import sectionRoutes from "./routes/section.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import tutorRoutes from "./routes/tutor.routes.js";

const app = express();

dotenv.config();
// Enable cors
app.use(cors());

app.use(express.json());
// app.use('/api/videos');
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/enrollments", enrollRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/tutor", tutorRoutes);

app.get("/api/razorpay-key", (req, res) => {
    return res.json({
        key: process.env.RAZORPAY_API_KEY,
    });
});

const port = process.env.PORT || 5000;

app.get("/api", (req, res) => {
    res.send("Hello to learning management system apis!");
});

app.listen(port, () => {
    connectDb();
    console.log(`listening on port ${port}`);
});

app.get("/", (err, req, res, next) => {
    console.error(err);
    return res.status(500).json({
        error: "Internal server error",
    });
});
