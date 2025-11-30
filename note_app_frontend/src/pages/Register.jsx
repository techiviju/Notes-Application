 //  latest UI design
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePassword(password) {
  return password.length >= 6;
}

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const { register } = useAuth();
  const navigate = useNavigate();

  const emailValid = validateEmail(email);
  const passwordValid = validatePassword(password);

  const handleBlur = (field) => setTouched({ ...touched, [field]: true });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!emailValid || !passwordValid) return;
    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);
    if (result.success) {
      navigate("/");
    } else {
      toast.error(result.error || "Unable to create account");
    }
  };
 return (
  <div
    className="flex min-h-screen w-full items-center justify-center bg-[#dde1e7] dark:bg-[#0f172a] transition-colors duration-500"
    style={{
      backgroundImage: "url('/bg-auth.jpg')",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
    }}
  >
    {/* Overlay */}
    <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-0" />

    <div className="relative z-10 flex items-center justify-center w-full min-h-screen px-3">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 md:p-10 rounded-3xl 
                   shadow-[8px_8px_24px_#bebebe,-8px_-8px_24px_#ffffff] 
                   dark:shadow-[8px_8px_24px_#0a0f1a,-8px_-8px_24px_#1e293b]
                   bg-[#dde1e7]/60 dark:bg-[#1e293b]/60 
                   border border-white/20 backdrop-blur-2xl flex flex-col transition-all duration-300"
      >
        {/* Avatar Icon */}
        <div className="flex w-full justify-center pb-6 -mt-16">
          <div className="rounded-full bg-[#dde1e7] dark:bg-[#1e293b] p-4 w-20 h-20 flex items-center justify-center 
                          shadow-[6px_6px_16px_#b8b9be,-6px_-6px_16px_#ffffff] 
                          dark:shadow-[6px_6px_16px_#0a0f1a,-6px_-6px_16px_#334155]">
            <svg
              className="w-10 h-10 text-blue-800 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6" />
            </svg>
          </div>
        </div>

        {/* Headings */}
        <h2 className="text-3xl font-extrabold text-center text-blue-900 dark:text-blue-100 mb-1 drop-shadow-sm">
          Create Your Account
        </h2>
        <p className="mb-8 text-center text-base text-blue-800/80 dark:text-blue-200/70">
          Sign up for <span className="font-semibold">NotesHub</span> and get started.
        </p>

        {/* Inputs */}
        <div className="space-y-6">
          {/* Name */}
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Full Name"
              className="w-full px-4 py-2 rounded-xl 
                         bg-[#dde1e7] dark:bg-[#232c4c] border border-blue-200/40 dark:border-blue-500/20
                         focus:bg-white focus:dark:bg-[#202842] focus:ring-2 focus:ring-blue-500 
                         outline-none transition-all duration-300 text-gray-800 dark:text-gray-100"
            />
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur("email")}
              required
              placeholder="Email Address"
              className={`w-full px-4 py-2 rounded-xl 
                         bg-[#dde1e7] dark:bg-[#232c4c]
                         ${
                           touched.email && !emailValid
                             ? "border-2 border-red-400"
                             : "border border-blue-200/40 dark:border-blue-500/20"
                         }
                         focus:bg-white focus:dark:bg-[#202842] focus:ring-2 focus:ring-blue-500 
                         outline-none transition-all duration-300 text-gray-800 dark:text-gray-100`}
            />
            {touched.email && !emailValid && (
              <div className="text-red-500 text-sm mt-1">
                Please enter a valid email address.
              </div>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur("password")}
              required
              minLength={6}
              placeholder="Password (min 6 chars)"
              className={`w-full px-4 py-2 rounded-xl 
                         bg-[#dde1e7] dark:bg-[#232c4c]
                         ${
                           touched.password && !passwordValid
                             ? "border-2 border-red-400"
                             : "border border-blue-200/40 dark:border-blue-500/20"
                         }
                         focus:bg-white focus:dark:bg-[#202842] focus:ring-2 focus:ring-blue-500 
                         outline-none transition-all duration-300 text-gray-800 dark:text-gray-100`}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-[8px] text-blue-700 dark:text-blue-300"
              onClick={() => setShowPassword((s) => !s)}
            >
              {showPassword ? (
                <svg
                  width={18}
                  height={18}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M1 12C3.5 7.5 8.5 5 12 5s8.5 2.5 11 7c-2.5 4.5-7.5 7-11 7s-8.5-2.5-11-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg
                  width={18}
                  height={18}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M17 17 7 7" />
                  <ellipse cx="12" cy="12" rx="8" ry="5" />
                  <path d="M9.9 4A7.972 7.972 0 0 1 12 5c3.5 0 8.5 2.5 11 7-1.114 1.971-2.619 3.526-4.316 4.543" />
                </svg>
              )}
            </button>
            {touched.password && !passwordValid && (
              <div className="text-red-500 text-sm mt-1">
                Password must be at least 6 characters.
              </div>
            )}
          </div>

          {/* Combined error */}
          {touched.email && touched.password && !emailValid && !passwordValid && (
            <div className="text-red-500 text-sm mt-2 text-center">
              Please enter a valid email and password.
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !emailValid || !passwordValid}
            className="w-full py-2 rounded-xl 
                       bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-800 hover:to-indigo-700
                       text-white font-semibold text-lg shadow-lg transition-all duration-300
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-blue-900/90 dark:text-blue-100 text-base font-medium">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-700 dark:text-blue-300 underline hover:text-indigo-700"
          >
            Sign in
          </Link>
        </div>
      </form>
    </div>
  </div>
);

}
