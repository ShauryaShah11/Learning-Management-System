import express from 'express';
import mongoose from 'mongoose';
import path  from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';

import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import answerRoutes from './routes/answer.routes.js';
import questionRoutes from './routes/question.routes.js';
import courseRoutes from './routes/course.routes.js';
import categoryRoutes from './routes/courseCategory.routes.js';
import enrollRoutes from './routes/courseEnrolled.routes.js';
import sectionRoutes from './routes/section.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

dotenv.config({path: path.join(__dirname, 'config', '.env')});

// Enable cors
app.use(cors());

app.use(express.json())

app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/answers', answerRoutes);
app.use('/questions', questionRoutes);
app.use('/courses', courseRoutes);
app.use('/categories', categoryRoutes);
app.use('/enrollments', enrollRoutes);
app.use('/sections', sectionRoutes);

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
  console.error(err);
  return res.status(500).json({
    error: 'Internal server error'
  })
})