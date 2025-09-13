// backend/route/paginatedBook.route.js
import express from 'express';
import { getPaginatedBooks } from "../controller/book.controller.js";

const router = express.Router();
router.get("/", getPaginatedBooks);
export default router;