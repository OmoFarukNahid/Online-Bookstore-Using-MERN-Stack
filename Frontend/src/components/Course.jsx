import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import Card from '../components/Card'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

function Course() {
  // Check if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const booksPerPage = 50; // Number of books to show per page

  useEffect(() => {
    // Check authentication status on component mount
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      setIsLoggedIn(true);
    }
  }, []);



  useEffect(() => {
    if (isLoggedIn) {
      getAllBooks(currentPage);
    }
  }, [isLoggedIn, currentPage]);

const getAllBooks = async (page) => {
  setLoading(true);
  try {
    const [myBooksRes, googleBooksRes] = await Promise.all([
      axios.get(`http://localhost:4002/api/paginated-books?page=${page}&limit=${10}`), // ← mongodb
      axios.get(`http://localhost:4002/api/google-books?startIndex=${(page - 1) * 40}&maxResults=${40}`) // ← google books
    ]);

      console.log("MongoDB Response:", myBooksRes.data);
      console.log("Google API Response:", googleBooksRes.data);

      // Get MongoDB books
      const mongoBooks = Array.isArray(myBooksRes.data) ? myBooksRes.data : (myBooksRes.data.books || []);

      // Get Google books
      const googleBooks = googleBooksRes.data.books || googleBooksRes.data.items || [];

      // Combine books
      const allBooks = [...mongoBooks, ...googleBooks];
      setBooks(allBooks);

      // Calculate REAL total pages (Google API lies about totalItems)
      const googleTotalItems = googleBooksRes.data.totalItems || 0;

      // Google API actually only returns max ~400 results, so cap it
      const realMaxGoogleResults = Math.min(googleTotalItems, 400);
      const realGoogleTotalPages = Math.ceil(realMaxGoogleResults / 40);

      // Use the real page count
      setTotalPages(realGoogleTotalPages);

      // If we're beyond the real page limit, go back to page 1
      if (page > realGoogleTotalPages && page > 1) {
        setCurrentPage(1);
      }

    } catch (error) {
      console.error("Error fetching book data:", error);
      try {
        const fallbackRes = await axios.get("http://localhost:4002/book");
        setBooks(Array.isArray(fallbackRes.data) ? fallbackRes.data : []);
        setTotalPages(1);
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
        setBooks([]);
        setTotalPages(1);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    // Don't allow going beyond reasonable limits
    const maxReasonablePage = 10; // Google API won't return more than ~10 pages
    const safePage = Math.min(newPage, maxReasonablePage);

    if (safePage >= 1 && safePage <= totalPages) {
      setCurrentPage(safePage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn btn-outline btn-primary btn-sm md:btn-md disabled:opacity-50"
      >
        ← Previous
      </button>
    );

    // First page and ellipsis if needed
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="btn btn-sm md:btn-md btn-outline"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis-start" className="px-2 py-2">...</span>
        );
      }
    }

    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`btn btn-sm md:btn-md ${currentPage === i ? 'btn-primary' : 'btn-outline'}`}
        >
          {i}
        </button>
      );
    }

    // Last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="ellipsis-end" className="px-2 py-2">...</span>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="btn btn-sm md:btn-md btn-outline"
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn btn-outline btn-primary btn-sm md:btn-md disabled:opacity-50"
      >
        Next →
      </button>
    );

    return buttons;
  };



  // Show login prompt if not authenticated
  if (!isLoggedIn) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen px-2 pt-20 pb-6 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Login Required</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Please login to access our courses
            </p>
            <button
              onClick={() => {
                sessionStorage.setItem('redirectAfterLogin', '/Course'); // ✅ Set redirect path
                document.getElementById('my_modal_45').showModal(); // ✅ Open login modal
              }}
              className="btn btn-primary mr-4"
            >
              Login
            </button>
            <Link to="/SignUp">
              <button className="btn btn-secondary">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Original course content for logged-in users
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen px-2 pt-20 pb-6 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <span className="loading loading-infinity loading-lg text-emerald-500"></span>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your library...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  return (
     <>
    <Navbar />

    <div className="min-h-screen px-2 pt-20 pb-6 dark:bg-gray-900"> {/* ← ADD THIS CONTAINER DIV */}
      <div className="mt-10 md:mt-20 items-center justify-center text-center hover:scale-120 duration-200">
        <h1 className="text-3xl font-bold text-emerald-500 dark:text-emerald-400 mb-4 md:text-4xl uppercase">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-rose-400 dark:text-rose-300 text-lg mb-4">
          Enjoy Learning!
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Page {currentPage} of {totalPages} • Showing {books.length} books
        </p>

        {/* Add this info message */}
        {totalPages <= 10 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Google Books API shows first 400 results only
          </p>
        )}

        <Link to="/">
          <button className="mt-6 btn btn-secondary hover:bg-pink-700 dark:hover:bg-pink-800 dark:bg-gray-700 dark:text-white duration-300">
            Back to Home
          </button>
        </Link>
      </div>

      {/* Grid for all books */}
      <div className='mt-12 grid grid-cols-1 md:grid-cols-4'>
        {Array.isArray(books) && books.length > 0 ? (
          books.map((item) => (
            <Card key={item.id} item={item} />
          ))
        ) : (
          <div className="col-span-4 text-center py-12">
            <p className="text-gray-500">No books found. Please try again later.</p>
          </div>
        )}
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <div className="join">
            {renderPaginationButtons()}
          </div>
        </div>
      )}
    </div> {/* ← THIS IS THE CORRECT CLOSING DIV */}

    <Footer />
  </>
  )
}

export default Course;