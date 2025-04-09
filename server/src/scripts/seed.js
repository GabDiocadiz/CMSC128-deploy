import mongoose from 'mongoose';
import { User, Alumni, Admin, AlumniCollection, AdminCollection } from '../models/User.js';

import { JobPosting } from '../models/Job_Posting.js';
import { Event } from '../models/Event.js';
import { alumniData, adminData, jobPostingsData, eventData } from './data.js';

//load environment variables
dotenv.config();

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI); //use MONGO_URI from .env
    console.log("MongoDB Connected...");

    // delete existing data
    await User.deleteMany({});
    console.log("Existing user data deleted...");
    await AlumniCollection.deleteMany({});
    console.log("Existing alumni collection data deleted...");
    await AdminCollection.deleteMany({});
    console.log("Existing admin collection data deleted...");
    await JobPosting.deleteMany({});
    console.log("Existing job postings data deleted...");
    await Event.deleteMany({});
    console.log("Existing event data deleted...");

    // insert new data
    const alumniPromises = alumniData.map(async (alumni) => {
      const newAlumni = new Alumni(alumni);
      await newAlumni.save();
      const newAlumniCollection = new AlumniCollection(alumni);
      await newAlumniCollection.save();
      console.log(`Inserted alumni: ${newAlumni.name}`);
    });
    await Promise.all(alumniPromises);
    console.log("Alumni data inserted...");

    const adminPromises = adminData.map(async (admin) => {
      const newAdmin = new Admin(admin);
      await newAdmin.save();
      const newAdminCollection = new AdminCollection(admin);
      await newAdminCollection.save();
      console.log(`Inserted admin: ${newAdmin.name}`);
    });
    await Promise.all(adminPromises);
    console.log("Admin data inserted...");

    await JobPosting.insertMany(jobPostingsData);
    console.log("Job postings data inserted...");

    await Event.insertMany(eventData);
    console.log("Event data inserted...");

  } catch (err) {
    console.error("Error inserting dummy data:", err);
  } finally {
    mongoose.disconnect();
    console.log("MongoDB Disconnected...");
  }
}

seedDatabase();
