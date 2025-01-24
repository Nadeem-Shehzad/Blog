import { Request, Response } from "express";
import User from '../models/user';
import cloudinary from '../config/cloudinaryConfig';
import fileUpload from "express-fileupload";



export const signUp = async (req: Request, res: Response) => {

    const userData = req.body;
    const user = await User.findUserByEmail(userData.email);

    if (user) {
        return res.status(400).json({ success: false, message: 'User Exist.', data: null });
    }

    const hashedPassword = await User.hashedPassword(userData.password);

    let imageUploadResult = '';
    if (req.files && req.files.image) {
        const file = req.files.image as fileUpload.UploadedFile;
        
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            public_id: `${Date.now()}`,
            resource_type: "auto",
            folder: "images"
        });

        // check image is uploaded successfully or not
        if (result && result.secure_url) {
            imageUploadResult = result.secure_url;
        }
    }

    const newUser = await User.create({
        ...userData,
        password: hashedPassword,
        image: imageUploadResult
    });

    newUser
        ? res.status(201).json({ success: true, message: 'User SignedUp.', data: newUser })
        : res.status(500).json({ success: false, message: 'User not SignedUp.', data: null });
};
