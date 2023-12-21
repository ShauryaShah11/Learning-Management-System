import express from 'express';
import mongoose from 'mongoose';
import path  from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

dotenv.config({path: path.join(__dirname, 'config', '.env')});

// Enable cors
app.use(cors());

app.use(express.json())


const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.listen(port,() => {
    console.log(`listening on port ${port}`);
})
