
import { Notifications } from '../models/notification';
import { getSocketInstance } from './socketInstance';
import { activeUsers } from './activeUsers';

interface SocketNotificationParams {
    userId: string;
    type: "like" | "comment" | "follower" | "block-user" | "unblock-user" | "delete-blog" | "delete-user" | "delete-comment"; 
    message: string;
}

export const sendSocketData = async ({ userId, type, message }: SocketNotificationParams) => {
    const io = getSocketInstance();

    const notificationData = {
        type: type,
        message: message,
    };

    const userSocketId = activeUsers.get(userId);
    if (userSocketId) {
        io.to(userSocketId).emit("notification", notificationData);
    } else {
        // User is offline, save notification in DB
        await Notifications.create({
            userId,
            ...notificationData,
            isRead: false,
        });
    }
}