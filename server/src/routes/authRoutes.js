import express from "express";
import { register, uploadProfilePicture} from "../controllers/authControllers/register.js";
import { login } from "../controllers/authControllers/login.js";
import { refresh } from "../controllers/authControllers/refresh.js";
import { logout } from "../controllers/authControllers/logout.js";
import upload from '../middleware/fileMiddleware.js'; // Multer middleware
const router = express.Router();


router.post("/register", register);
router.post("/register/upload",  upload.array('files[]'), uploadProfilePicture);
router.post("/login", login);
router.get("/refresh", refresh);
router.post("/logout", logout);

export default router;
