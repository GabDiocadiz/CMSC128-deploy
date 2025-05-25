import express from 'express';
import { adminController } from '../controllers/modelControllers/adminController.js';
import { createRSVP, editRSVP, viewRSVP } from '../controllers/RSVPController/rsvpController.js';
import { validateToken } from '../middleware/validate-token.js';
import { authorizeRoles } from '../middleware/authorize-roles.js';

const router = express.Router();

router.get('/find-admin/:id', validateToken, authorizeRoles(["Admin"]), adminController.findAdminById);

export default router;
