import { Request, Response } from "express";
import cloudinary from '../../config/cloudinaryConfig';
import fileUpload from "express-fileupload";


export const upload = async (req: Request, res: Response) => {

    if (req.files && req.files.image) {
        const file = req.files.image as fileUpload.UploadedFile;

        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            public_id: `${Date.now()}`,
            resource_type: "auto",
            folder: "images"
        });

        // check image is uploaded successfully or not
        if (result && result.secure_url) {
            const imageData = {
                public_id: result.public_id,
                url: result.secure_url
            }
            return res.status(201).json({ success: true, message: 'image uploaded.', data: imageData });
        }
        return res.status(500).json({ success: false, message: 'image not uploaded.', data: '' });
    }
};


export const updateFile = async (req: Request, res: Response) => {

    const imageId = req.body.imageId;

    try {
        const result = await cloudinary.uploader.destroy(
            imageId,
            { resource_type: "image", invalidate: true }
        );

        if (result.result === "ok") {

            if (req.files && req.files.image) {
                const file = req.files.image as fileUpload.UploadedFile;
        
                const result = await cloudinary.uploader.upload(file.tempFilePath, {
                    public_id: `${Date.now()}`,
                    resource_type: "auto",
                    folder: "images"
                });
        
                if (result && result.secure_url) {
                    const imageData = {
                        public_id: result.public_id,
                        url: result.secure_url
                    }
                    return res.status(201).json({ success: true, message: 'image updated.', data: imageData });
                }
                return res.status(500).json({ success: false, message: 'image not updated.', data: '' });
            }

        } else if (result.result === "not found") {
            return res.status(500).json({ success: false, message: 'file to update not found on Cloudinary.', data: '' });
        } else {
            return res.status(500).json({ success: false, message: 'Failed to delete old file.', error: result.result });
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error occurred while deleting old file:', error: error });
    }
};


export const deleteFile = async (req: Request, res: Response) => {

    const imageId = req.body.imageId;

    try {
        const result = await cloudinary.uploader.destroy(
            imageId,
            { resource_type: "image", invalidate: true }
        );

        if (result.result === "ok") {
            return res.status(500).json({ success: true, message: 'file deleted.', data: '' });
        } else if (result.result === "not found") {
            return res.status(500).json({ success: false, message: 'file not found on Cloudinary.', data: '' });
        } else {
            return res.status(500).json({ success: false, message: 'Failed to delete the file.', error: result.result });
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error occurred while deleting the file:', error: error });
    }
};