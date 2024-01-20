import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { connectDb } from './config/db.js';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import answerRoutes from './routes/answer.routes.js';
import questionRoutes from './routes/question.routes.js';
import courseRoutes from './routes/course.routes.js';
import categoryRoutes from './routes/courseCategory.routes.js';
import enrollRoutes from './routes/courseEnrolled.routes.js';
import sectionRoutes from './routes/section.routes.js';
import reviewRoutes from './routes/review.routes.js';
import paymentRoutes from './routes/payment.routes.js';

const app = express();

dotenv.config();
// Enable cors
app.use(cors());

app.use(express.json())
// app.use('/api/videos');
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/answers', answerRoutes);
app.use('/questions', questionRoutes);
app.use('/courses', courseRoutes);
app.use('/categories', categoryRoutes);
app.use('/enrollments', enrollRoutes);
app.use('/sections', sectionRoutes);
app.use('/reviews', reviewRoutes);
app.use('/payments', paymentRoutes);

import { upload } from './middlewares/multer.js';
import { cloudinary } from './config/cloudinary.js';

app.post('/upload', upload.single('image'), function (req, res) {
  cloudinary.uploader.upload(req.file.path,{folder: 'images'}, function (err, result){
    if(err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Error"
      })
    }

    res.status(200).json({
      success: true,
      message:"Uploaded!",
      data: result
    })
  })
});
const port = process.env.PORT || 5000;

app.get('/api', (req, res) => {
    res.send('Hello to learning management system apis!');
});

app.listen(port,() => {
    connectDb();
    console.log(`listening on port ${port}`);
})

app.get('/',(err, req, res, next) => {
  console.error(err);
  return res.status(500).json({
    error: 'Internal server error'
  })
})