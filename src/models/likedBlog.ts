import mongoose, { Schema, Document } from "mongoose";

export interface ILikedBlog extends Document {
    userId: mongoose.Types.ObjectId; // Reference to the user who liked the blog
    blogId: mongoose.Types.ObjectId; // Reference to the blog being liked
    createdAt: Date; // Timestamp for when the like was added
}

const likedBlogSchema = new Schema<ILikedBlog>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        required: true,
    },
}, { timestamps: true, });

const LikedBlog = mongoose.model<ILikedBlog>("LikedBlog", likedBlogSchema);

export default LikedBlog;