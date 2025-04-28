import express from "express";
import { validateToken } from "../middleware/validate-token.js";
import { authorizeRoles } from "../middleware/authorize-roles.js";
import { eventController } from "../controllers/modelControllers/eventController.js";

const router = express.Router();

router.get('/read-sort', validateToken, eventController.readSort);
router.get("/admin-page-events", // validateToken, authorizeRoles(["Admin"]), * commented for testing
    eventController.adminPageEvents);

export default router