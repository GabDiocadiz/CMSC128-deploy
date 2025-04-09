import express from "express";
import cors from "cors";
import alumniRoutes from "./src/routes/alumniRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import dotenv from 'dotenv';
dotenv.config(); 

const PORT = process.env.PORT || 5050;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/alumni", alumniRoutes);
app.use("/auth", authRoutes);

// connect to MongoDB - commented cause this is should be in index.js but not sure if you need this for something
// console.log("MONGO_URI:", process.env.MONGO_URI); // add this line to debug
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDB Connected...");
//     app.listen(PORT, () => {
//       console.log(`Server listening on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("Error connecting to MongoDB:", err);
//   });

//export for testing
export default app;
