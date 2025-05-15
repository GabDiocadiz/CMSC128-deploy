import Donation from '../../models/Donation.js';
import { createCRUDController } from '../middlewareControllers/createCRUDController/index.js';

export const donationController = {
    ...createCRUDController(Donation),

}