import express from "express";
import { validateToken } from "../middleware/validate-token.js";
import { authorizeRoles } from "../middleware/authorize-roles.js";
import { communicationController } from "../controllers/modelControllers/communicationController.js";
import upload from '../middleware/fileMiddleware.js'; // Multer middleware

const router = express.Router();

router.post("/create", communicationController.create);
router.get("/read-announcements", communicationController.getAnnouncements);
router.get("/read-announcements/:_id", communicationController.getAnnouncementById);
router.post("/upload",  upload.array('files[]'), communicationController.uploadCommunicationFiles);
router.get("/:_id/files", communicationController.getCommunicationFiles);

export default router