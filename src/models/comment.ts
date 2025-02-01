import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  userId: mongoose.Types.ObjectId; 
  blogId: mongoose.Types.ObjectId; 
  comment: string; 
  createdAt: Date; 
  updatedAt: Date; 
}

const commentSchema = new Schema<IComment>({
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
  comment: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Comment = mongoose.model<IComment>("Comment", commentSchema);

export default Comment;