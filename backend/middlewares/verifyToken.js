import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path  from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({path: path.join(__dirname, 'config', '.env')});

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const verifyToken = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), jwtSecretKey);
    const user = await User.findOne({username: decoded.username});
    req.user = user; // Now you have access to the user data, including user ID

    const expirationTime = new Date(decoded.exp * 1000); // Convert seconds to milliseconds
    if (expirationTime <= new Date()) {
      res.status(401).json({ success: false, message: 'Token has expired.' });
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: 'Invalid token.' });
  }
};


export { verifyToken };