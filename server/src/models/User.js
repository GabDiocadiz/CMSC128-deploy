import mongoose from 'mongoose';
const { Schema } = mongoose;

const typeOfUser = {
    USER: 'user',
    ADMIN: 'admin'
};

// User model
const userSchema = new Schema({
    user_id: String,
    name: String,
    email: String,
    password: String,
    contact_number: String,
    address: String,
    user_type: {
        type: String,
        enum: [typeOfUser.USER, typeOfUser.ADMIN],
        default: typeOfUser.USER
    },
});

const alumniSchema = new Schema({
    graduation_year: Number,
    degree: String,
    current_job_title: String,
    company: String,
    industry: String,
    skills: [String],
    profile_visibility: { type: Boolean, default: true },
    donation_history: [{ type: Schema.Types.ObjectId, ref: 'Donation' }],
    job_postings: [{ type: Schema.Types.ObjectId, ref: 'JobPosting' }],
    events_attended: [{ type: Schema.Types.ObjectId, ref: 'Event' }]
});

const adminSchema = new Schema({
    position: String,
    permissions: [String]
});

const User = mongoose.model('User', userSchema);
const Alumni = User.discriminator('Alumni', alumniSchema);
const Admin = User.discriminator('Admin', adminSchema);

export { User, Alumni, Admin };