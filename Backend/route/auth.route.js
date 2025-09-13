import express from 'express';
import { registerUser, loginUser, getMe } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:id", getMe); // Get user by ID

export default router;