import mongoose from 'mongoose';
const { Schema } = mongoose;

const ReportSchema = new Schema({
    generated_by: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
    report_type: { type: String, enum: ['Alumni Engagement', 'Donations', 'Event Attendance', 'Job Postings'], required: true },
    data_summary: { type: String },
    date_generated: { type: Date, default: Date.now }
});

const Report = mongoose.model('Report', ReportSchema);
module.exports = Report;