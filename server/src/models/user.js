import mongoose from 'mongoose';

const typeOfUser = {
    USER : 'user',
    ADMIN : 'admin'
}

// User model
const userSchema = new mongoose.Schema({
    user_id: String,
	name: String,
    email: String,
	password: String,
    contact_number: String,
    address: String,
	user_type: {
        type: String,
        enum : [typeOfUser.USER,typeOfUser.ADMIN ],
        default : typeOfUser.USER
    },
});

const alumniSchema = new mongoose.Schema({
    graduation_year: Number,
    degree : String,
    current_job_title: String,
    company: String,
    industry: String,
    skills: [String],
    profile_visibility: Boolean, 
    donation_history: [], // TO DO: DONATION
    job_postings: [],//TO DO: JOB POSTING
    events_attended: []// TO DO: EVENT
});

const adminSchema = new mongoose.Schema({
    position : String,
    permissions : [String]
});

module.exports = mongoose.model('User', userSchema);
module.exports = User.discriminator('Alumni', alumniSchema);
module.exports = User.discriminator('Admin', adminSchema); 
const User = mongoose.model('User');
const Alumni = mongoose.model('Alumni');
const Admin = mongoose.model('Admin');

export { Alumni, Admin, typeOfUser, User}
