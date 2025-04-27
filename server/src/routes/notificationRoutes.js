// server/src/routes/notificationRoutes.js

import express from 'express';
import {
  notificationController,
  getMyUnread,
  markAsRead
} from '../controllers/modelControllers/notificationController.js';
import { validateToken } from '../middleware/validate-token.js';

const router = express.Router();

// 1. Fetch only the current user’s unread notifications
//    GET /api/notifications/unread
router.get('/unread', validateToken, getMyUnread);

// 2. Create a new notification
//    POST /api/notifications
router.post('/', validateToken, notificationController.create);

// 3. Fetch all notifications (supports query params like ?user=<id>&status=read)
//    GET /api/notifications
router.get('/', validateToken, notificationController.read);

// 4. Mark a specific notification as read
//    PATCH /api/notifications/:id/read
router.patch('/:id/read', validateToken, markAsRead);

// 5. Delete a notification
//    DELETE /api/notifications/:id
router.delete('/:id', validateToken, notificationController.remove);

export default router;
