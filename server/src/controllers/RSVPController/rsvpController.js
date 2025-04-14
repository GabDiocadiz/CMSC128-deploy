import { RSVP } from "../../models/RSVP.js"

export const createRSVP = async (req, res) => {
    try {
        const { event, status } = req.body;
        // get user id of currently logged in user
        const alumniID = req.user._id;

        const existingRSVP = await RSVP.findOne({ event, alumni: alumniID });

        // check for any existing RSVPs of alumnus for chosen event
        if (existingRSVP) {
            return res.status(400).json({ message: "You've already RSVP'd for this event." })
        }

        const newRSVP = await RSVP.create({ event, alumni: alumniID, status });
        res.status(201).json(newRSVP);


    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

