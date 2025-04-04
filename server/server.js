import express from "express";
import cors from "cors";
import alumniRoutes from "./src/routes/alumniRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";

const PORT = process.env.PORT || 5050;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/alumni", alumniRoutes);
app.use("/auth", authRoutes);

//export for testing
export default app;