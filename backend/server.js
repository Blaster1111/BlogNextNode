import express from 'express';
import connectDb from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import postRoutes from './routes/post.routes.js';
import dotenv from 'dotenv';
import cors from "cors";


dotenv.config();
connectDb();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", postRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
