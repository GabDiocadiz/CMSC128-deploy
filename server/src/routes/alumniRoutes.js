import { Router } from 'express';
const router = Router();
import { createAlumni, getAllAlumni } from '../controllers/alumniController.js';

// create a new alumni profile
router.post('/alumni', createAlumni);

// fetch all alumni profiles
router.get('/alumni', getAllAlumni);

export default router;
