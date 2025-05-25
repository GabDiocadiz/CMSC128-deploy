import Donation from '../../models/Donation.js';
import { createCRUDController } from '../middlewareControllers/createCRUDController/index.js';

export const donationController = {
    ...createCRUDController(Donation),


    async getDonationsByDonor(req, res, next) {
        try {
            const { _id } = req.params; // Assuming the ID is passed as a URL parameter named 'userId'

            if (!_id) {
                return res.status(400).json({ message: 'User ID is required.' });
            }

            const donations = await Donation.find({ donor: _id })
                                            .populate('event', 'event_name date location'); // Populate event name, date, and location
            
            

            res.status(200).json(donations);
        } catch (error) {
            console.error(`Error fetching donations for donor ${req.params.userId}:`, error);
            // Pass the error to the next middleware (e.g., your error handling middleware)
            next(error);
        }
    },


    async getTotalDonationByDonor(req, res, next) {
        try {
            const { _id } = req.params; // Assuming the ID is passed as a URL parameter named 'userId'

            if (!_id) {
                return res.status(400).json({ message: 'User ID is required.' });
            }

            const donations = await Donation.find({ donor: _id })
                                            .populate('event', 'event_name date location'); // Populate event name, date, and location
            
            let totalAmount = 0;
            for (const donation of donations) {
                totalAmount += donation.amount;
            };

            res.status(200).json({totalAmount: totalAmount});
        } catch (error) {
            console.error(`Error fetching donations for donor ${req.params.userId}:`, error);
            // Pass the error to the next middleware (e.g., your error handling middleware)
            next(error);
        }
    }
}