import mongoose from 'mongoose';
const { Schema } = mongoose;

const jobPostingSchema = new Schema({
    job_id: { type: Number, required: true },
    posted_by: {type: Schema.Types.ObjectId, ref: 'Alumni', required: true},
    job_title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    job_description: { type: String, required: true },
    requirements: { type: [String], required: true },
    application_link: { type: String, required: true },
    date_posted: { type: Date, required: true },
    status:{
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        required: true
    },
    approved_by:{type: Schema.Types.ObjectId, ref: 'Admin'},
    approval_date:{
        type: Date,
        default: null
    }
});

const JobPosting = mongoose.model('JobPosting', jobPostingSchema);

export { JobPosting }
