import { Alumni } from '../../models/User.js';
import { createCRUDController } from '../middlewareControllers/createCRUDController/index.js';

export const alumniController = {
    ...createCRUDController(Alumni),

    async deleteByEmail(req, res) {
        try {
            const { email } = req.params;
            const deleted = await Alumni.findOneAndDelete({ email });
        
            if (!deleted) return res.status(404).json({ message: 'User not found' });
        
            res.status(200).json({ message: 'User deleted' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
      }
}

export async function getAllAlumni(req, res) {
    try {
        const alumni = await Alumni.find();
        res.status(200).json(alumni);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
