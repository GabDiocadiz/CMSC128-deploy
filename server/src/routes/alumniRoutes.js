import { Router } from 'express';
const router = Router();
import { createAlumni, getAllAlumni } from '../controllers/alumniController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

// create a new alumni profile (Admin only)
router.post('/alumni', authenticateToken, authorizeRoles(['Admin']), createAlumni);

// fetch all alumni profiles (Admin and Alumni)
router.get('/alumni', authenticateToken, authorizeRoles(['Admin', 'Alumni']), getAllAlumni);

import { alumniController, getAllAlumni } from '../controllers/modelControllers/alumniController.js';

// create a new alumni profile
// router.post('/alumni', createAlumni);

// read
router.get('/read', alumniController.read);

// fetch all alumni profiles
router.get('/get', getAllAlumni);

export default router;
