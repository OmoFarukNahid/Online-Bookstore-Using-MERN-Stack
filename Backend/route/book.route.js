// backend/route/book.route.js
import express from 'express';
import { getBook, getPaginatedBooks } from "../controller/book.controller.js"; // You'll need to update this import

const router = express.Router();
router.get("/", getPaginatedBooks); // Change to use paginated version
export default router;