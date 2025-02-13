import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ["like", "comment", "follower", "block-user", "unblock-user", "delete-blog", "delete-user", "delete-comment"],
            required: true
        },
        isRead: {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true }
);

export const Notifications = mongoose.model("Notification", NotificationSchema);