import Communication from '../../models/Communication.js';
import { createCRUDController } from '../middlewareControllers/createCRUDController/index.js';


export const communicationController = {
    ...createCRUDController(Communication),


    async getAnnouncements(req, res){
    try {
        const announcements = await Communication.find({ type: "announcement" })
                                                .sort({ date_published: -1 }); // Optional: sort by most recent
        console.log(announcements);
        return announcements;
    } catch (error) {
        console.error("Error fetching announcements:", error);
        throw new Error("Failed to fetch announcements from the database.");
    }
    },

    async getAnnouncementById (req, res, id){
    try {
        const announcement = await Communication.findOne({ _id: id, type: "announcement" });
        return announcement;
    } catch (error) {
        console.error(`Error fetching announcement with ID ${id}:`, error);
        throw new Error("Failed to fetch the announcement from the database.");
    }
    },

}