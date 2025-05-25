import { Admin } from '../../models/User.js';
import { createCRUDController } from '../middlewareControllers/createCRUDController/index.js';

export const adminController = {
    ...createCRUDController(Admin),

    async findAdminById(req, res) {
        try {
            const { id } = req.params;
            const event = await Admin.findById(id);
            if (!event) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json(event);
        } catch (e) {
            console.error("Error in eventController.findAlumniById:", e);
            res.status(500).json({ message: e.message });
        }
    },
}