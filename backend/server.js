import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config'; // Environment variables load karva mate

// Routes 
import userRouter from './routes/userRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import adminRouter from './routes/adminRoute.js';
import appointmentRouter from './routes/appointmentRoute.js';

import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();
connectCloudinary();

// API Endpoints
app.use("/api/user", userRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/admin", adminRouter);
app.use("/api/appointment", appointmentRouter);

// Database Connection
const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/DAS";

mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("MongoDB Connection Error: ", err));

app.listen(port, () => {
  console.log(`Server running on port ${port} 🚀`);
});