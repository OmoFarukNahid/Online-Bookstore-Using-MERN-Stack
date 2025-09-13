import React from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Login from "./Login";
import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import { IoIosEye, IoIosEyeOff } from "react-icons/io"; // Import eye icons
import imageCompression from "browser-image-compression";

function SignUp() {
  // State for password visibility
  const [previewImage, setPreviewImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    trigger
  } = useForm();
  // ⭐ added: Cloudinary details
  const CLOUD_NAME = "dzdr5eyt2";   // replace with your cloud name
  const UPLOAD_PRESET = "userbookstrap";       // your unsigned preset

  // ⭐ added: upload function
  const uploadImageToCloudinary = async (file) => {
    try {
      // Compress large files
      const options = {
        maxSizeMB: 2, // limit to 2MB
        maxWidthOrHeight: 1024, // resize if larger than 1024px
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      return res.json();
    } catch (error) {
      console.error("Image upload error:", error);
      throw error;
    }
  };

  // With this:
  const onSubmit = async (data) => {
    try {
      setSignupError("");
      setSignupSuccess("");

      // Remove confirmPassword from data before sending to server
      const { confirmPassword, profilePicture, ...userData } = data;

      // ⭐ Upload image first if selected
      if (profilePicture && profilePicture.length > 0) {
        const uploadRes = await uploadImageToCloudinary(profilePicture[0]);
        userData.avatar = uploadRes.secure_url; // add Cloudinary URL to data
      }

      const response = await fetch("http://localhost:4002/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        setSignupSuccess("Account created successfully! You can now login.");
        // Reset form
        setValue("name", "");
        setValue("email", "");
        setValue("birthDate", null);
        setValue("password", "");
        setValue("confirmPassword", "");
        setValue("profilePicture", null); // ⭐ reset file
        setPreviewImage(null); // Reset preview image
        // Redirect to login after a short delay
        setTimeout(() => {
          document.getElementById('my_modal_45').showModal();
        }, 2000);
      } else {
        setSignupError(result.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setSignupError("Network error. Please try again.");
    }
  };

  const handleDateChange = (date) => {
    setValue("birthDate", date); // Update react-hook-form value
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type only (size will be handled by compression)
      if (!file.type.startsWith("image/")) {
        setSignupError("Please select an image file");
        return;
      }

      // Set the file value for react-hook-form
      setValue("profilePicture", [file], { shouldValidate: true });
      setPreviewImage(URL.createObjectURL(file));
      setSignupError(""); // Clear any previous errors
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Login />

      <main className="flex-grow flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 mt-16">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-emerald-100 dark:border-emerald-900">
            {/* Header */}
            <div className="bg-emerald-500/20 dark:bg-emerald-600/30 p-6 text-center border-b border-emerald-100 dark:border-emerald-700">
              <h2 className="text-3xl font-bold text-emerald-800 dark:text-white">Create Account</h2>
              <p className="text-emerald-600 dark:text-emerald-200 mt-2">
                Join our community today
              </p>
            </div>

            {/* Form */}
            {/* Profile Avatar Upload */}
            <div className="flex justify-center mb-8 mt-6">
              <input
                type="file"
                accept="image/*"
                id="profilePicture"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Upload Container */}
              <label
                htmlFor="profilePicture"
                className="relative w-40 h-40 flex items-center justify-center cursor-pointer group "
              >
                {/* Circular Frame with Gradient Border */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#2d809c] to-orange-300 p-1.5 ">
                  <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Profile Preview"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-1 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span className="text-xs font-medium">Add Photo</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover Overlay with Camera Icon */}
                <div className="absolute inset-0 bg-black/40 bg-opacity-0 group-hover:bg-opacity-40 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                  <div className="bg-white bg-opacity-90 p-2.5 rounded-full transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
              </label>

              {/* Hidden input for react-hook-form */}
              <input
                type="hidden"
                {...register("profilePicture", {
                  required: "Profile picture is required",
                  validate: {
                    // REMOVE THIS fileSize validation since you're compressing automatically
                    fileType: (files) =>
                      !files || !files[0] || files[0].type.startsWith("image/") || "Only image files are allowed",
                  },
                })}
              />
            </div>
            {errors.profilePicture && (
              <p className="text-red-500 text-xs mt-1 text-center -mt-6 mb-4">{errors.profilePicture.message}</p>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="omor faruk nahid"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="john@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email format"
                    }
                  })}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* Birth Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Birth Date
                </label>
                <DatePicker
                  selected={watch("birthDate")}  // Use watch to get the value
                  onChange={(date) => {
                    setValue("birthDate", date, { shouldValidate: true });  // Update form value
                  }}
                  dateFormat="MMMM d, yyyy"
                  placeholderText="Select your birth date"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                  maxDate={new Date()}
                  required
                />
                <input
                  type="hidden"
                  {...register("birthDate", { required: "Birth date is required" })}
                />
                {errors.birthDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.birthDate.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white pr-10"
                    placeholder="••••••••"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      }
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <IoIosEye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
                    ) : (
                      <IoIosEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-20" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white pr-10"
                    placeholder="••••••••"
                    {...register("confirmPassword", {
                      validate: value =>
                        value === watch('password') || "Passwords do not match"
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer "
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <IoIosEye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 " />
                    ) : (
                      <IoIosEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
              {/* Display success/error messages */}
              {signupSuccess && <p className="text-green-500 text-xs mt-1 text-center">{signupSuccess}</p>}
              {signupError && <p className="text-red-500 text-xs mt-1 text-center">{signupError}</p>}

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 shadow-lg shadow-emerald-100 dark:shadow-emerald-900/50 cursor-pointer"
              >
                Create Account
              </button>
            </form>

            <div className="px-6 pb-6 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Already have an account?{" "}
                <button
                  onClick={() => document.getElementById('my_modal_45').showModal()}
                  className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default SignUp;