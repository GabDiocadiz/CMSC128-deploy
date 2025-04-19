import express from "express";
import { register} from "../controllers/authControllers/register.js";
import { login } from "../controllers/authControllers/login.js";
import { refresh } from "../controllers/authControllers/refresh.js";
const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);

export default router;
