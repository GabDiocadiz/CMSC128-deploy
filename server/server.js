import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import axios from "axios";
import cookieParser from "cookie-parser";
import alumniRoutes from "./src/routes/alumniRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import fileRoutes from './src/routes/fileRoutes.js';
import eventRoutes from './src/routes/eventRoutes.js'
import notificationRoutes from './src/routes/notificationRoutes.js';
import { fileURLToPath } from 'url';
import path from 'path';


dotenv.config();

const VITE_API_URL = process.env.VITE_API_URL || 5173;

export const api = axios.create({
  baseURL: VITE_API_URL,
  withCredentials: true
})

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// routes
app.use("/alumni", alumniRoutes);
app.use("/auth", authRoutes);
app.use("/file", fileRoutes);
app.use('/api/notifications', notificationRoutes);
app.use("/events", eventRoutes);


// temporary default route -- remove when connecting to frontend
app.get('/', (req, res) => {
  res.send('API is running');
});

//export for testing
export default app;
