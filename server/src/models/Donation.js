const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DonationSchema = new Schema({
    donor: { type: Schema.Types.ObjectId, ref: 'Alumni', required: true },
    amount: { type: Number, required: true },
    donation_date: { type: Date, default: Date.now },
    purpose: { type: String }
});

const Donation = mongoose.model('Donation', DonationSchema);
module.exports = Donation;