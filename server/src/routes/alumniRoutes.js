import { Router } from 'express';
const router = Router();
import { alumniController } from '../controllers/modelControllers/alumniController.js';
import { getAllAlumni } from '../controllers/modelControllers/alumniController.js';
import { validateToken } from '../middleware/validate-token.js';
import { authorizeRoles } from '../middleware/authorize-roles.js';
import { alumniSearch } from '../controllers/modelControllers/alumniController.js';

// fetch all alumni profiles
router.get('/read', alumniController.read);

// fetch all alumni profiles (Admin and Alumni)
router.get('/alumni', validateToken, authorizeRoles(['Admin', 'Alumni']), getAllAlumni);

// search and filter alumni
router.get('/search', alumniSearch);

export default router;
