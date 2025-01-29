import mongoose, { Schema, Document } from "mongoose";

export interface IBookMarkBlog extends Document {
    userId: mongoose.Types.ObjectId; 
    blogId: mongoose.Types.ObjectId; 
    createdAt: Date; 
}

const bookMarkBlogSchema = new Schema<IBookMarkBlog>({
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

const BookMarkBlog = mongoose.model<IBookMarkBlog>("BookMarked", bookMarkBlogSchema);

export default BookMarkBlog;