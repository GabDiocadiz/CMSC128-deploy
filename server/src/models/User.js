import mongoose from 'mongoose';
const { Schema } = mongoose;

const typeOfUser = {
    ALUMNI: 'Alumni',
    ADMIN: 'Admin'
};

// User model
const userSchema = new Schema({
    user_id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})*$/, required: true },
    password: { type: String, required: true },
    contact_number: String,
    address: String,
    user_type: {
        type: String,
        enum: [typeOfUser.ALUMNI, typeOfUser.ADMIN],
        default: typeOfUser.ALUMNI,
        required: true
    },
});
userSchema.index({ user_type: 1 });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ name: 1 });

const alumniSchema = new Schema({
    graduation_year: { type: Number, min: 1940, max: new Date().getFullYear(), required: true },
    degree: { type: String, required: true },
    current_job_title: String,
    company: String,
    industry: String,
    skills: [String],
    profile_visibility: { type: Boolean, default: true },
    donation_history: [{ type: Schema.Types.ObjectId, ref: 'Donation' }],
    job_postings: [{ type: Schema.Types.ObjectId, ref: 'JobPosting' }],
    events_attended: [{ type: Schema.Types.ObjectId, ref: 'Event' }]
});

alumniSchema.index({ graduation_year: 1, current_job_title: 1, degree: 1 }); 
alumniSchema.index({ current_job_title: 1, company: 1, industry: 1 }); 
alumniSchema.index({ skills: 1 }); 


const adminSchema = new Schema({
    position: { type: String, required: true },
    permissions: { type: [String], required: true }
});

adminSchema.index({ position: 1 });

const User = mongoose.model('User', userSchema);
const Alumni = User.discriminator('Alumni', alumniSchema);
const Admin = User.discriminator('Admin', adminSchema);

// separate collections for Alumni and Admin
const AlumniCollection = mongoose.model('AlumniCollection', alumniSchema, 'alumni');
const AdminCollection = mongoose.model('AdminCollection', adminSchema, 'admin');

export { User, Alumni, Admin, AlumniCollection, AdminCollection };