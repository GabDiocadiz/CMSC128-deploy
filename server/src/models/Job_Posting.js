import mongoose from 'mongoose';
const { Schema } = mongoose;

const jobPostingSchema = new Schema({
    job_id: Number,
    posted_by: {type: Schema.Types.ObjectId, ref: 'Alumni'},
    job_title: String,
    company: String,
    location: String,
    job_description: String,
    requirements: [String],
    application_link: String,
    date_posted: Date,
    status:{
        type: String,
        enum: ['pending', 'approved', 'rejected']
    },
    approved_by:{type: Schema.Types.ObjectId, ref: 'Admin'},
    approval_date:{
        type: Date,
        default: null
    }
});

const JobPosting = mongoose.model('JobPosting', jobPostingSchema);

export { JobPosting }
