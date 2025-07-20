import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/upload.js"; 
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

app.use(cookieParser());

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true })); 
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes); 

// DB + Server Start
connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));