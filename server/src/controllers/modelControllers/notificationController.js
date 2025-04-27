// server/src/controllers/modelControllers/notificationController.js

import Notification from '../../models/Notification.js';
import { createCRUDController } from '../middlewareControllers/createCRUDController/index.js';

// 1. Generic CRUD handlers for Notification
export const notificationController = createCRUDController(Notification);

// 2. Custom handler: fetch only the current user’s unread notifications,
//    sorted by creation date and with the related announcement populated.
export const getMyUnread = async (req, res, next) => {
  try {
    const userId = req.user.id;  // set by your validateToken middleware
    const notifs = await Notification
      .find({ user: userId, status: 'unread' })
      .sort('-createdAt')
      .populate('announcement');
    return res.json(notifs);
  } catch (err) {
    return next(err);
  }
};

// 3. Helper handler: mark a specific notification as read
export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notif = await Notification
      .findByIdAndUpdate(id, { status: 'read' }, { new: true });
    return res.json(notif);
  } catch (err) {
    return next(err);
  }
};
