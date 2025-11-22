import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  message: String,
  redirectUrl: String,
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

export default  mongoose.model('Notification', NotificationSchema);
