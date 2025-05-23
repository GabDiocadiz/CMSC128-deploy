import Communication from '../../models/Communication.js';
import { createCRUDController } from '../middlewareControllers/createCRUDController/index.js';


export const communicationController = {
    ...createCRUDController(Communication),


   async getAnnouncements(req, res) {
        try {
            const announcements = await Communication.find({ type: "announcement" })
                                                    .sort({ date_published: -1 }); // Sort by most recent

            // Log the fetched announcements for server-side debugging
            console.log("Fetched announcements:", announcements);

            // Send the announcements array as a JSON response with a 200 OK status
            return res.status(200).json(announcements);
        } catch (error) {
            // Log the error for server-side debugging
            console.error("Error fetching announcements:", error);

            // Send a 500 Internal Server Error response to the client
            return res.status(500).json({
                message: "Failed to fetch announcements from the database.",
                error: error.message // Include error message for more detail
            });
        }
    },

    async getAnnouncementById(req, res) {
        // Extract the ID from the request parameters (e.g., from a route like /announcement/:id)
        const { id } = req.params;

        try {
            const announcement = await Communication.findOne({ _id: id, type: "announcement" });

            // If no announcement is found with the given ID and type
            if (!announcement) {
                // Send a 404 Not Found response
                return res.status(404).json({ message: "Announcement not found." });
            }

            // Log the fetched announcement for server-side debugging
            console.log("Fetched announcement by ID:", announcement);

            // Send the found announcement as a JSON response with a 200 OK status
            return res.status(200).json(announcement);
        } catch (error) {
            // Log the error for server-side debugging
            console.error(`Error fetching announcement with ID ${id}:`, error);

            // Handle Mongoose CastError specifically for invalid ID format
            if (error.name === 'CastError') {
                return res.status(400).json({
                    message: "Invalid announcement ID format.",
                    error: error.message
                });
            }

            // For any other server-side errors
            return res.status(500).json({
                message: "Failed to fetch the announcement from the database.",
                error: error.message
            });
        }
    },

}