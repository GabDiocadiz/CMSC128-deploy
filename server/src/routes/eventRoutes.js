import express from "express";
import { validateToken } from "../middleware/validate-token.js";
import { authorizeRoles } from "../middleware/authorize-roles.js";
import { eventController } from "../controllers/modelControllers/eventController.js";
import upload from '../middleware/fileMiddleware.js'; // Multer middleware
import { createRSVP, editRSVP, viewRSVP } from "../controllers/RSVPController/rsvpController.js";

import { donationController } from "../controllers/modelControllers/donationController.js";

const router = express.Router();

router.get('/all', validateToken, authorizeRoles(["Admin", "Alumni"]), eventController.read);
router.get('/read-sort', validateToken, authorizeRoles(["Admin", "Alumni"]), eventController.readSort);
router.get('/find-event/:id', validateToken, authorizeRoles(["Admin", "Alumni"]), eventController.findEventById);
router.get("/admin-page-events", validateToken, authorizeRoles(["Admin"]), eventController.adminPageEvents);

router.post("/create", validateToken, authorizeRoles(["Admin"]), upload.array('files[]'), eventController.create);
router.post("/:_id/upload", validateToken, authorizeRoles(["Admin"]), upload.array('files[]'), eventController.uploadEventFiles);
router.get('/:_id/files', validateToken, authorizeRoles(["Admin", "Alumni"]), eventController.getEventFiles);

router.post('/create-rsvp/:eventID', validateToken, authorizeRoles(['Alumni']), createRSVP);
router.put('/edit-rsvp/:eventID', validateToken, authorizeRoles(['Alumni']), editRSVP);

router.post('/donate/:eventID', validateToken, authorizeRoles(['Alumni']), donationController.create)

router.post("/bookmark", validateToken, authorizeRoles(["Admin", "Alumni"]), eventController.bookmarkEvent);
router.post("/unbookmark", validateToken, authorizeRoles(["Admin", "Alumni"]), eventController.unbookmarkEvent);
router.get("/event-bookmarked", validateToken, authorizeRoles(["Admin", "Alumni"]), eventController.getbookmarked_events);

export default router