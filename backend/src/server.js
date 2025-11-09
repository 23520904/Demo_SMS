import dotenv from "dotenv";

import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import { connectDB } from "./lib/db.js";
dotenv.config();
const PORT = process.env.PORT || 5000;


const app = express();
//De ket noi toi expo
app.use(
  cors({
    origin: "*", // Expo dev (hoặc thêm domain prod)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 phút
  max: 100, // 100 requests/phút
  message: { message: "Too many requests, please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Áp dụng rate limit chung
app.use(generalLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});