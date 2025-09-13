import React, { useState } from 'react';
import bookImage from "../assets/book.jpg"; 

function Hero() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    if (newEmail) {
      if (!validateEmail(newEmail)) {
        setEmailError("Please enter a valid email address.");
      } else {
        setEmailError("");
      }
    } else {
      setEmailError("");
    }
  };

  return (
    <div className="flex flex-col md:flex-row p-4 md:p-12 lg:p-24 items-center my-10">
      {/* Left side on desktop, below on mobile */}
      <div className="w-full md:w-1/2 mt-14 md:mt-0 space-y-8 md:pr-12 order-2 md:order-1">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold dark:text-white">
            Hello, welcome here to learn something{" "}
            <span className="dark:text-rose-400">new everyday !!!</span>
          </h1>
          <p style={{ textAlign: "justify" }} className="dark:text-gray-300">
            A bookstore is more than just a place to buy books; it's a sanctuary
            for stories and a hub for community. The comforting scent of paper
            and ink fills the air as you wander through aisles filled with
            countless worlds waiting to be discovered. From classic literature
            to the latest bestsellers, a bookstore offers a quiet escape and a
            tangible connection to the power of the written word. It's a place
            where you can get lost in a good story, find new ideas, and join a
            community of fellow readers who share a passion for the magic found
            between the pages.
          </p>
        </div>

        <div className="flex flex-col mt-8 w-full max-w-sm">
          <div className="flex items-center h-12 w-full rounded-sm bg-white dark:bg-gray-800 shadow-lg">
            <span className="px-3 text-gray-500 dark:text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </span>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              className="flex-grow border-none focus:outline-none focus:ring-0 bg-transparent dark:text-white dark:placeholder-gray-400"
            />
            {email && !emailError && (
              <a
                href={`mailto:omorfaruknahid.cse@gmail.com?subject=Contact from ${email}&body=Hello, my email is ${email}`}
                className="btn btn-sm bg-green-800/60 dark:bg-rose-600 dark:text-white shadow-lg hover:bg-rose-500 duration-300 rounded-sm mr-2"
              >
                Send
              </a>
            )}
          </div>
          {emailError && (
            <p className="text-xs text-red-500/50 dark:text-red-400 mt-1">{emailError}</p>
          )}
        </div>

        <button className="btn btn-secondary dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
          Secondary
        </button>
      </div>
      {/* Right side on mobile, left side on desktop */}
      <div className="w-full md:w-1/2 mt-12 md:mt-0 flex justify-center items-center order-1 md:order-2">
        <div className="w-full">
          <img src={bookImage} className="rounded-2xl" alt="Book" />
        </div>
      </div>
    </div>
  );
}

export default Hero;