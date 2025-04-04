import { Router } from 'express';
const router = Router();
import { createAlumni, getAllAlumni } from '../controllers/alumniController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

// create a new alumni profile (Admin only)
router.post('/alumni', authenticateToken, authorizeRoles(['Admin']), createAlumni);

// fetch all alumni profiles (Admin and Alumni)
router.get('/alumni', authenticateToken, authorizeRoles(['Admin', 'Alumni']), getAllAlumni);

export default router;
