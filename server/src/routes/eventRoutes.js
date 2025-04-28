import express from 'express';
import { validateToken } from '../middleware/validate-token.js';
import eventController from '../controllers/modelControllers/eventController.js';

const router = express.Router();

router.get('/', validateToken, eventController.read);

export default router;