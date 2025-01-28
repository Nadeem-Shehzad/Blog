import express from "express";

import { upload, updateFile, deleteFile } from '../controllers/File/exp_controller';

const router = express.Router();

router.post('/upload', upload);
router.put('/update', updateFile);
router.delete('/delete', deleteFile);

export default router;