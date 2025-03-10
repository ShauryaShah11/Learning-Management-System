import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.model.js";

dotenv.config();

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const verifyToken = async (req, res, next) => {
    try {
        // Get the Authorization header
        const authHeader = req.header("Authorization");
        
        // Check if Authorization header exists
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }
        
        // Extract the token from the Authorization header
        // Handle both "Bearer <token>" and plain token formats
        let token;
        if (authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7); // Remove "Bearer " prefix
        } else {
            token = authHeader;
        }
        
        // Check if token is not empty after extraction
        if (!token || token.trim() === '') {
            return res.status(401).json({
                success: false,
                message: "Access denied. Invalid token format."
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, jwtSecretKey);
        
        // Check for expiration time (if it exists in your token)
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
            return res.status(401).json({
                success: false,
                message: "Token has expired."
            });
        }
        
        // Find the user by ID
        const user = await User.findById(decoded.id);
        
        // Check if user exists
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found."
            });
        }
        
        // Attach the user object to the request
        req.user = user;
        next();
        
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                success: false,
                message: "Token has expired."
            });
        } else if (err instanceof jwt.JsonWebTokenError) {
            // This catches both malformed tokens and signature verification failures
            return res.status(401).json({
                success: false,
                message: "Invalid token."
            });
        } else {
            console.error("Token verification error:", err);
            return res.status(500).json({
                success: false,
                message: "Internal server error during authentication."
            });
        }
    }
};

export { verifyToken };