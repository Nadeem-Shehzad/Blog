import mongoose from "mongoose";
import { Server } from "socket.io";
import { activeUsers } from "../utils/activeUsers";
import { Notifications } from "../models/notification";
import User from '../models/user';


const setupSocket = (io: Server): void => {
    io.on("connection", (socket) => {
        console.log(`New user --> ${socket.id} connected`);

        socket.on('join', async (userId: string) => {
            activeUsers.set(userId, socket.id);
            console.log(`User ${userId} is online.`);

            // Fetch the list of authors the reader follows
            const user = await User.findById(userId);
            if(user?.role === 'Reader'){
                if (user && user.following.length > 0) {
                    user.following.forEach((authorId: mongoose.Types.ObjectId) => {
                        socket.join(authorId.toString());
                        console.log(`Reader ${user.username} joined room ${authorId}`);
                    });
                }
            }

            const unreadNotifications = await Notifications.find({ userId, isRead: false });

            if (unreadNotifications.length > 0) {
                const messages = unreadNotifications.map(notification => ({
                    type: notification.type,
                    message: notification.message,
                }));

                io.to(socket.id).emit("notification", messages);

                await Notifications.updateMany(
                    { _id: { $in: unreadNotifications.map(n => n._id) } },
                    { isRead: true }
                );
            }

        });

        socket.on('disconnect', () => {
            activeUsers.forEach((socketId, userId) => {
                if (socketId === socket.id) {
                    activeUsers.delete(userId);
                    console.log(`User ${userId} is offline.`);
                }
            });
        });
    });
}

export default setupSocket;