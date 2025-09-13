import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Login from "./Login";

function Navbar() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const element = document.documentElement;
  const [user, setUser] = useState(null);

  // Handle theme switching
  useEffect(() => {
    if (theme === "dark") {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      element.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme, element]);

  // Check if user is logged in
useEffect(() => {
  const updateUser = () => {
    const userData = localStorage.getItem("user");
    setUser(userData ? JSON.parse(userData) : null);
  };

  updateUser(); // Run on mount
  window.addEventListener("storage", updateUser); // Listen for storage events

  return () => {
    window.removeEventListener("storage", updateUser);
  };
}, []);

  const location = useLocation();
  const isHome = location.pathname === "/";

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle hide/show navbar on scroll (only on Home page)
  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isHome]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  };

  const navItems = (
    <>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/Course">Course</Link></li>
      <li><a>Contact</a></li>
      <li><a>About</a></li>
    </>
  );

  return (
    <div
      className={`navbar fixed top-0 left-0 w-full z-50 shadow-sm rounded-none bg-emerald-300/80 backdrop-blur-sm transition-transform duration-300
        ${isHome ? (isVisible ? "translate-y-0" : "-translate-y-full") : "translate-y-0"}
      `}
    >
      {/* Logo */}
      <div className="navbar-start">
        <Link to="/" className="text-2xl font-bold cursor-pointer">Bookstrap</Link>
      </div>

      {/* Right side */}
      <div className="navbar-end space-x-4">
        {/* Menu items */}
        <div className="hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{navItems}</ul>
        </div>

        {/* Search Bar */}
        <div className="hidden md:block border-1 border-gray-300 rounded-md">
          <label className="input border-0 bg-transparent focus-within:outline-none focus-within:ring-0 cursor-pointer">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input
              type="search"
              className="grow focus:outline-none focus:ring-0"
              placeholder="Search"
            />
          </label>
        </div>

        {/* Dark Theme Toggle */}
        <div>
          <label className="toggle toggle-sm text-base-content">
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={() => setTheme(theme === "light" ? "dark" : "light")}
              className="theme-controller"
            />
            <svg
              aria-label="sun"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m6.34 17.66-1.41 1.41"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
              </g>
            </svg>
            <svg
              aria-label="moon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
              </g>
            </svg>
          </label>
        </div>

        {/* User Profile or Login Button */}
        {user ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full bg-primary text-white flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <span className="justify-between">
                  {user.name}
                  <span className="badge">User</span>
                </span>
              </li>
              <li>
                <a>Add curt</a>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        ) : (
          <div>
            <a className="bg-black text-white px-3 py-2 rounded-md hover:bg-slate-700 duration-300 cursor-pointer"
              onClick={() => document.getElementById('my_modal_45').showModal()}>
              Login
            </a>
            <Login />
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;