import mongoose from 'mongoose';
const { Schema } = mongoose;

const NotificationSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "Alumni", required: true }, // the alumni receiving the notification
    announcement: { type: Schema.Types.ObjectId, ref: "Communication", required: true }, // don't forget to filter this with 'Announcement' type
    status: { type: String, enum: ["unread", "read"], default: "unread" },
    isRead: { type: Boolean, default: false }, // read/unread
    createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
