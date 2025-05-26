import mongoose from 'mongoose';
const { Schema } = mongoose;

const DonationSchema = new Schema({
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    donor: { type: Schema.Types.ObjectId, ref: 'Alumni', required: true },
    amount: { type: Number, min: 0, required: true },
    donation_date: { type: Date, default: Date.now },
});

const Donation = mongoose.model('Donation', DonationSchema);
export default Donation;