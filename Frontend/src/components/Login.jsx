import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(""); // ✅ success text inside modal

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoginError("");
      setLoginSuccess("");

      const response = await fetch("http://localhost:4002/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // ✅ Save user
        localStorage.setItem("user", JSON.stringify(result));
        console.log("Login successful:", result);

        // ✅ show success *inside* modal (no popup)
        setLoginSuccess("Login successful!");

        // ✅ after ~2s, close modal and decide where to go
        const previousPath = sessionStorage.getItem("redirectAfterLogin");

        setTimeout(() => {
          // close the modal
          const dlg = document.getElementById("my_modal_45");
          if (dlg?.close) dlg.close();

          if (previousPath === "/Course") {
            // if they came from Course prompt, go there
            sessionStorage.removeItem("redirectAfterLogin");
            if (window.location.pathname === "/Course") {
              window.location.reload();
            } else {
              window.location.href = "/Course";
            }
          } else {
            // stay on current page and refresh navbar state
            window.dispatchEvent(new Event("storage"));
          }
        }, 700);
      } else {
        setLoginError(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Network error. Please try again.");
    }
  };

  return (
    <>
      <dialog id="my_modal_45" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-emerald-400/90 dark:bg-emerald-600/80 shadow-xl rounded-xl p-4 sm:p-6 md:p-8">
          {/* Close button (separate from form) */}
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-800 dark:text-white">
              ✕
            </button>
          </form>

          {/* Header */}
          <h3 className="font-bold text-2xl text-center text-gray-800 dark:text-white">
            Sign In
          </h3>
          <p className="py-2 text-center text-gray-700 dark:text-gray-200">
            Welcome back! Please enter your details.
          </p>

          {/* ✅ Success message inside modal */}
          {loginSuccess && (
            <div className="mt-2 mb-2 w-full rounded-md bg-green-600/90 text-white text-center py-2 font-semibold">
              ✅ {loginSuccess}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            {/* Email */}
            <div>
              <label className="label text-sm font-medium text-black dark:text-gray-200">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full bg-white/90 dark:bg-gray-700/90 dark:text-white"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative mb-2">
              <label className="label text-sm font-medium text-black dark:text-gray-200">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="input input-bordered w-full bg-white/90 dark:bg-gray-700/90 dark:text-white pr-10"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 z-10 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <IoIosEye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
                  ) : (
                    <IoIosEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Display login error */}
            {loginError && (
              <p className="text-red-700 font-medium text-sm text-center">{loginError}</p>
            )}

            {/* Submit Button */}
            <div className="mt-2">
              <button
                type="submit"
                className="btn btn-primary w-full bg-cyan-600 dark:bg-cyan-600 dark:text-black text-black dark:border-emerald-700 border-emerald-700"
              >
                Sign In
              </button>
            </div>
          </form>

          {/* Footer */}
          <p className="text-sm text-center mt-4 text-black dark:text-gray-200">
            Don't have an account?{" "}
            <Link
              to="/SignUp"
              className="font-semibold text-blue-600 dark:text-blue-300 hover:underline"
              onClick={() => document.getElementById("my_modal_45").close()}
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Modal backdrop */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}

export default Login;
