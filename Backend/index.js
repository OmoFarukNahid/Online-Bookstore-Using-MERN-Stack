import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bookRoute from "./route/book.route.js";
import authRoute from "./route/auth.route.js";
import googleRoute from "./route/google.route.js"; // <-- ADD THIS LINE
import paginatedBookRoute from "./route/paginatedBook.route.js"; // Add this
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors());
// ADD THIS LINE - it's essential for parsing JSON request bodies
app.use(express.json());

const PORT = process.env.PORT || 4005;
const MONGO_URI = process.env.MONGO_URI;
console.log("MONGO_URI from env:", MONGO_URI);

// connect to MongoDB or any database here
try {
  mongoose.connect(MONGO_URI, {});
  console.log('Connected to MongoDB');
} catch (error) {
  console.error('Error connecting to MongoDB:', error);
}

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// define route
app.use("/book", bookRoute);
app.use("/api/auth", authRoute);
app.use("/api/paginated-books", paginatedBookRoute); // Add this for pagination
app.use("/api/google-books", googleRoute); // <-- ADD THIS LINE

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});