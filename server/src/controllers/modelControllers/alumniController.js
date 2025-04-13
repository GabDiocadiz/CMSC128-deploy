import { Alumni } from '../../models/User.js';
import { createCRUDController } from '../middlewareControllers/createCRUDController/index.js';

export const alumniController = {
    ...createCRUDController(Alumni),
}

export async function getAllAlumni(req, res) {
    try {
        const alumni = await Alumni.find();
        res.status(200).json(alumni);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
