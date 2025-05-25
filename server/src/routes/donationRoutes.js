import express from "express";
import { validateToken } from "../middleware/validate-token.js";
import { authorizeRoles } from "../middleware/authorize-roles.js";
import { donationController } from "../controllers/modelControllers/donationController.js";


const router = express.Router();

router.post("/create", donationController.create);
router.get("/read-donations/:_id", validateToken, authorizeRoles(["Admin", "Alumni"]), donationController.getDonationsByDonor);
router.get("/total-donations/:_id", validateToken, authorizeRoles(["Admin"]), donationController.getTotalDonationByDonor);

export default router