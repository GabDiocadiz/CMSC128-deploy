import express from 'express';
import { alumniController } from '../controllers/modelControllers/alumniController.js';
import { getAllAlumni } from '../controllers/modelControllers/alumniController.js';
import { validateToken } from '../middleware/validate-token.js';
import { authorizeRoles } from '../middleware/authorize-roles.js';
import { alumniSearch } from '../controllers/modelControllers/alumniController.js';


// delete by email
router.delete('/email/:email', alumniController.deleteByEmail);

// fetch all alumni profiles (Admin and Alumni)
router.get('/alumni', validateToken, authorizeRoles(['Admin', 'Alumni']), getAllAlumni);

// search and filter alumni
router.get('/search', alumniSearch);

export default router;
