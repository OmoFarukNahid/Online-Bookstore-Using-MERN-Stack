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

  useEffect(() => {
    // Check authentication status on component mount
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      setIsLoggedIn(true);
    }
  }, []);

  const [book, setBook] = useState([]);

  useEffect(() => {
    // Only fetch books if user is logged in
    if (isLoggedIn) {
      const getBook = async () => {
        try {
          const res = await axios.get("http://localhost:4002/book");
          console.log("Book data:", res.data);
          setBook(res.data);
        } catch (error) {
          console.error("Error fetching book data:", error);
        }
      }
      getBook();
    }
  }, [isLoggedIn]); // Add isLoggedIn as dependency

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
  return (
    <>
      <Navbar />

      <div className="min-h-screen px-2 pt-20 pb-6 dark:bg-gray-900">
        <div className="mt-10 md:mt-20 items-center justify-center text-center hover:scale-120 duration-200">
          <h1 className="text-3xl font-bold text-emerald-500 dark:text-emerald-400 mb-6 md:text-4xl uppercase">
            Welcome back, {user?.name}! {" "}
            <span className="text-rose-400 dark:text-rose-300">Enjoy Learning!</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Here are the courses available...
          </p>
          <Link to="/">
            <button className="mt-6 btn btn-secondary hover:bg-pink-700 dark:hover:bg-pink-800 dark:bg-gray-700 dark:text-white duration-300">
              Back to Home
            </button>
          </Link>
        </div>

        <div className='mt-12 grid grid-cols-1 md:grid-cols-4'>
          {book.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Course;