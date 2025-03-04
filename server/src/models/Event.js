import { Alumni } from './user';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    event_name: String,
    event_description: Text,
    event_date: Date,
    venue: String,
    attendees: [Alumni]
});

const Event = mongoose.model('Event', eventSchema);

export { Event }