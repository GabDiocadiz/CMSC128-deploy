import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import axios from "axios";
import cookieParser from "cookie-parser";
import alumniRoutes from "./src/routes/alumniRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import fileRoutes from './src/routes/fileRoutes.js';
import eventRoutes from './src/routes/eventRoutes.js';
import jobPostingRoutes from './src/routes/jobPostingRoutes.js'
import notificationRoutes from './src/routes/notificationRoutes.js';
import communicationRoutes from './src/routes/communicationRoutes.js';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// detailed CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173', // local
    'https://gab-vercel.vercel.app' // deployed
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // allow these methods
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'], // add headers your frontend sends
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// middleware
app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// routes
app.use("/alumni", alumniRoutes);
app.use("/jobs", jobPostingRoutes);
app.use("/auth", authRoutes);
app.use("/file", fileRoutes);
app.use("/events", eventRoutes);
app.use("/notifications", notificationRoutes);
app.use("/announcement", communicationRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend files
// app.use(express.static(path.join(__dirname, '../client/dist')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/dist/index.html'));
// });

// temporary default route -- remove when connecting to frontend
app.get('/', (req, res) => {
  res.send('API is running');
});

//export for testing
export default app;
