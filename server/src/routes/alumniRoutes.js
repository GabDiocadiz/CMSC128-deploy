import express from 'express';
import { alumniController } from '../controllers/modelControllers/alumniController.js';
import { getAllAlumni } from '../controllers/modelControllers/alumniController.js';
import { createRSVP, editRSVP, viewRSVP } from '../controllers/RSVPController/rsvpController.js';
import { validateToken } from '../middleware/validate-token.js';
import { authorizeRoles } from '../middleware/authorize-roles.js';
import { alumniSearch } from '../controllers/modelControllers/alumniController.js';

const router = express.Router();

// delete by email
router.delete('/email/:email', alumniController.deleteByEmail);

// fetch all alumni profiles (Admin and Alumni)
router.get('/alumni', validateToken, authorizeRoles(['Admin', 'Alumni']), getAllAlumni);

// Create RSVP (Alumni confirming their attendance)
router.post('/alumni/rsvp', validateToken, authorizeRoles(['Alumni']), createRSVP);

// Edit RSVP
router.put('alumni/rsvp/:eventID', validateToken, authorizeRoles(['Alumni']), editRSVP);

// View RSVPs
router.get('alumni/view-all-rsvp', validateToken, authorizeRoles(['Alumni']), viewRSVP);

router.get('/search', alumniSearch);

export default router;
