import express from 'express';
import mongoose from 'mongoose';
import path  from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';

import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

dotenv.config({path: path.join(__dirname, 'config', '.env')});

// Enable cors
app.use(cors());

app.use(express.json())

app.use('/user', userRoutes);
app.use('/auth', authRoutes);
const port = process.env.PORT || 5000;
const database_name = process.env.DATABASE;

mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: database_name,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.listen(port,() => {
    console.log(`listening on port ${port}`);
})

app.get('/',(err, req, res, next) => {
  return res.status(500).json({
    error: 'Internal server error'
  })
})