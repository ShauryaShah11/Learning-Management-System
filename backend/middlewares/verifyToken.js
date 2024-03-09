import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.model.js";

dotenv.config();

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const verifyToken = async (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res
            .status(401)
            .json({
                success: false,
                message: "Access denied. No token provided.",
            });
    }
    try {
         
        const decoded = jwt.verify(token.replace("Bearer ", ""), jwtSecretKey);
        const expirationTime = new Date(decoded.expiresIn * 1000);

        if (expirationTime <= new Date()) {
            res.status(401).json({
                success: false,
                message: "Token has expired.",
            });
        } else {
            const user = await User.findById(decoded.id);
            req.user = user; 
            next();
        }
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                success: false,
                message: "Token has expired.",
            });
        } else {
            console.error(err);
            res.status(400).json({ success: false, message: "Invalid token." });
        }
    }
};

export { verifyToken };
