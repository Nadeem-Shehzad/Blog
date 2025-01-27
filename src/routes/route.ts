import express from "express";

import { upload,deleteFile } from '../controllers/exp_controller';

const router = express.Router();

router.post('/upload', upload);
router.post('/delete', deleteFile);

export default router;