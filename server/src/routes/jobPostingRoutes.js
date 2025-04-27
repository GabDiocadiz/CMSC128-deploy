import express from "express";
import { validateToken } from "../middleware/validate-token.js";
import { authorizeRoles } from "../middleware/authorize-roles.js";
import { jobPostingController } from "../controllers/modelControllers/jobPostingController.js";

const router = express.Router();

router.get("/admin-page-jobs", // validateToken, authorizeRoles(["Admin"]), * commented for testing
    jobPostingController.adminPageJobs);

router.get("/admin-page-job-requests", // validateToken, authorizeRoles(["Admin"]), * commented for testing
    jobPostingController.adminPageJobRequests);

export default router