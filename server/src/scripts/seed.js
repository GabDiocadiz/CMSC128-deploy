import mongoose from 'mongoose';
import { Alumni } from '../models/user.js';
import { JobPosting } from '../models/Job_Posting.js';
import { Event } from '../models/Event.js';
import { alumniData, jobPostingsData, eventData } from './data.js'; 

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
    console.log("MongoDB Connected...");
    return JobPosting.deleteMany({});
  })
  .then(() => {
    console.log("Existing data deleted...");
    return JobPosting.insertMany(jobPostingsData);
  })
  .then(() => {
    console.log("MongoDB Connected...");
    return Event.deleteMany({});
  })
  .then(() => {
    console.log("Existing data deleted...");
    return Event.insertMany(eventData);
  })
  .then(() => {
      console.log("Dummy data inserted successfully");
      mongoose.disconnect();
  })
  .catch((err) => {
      console.error("Error inserting dummy data:", err);
      mongoose.disconnect();
  });
