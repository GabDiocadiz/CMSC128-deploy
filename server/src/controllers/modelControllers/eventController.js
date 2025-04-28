import { Event } from '../../models/Event.js';
import { createCRUDController } from '../middlewareControllers/createCRUDController/index.js';

const eventController = createCRUDController(Event);

eventController.read = async function (req, res) {
    try {

        const { sortBy } = req.query;
        let events;

        if (sortBy === "date") {
            events = await Event.find().sort({ event_date: -1 }); // Sort newest first
        } else if (sortBy === "title") {
            events = await Event.find().sort({ event_name: 1 }); // Sort A → Z
        } else {
            events = await Event.find(); // Default: return unsorted events
        }

        console.log("Fetched Events:", events.length);
        res.status(200).json(events);
    } catch (e) {
        console.error("Error in eventController.read:", e);
        res.status(500).json({ message: e.message });
    }
};

export default eventController;