import express from "express";
import cors from "cors";
import alumniRoutes from "./src/routes/alumniRoutes.js";

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/alumni", alumniRoutes);

// temporary default route -- remove when connecting to frontend
app.get('/', (req, res) => {
    res.send('API is running');
});

//export for testing
export default app;