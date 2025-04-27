import { Event } from '../../models/Event.js';
import { createCRUDController } from '../middlewareControllers/createCRUDController/index.js';

export const eventController = {
    ...createCRUDController(Event),

    async adminPageEvents(req, res) {
        try {
            const items = await Event.find()
                .select('event_name event_date');
            res.status(200).json(items);
        } catch (err) {
            res.status(400).json({ error: err.message})
        }
    }
}