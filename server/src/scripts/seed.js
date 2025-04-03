import mongoose from 'mongoose';
import { User, Alumni, Admin, AlumniCollection, AdminCollection } from '../models/user.js';
import { JobPosting } from '../models/Job_Posting.js';
import { Event } from '../models/Event.js';
import { alumniData, adminData, jobPostingsData, eventData } from './data.js';

async function seedDatabase() {
  try {
    await mongoose.connect("mongodb://admin:cmsc128artemis@127.0.0.1:27017/artemis_db?authSource=admin", { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    console.log("MongoDB Connected...");
    await User.deleteMany({});
    console.log("Existing user data deleted...");
    await AlumniCollection.deleteMany({});
    console.log("Existing alumni collection data deleted...");
    await AdminCollection.deleteMany({});
    console.log("Existing admin collection data deleted...");

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

    await JobPosting.deleteMany({});
    console.log("Existing job postings data deleted...");
    await JobPosting.insertMany(jobPostingsData);
    console.log("Job postings data inserted...");

    await Event.deleteMany({});
    console.log("Existing event data deleted...");
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
