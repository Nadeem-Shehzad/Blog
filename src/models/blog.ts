import mongoose, { Schema, Document } from "mongoose";
import { IBlog } from '../utils/types'

export interface BlogDocument extends IBlog, Document { }

const blogSchema: Schema = new Schema({
    creater_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    title: {
        type: String,
        min: 3,
        max: 25,
        trim: true,
        required: [true, 'Add title'],
    },
    description: {
        type: String,
        max: 100,
        default: ''
    },
    image: {
        public_id: { // needs public_id to delete it from cloudinary
            type: String,
            required: [true, 'image public_id missing!']
        },
        url: {
            type: String,
            required: [true, 'image url missing!']
        }
    },
    tags: {
        type: [String], 
        default: [],
    },
    likes: {
        type: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users',
                required: true,
            },
        }],
        default: []
    },
    comments: {
        type: [{
            commentId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment',
                required: true,
            },
        }],
        default: []
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    }
}, { timestamps: true });

const Blog = mongoose.model<BlogDocument>('Blog', blogSchema);

export default Blog;