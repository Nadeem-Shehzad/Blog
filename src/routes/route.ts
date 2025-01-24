import express from "express";

import { signUp } from '../controllers/exp_controller';

const router = express.Router();

router.post('/signup', signUp);

export default router;