import { Router } from 'express';
const router = Router();
import { alumniController, getAllAlumni } from '../controllers/modelControllers/alumniController.js';

// create a new alumni profile
// router.post('/alumni', createAlumni);

// read
router.get('/read', alumniController.read);

// fetch all alumni profiles
router.get('/get', getAllAlumni);

export default router;
