// backend/controller/google.controller.js
import axios from "axios";

export const getGoogleBooks = async (req, res) => {
  try {
    const { q, startIndex = 0, maxResults = 12 } = req.query;
    const apiKey = 'AIzaSyA-xO5wOZuqW_0eNTuLaqo290r4XN4-Qds';

    const searchQuery = q || "subject:programming";

    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&key=${apiKey}&startIndex=${startIndex}&maxResults=${maxResults}`;

    const response = await axios.get(apiUrl);

    // Check if items exist in the response
    const items = response.data.items || [];

    // In the mapping part of google.controller.js, add:
    const formattedBooks = items.map((item) => ({
      id: item.id,
      name: item.volumeInfo.title,
      image: item.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/128x196?text=No+Image",
      category: item.volumeInfo.categories?.[0] || "General",
      title: item.volumeInfo.subtitle || (item.volumeInfo.description ? item.volumeInfo.description.substring(0, 100) + '...' : 'No description available'),
      Price: "View",
      isGoogleBook: true,
      googleBookUrl: `https://books.google.com/books?id=${item.id}` // Add this line
    }));

    res.status(200).json({
      books: formattedBooks,
      totalItems: response.data.totalItems || 0,
      currentPage: Math.floor(startIndex / maxResults) + 1,
      totalPages: Math.ceil((response.data.totalItems || 0) / maxResults)
    });

  } catch (error) {
    console.log("Error fetching books from Google API:", error);
    res.status(500).json({
      message: "Error fetching from Google Books",
      books: [] // Ensure books array is always returned
    });
  }
};