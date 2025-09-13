// backend/controller/paginatedBook.controller.js
import Book from "../model/book.model.js";

export const getPaginatedBooks = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query; // Default to page 1, 12 items per page
    const skip = (page - 1) * limit;

    const books = await Book.find().skip(skip).limit(parseInt(limit));
    const totalItems = await Book.countDocuments();

    res.status(200).json({
      books,
      totalItems,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalItems / limit)
    });
  } catch (error) {
    console.log("Error fetching paginated books:", error);
    res.status(500).json(error);
  }
};