import mongoose from 'mongoose';
const { Schema } = mongoose;

const RSVPSchema = new Schema({
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    alumni: { type: Schema.Types.ObjectId, ref: 'Alumni', required: true },
    status: { type: String, enum: ['Attending', 'Not Attending', 'Interested'], required: true }
});

const RSVP = mongoose.model('RSVP', RSVPSchema);
export default RSVP;