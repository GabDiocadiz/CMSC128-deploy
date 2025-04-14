import express from "express";
import cors from "cors";
import alumniRoutes from "./src/routes/alumniRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import fileRoutes from './src/routes/fileRoutes.js';
import dotenv from 'dotenv';
dotenv.config(); 

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
// routes
app.use("/alumni", alumniRoutes);
app.use("/auth", authRoutes);
app.use("/file", fileRoutes);

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

// temporary default route -- remove when connecting to frontend
app.get('/', (req, res) => {
    res.send('API is running');
});

//export for testing
export default app;
