import { Router } from 'express';
const router = Router();
import { alumniController } from '../controllers/modelControllers/alumniController.js';
import { getAllAlumni } from '../controllers/modelControllers/alumniController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';
import { createRSVP, editRSVP, viewRSVP } from '../controllers/RSVPController/rsvpController.js';


// fetch all alumni profiles
router.get('/read', alumniController.read);

// create a new alumni profile (Admin only)
// router.post('/alumni', authenticateToken, authorizeRoles(['Admin']), createAlumni);

// fetch all alumni profiles (Admin and Alumni)
router.get('/alumni', authenticateToken, authorizeRoles(['Admin', 'Alumni']), getAllAlumni);

// Create RSVP (Alumni confirming their attendance)
router.post('/alumni/rsvp', authenticateToken, authorizeRoles(['Alumni']), createRSVP);

// Edit RSVP
router.put('alumni/rsvp/:eventID', authenticateToken, authorizeRoles(['Alumni']), editRSVP);

// View RSVPs
router.get('alumni/view-all-rsvp', authenticateToken, authorizeRoles(['Alumni']), viewRSVP);

// fetch all attendees for the event (Admin and Alumni)
// router.get('alumni/event/:eventId/attendees', authenticateToken, authorizeRoles(['Alumin', 'Admin']), getEventAttendees);

// create a new alumni profile
// router.post('/alumni', createAlumni);

// // fetch all alumni profiles
// router.get('/get', getAllAlumni);

export default router;
