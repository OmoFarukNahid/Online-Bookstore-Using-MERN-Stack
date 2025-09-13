// backend/route/google.route.js
import express from 'express';
import { getGoogleBooks } from "../controller/google.controller.js";

const router = express.Router();
router.get("/", getGoogleBooks);
export default router;