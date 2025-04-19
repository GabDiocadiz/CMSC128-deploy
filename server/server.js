import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import axios from "axios";
import cookieParser from "cookie-parser";
import alumniRoutes from "./src/routes/alumniRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";

dotenv.config(); 

const VITE_API_URL = process.env.VITE_API_URL || 5173;

export const api = axios.create({
  baseURL: VITE_API_URL,
  withCredentials: true
})

const app = express();

// middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/alumni", alumniRoutes);
app.use("/auth", authRoutes);

// temporary default route -- remove when connecting to frontend
app.get('/', (req, res) => {
    res.send('API is running');
});

//export for testing
export default app;
