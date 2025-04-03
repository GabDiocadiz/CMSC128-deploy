import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import alumniRoutes from "./src/routes/alumniRoutes.js";

const PORT = process.env.PORT || 5050;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api", alumniRoutes);

// connect to MongoDB
mongoose
  .connect("mongodb://admin:cmsc128artemis@127.0.0.1:27017/artemis_db?authSource=admin", { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => {
    console.log("MongoDB Connected...");
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });