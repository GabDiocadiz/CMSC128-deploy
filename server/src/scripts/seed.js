import mongoose from 'mongoose';
import { Alumni } from '../models/user.js';
import { alumniData } from './data.js'; 

// connect to MongoDB
mongoose
    .connect("mongodb://localhost:27017/artemis_db", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB Connected...");
        return Alumni.deleteMany({});
    })
    .then(() => {
        console.log("Existing data deleted...");
        return Alumni.insertMany(alumniData);
    })
    .then(() => {
        console.log("Dummy data inserted successfully");
        mongoose.disconnect();
    })
    .catch((err) => {
        console.error("Error inserting dummy data:", err);
        mongoose.disconnect();
    });
