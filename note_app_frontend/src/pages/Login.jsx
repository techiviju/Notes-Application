import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

// Helper functions
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePassword(password) {
  return password.length >= 6;
}
function comingSoon() {
  toast("This feature will be available soon!", { position: "top-center" });
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [restricted, setRestricted] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const { login } = useAuth();
  const navigate = useNavigate();

  const emailValid = validateEmail(email);
  const passwordValid = validatePassword(password);

  const handleBlur = (field) => setTouched({ ...touched, [field]: true });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!emailValid || !passwordValid) return;
    setLoading(true);
    setRestricted(false);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate("/");
    } else if (result.error?.toLowerCase().includes("restricted")) {
      setRestricted(true);
      toast.error("Your account is restricted. Please contact support.");
    } else {
      toast.error(result.error || "Unable to sign in");
    }
  };

  const isDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

  return (
  <div
    className="flex min-h-screen w-full items-center justify-center 
               bg-[#dde1e7] dark:bg-[#0f172a] transition-colors duration-500"
    style={{
      backgroundImage: "url('/bg-auth.jpg')",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
    }}
  >
    {/* Overlay for better text contrast */}
    <div className="absolute inset-0 bg-black/40 dark:bg-black/60 z-0" />

    <div className="relative z-10 flex items-center justify-center w-full min-h-screen px-2">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-7 md:p-10 rounded-3xl 
                   bg-[#dde1e7]/50 dark:bg-[#1e293b]/80 
                   backdrop-blur-2xl border border-white/20 
                   shadow-[8px_8px_24px_#bebebe,-8px_-8px_24px_#fff] 
                   dark:shadow-[6px_6px_20px_#0f172a,-6px_-6px_20px_#334155]
                   transition-all duration-500 flex flex-col"
      >
        {/* User icon */}
        <div className="flex w-full justify-center pb-6 -mt-16">
          <div className="rounded-full bg-[#dde1e7] dark:bg-[#1e293b] p-4 w-20 h-20 
                          flex items-center justify-center 
                          shadow-[8px_8px_15px_#a7aaaf,-8px_-8px_15px_#fff] 
                          dark:shadow-[6px_6px_15px_#0f172a,-6px_-6px_15px_#334155]">
            <svg className="w-10 h-10 text-blue-800 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" />
              <path d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6" />
            </svg>
          </div>
        </div>

        {/* Welcome text */}
        <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-900 dark:text-blue-200 mb-1">
          Welcome back
        </h2>
        <p className="mb-8 text-center text-base text-blue-800/80 dark:text-blue-200/80">
          Please sign in to continue.
        </p>

        {/* Inputs */}
        <div className="space-y-6">
          {/* Email input */}
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={() => handleBlur("email")}
              required
              placeholder="Email address"
              className={`w-full px-11 py-2 rounded-xl 
                          bg-[#dde1e7] dark:bg-[#1e293b] 
                          text-gray-900 dark:text-gray-100 
                          border ${touched.email && !emailValid ? "border-red-400" : "border-blue-200 dark:border-blue-800"} 
                          focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300`}
                          disabled={restricted}
            />
            <span className="absolute left-3 top-[11px] opacity-60 dark:text-gray-300">
              <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 8L12 16 21 8" /><rect x="3" y="8" width="18" height="8" rx="2" /></svg>
            </span>
          </div>

          {/* Password input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onBlur={() => handleBlur("password")}
              required
              placeholder="Password"
              className={`w-full px-11 py-2 rounded-xl 
                          bg-[#dde1e7] dark:bg-[#1e293b] 
                          text-gray-900 dark:text-gray-100 
                          border ${touched.password && !passwordValid ? "border-red-400" : "border-blue-200 dark:border-blue-800"} 
                          focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300`}
                          disabled={restricted}
            />
           
            <span className="absolute left-3 top-[11px] opacity-60 dark:text-gray-300">
              <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="8" ry="5" /><path d="M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0z" /></svg>
            </span>
            <button
              type="button"
              className="absolute right-3 top-[8px] text-blue-700 dark:text-blue-300"
              onClick={() => setShowPassword(s => !s)}
            >
              {showPassword ? (
                <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12C3.5 7.5 8.5 5 12 5s8.5 2.5 11 7c-2.5 4.5-7.5 7-11 7s-8.5-2.5-11-7z" /><circle cx="12" cy="12" r="3" /></svg>
              ) : (
                <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 17 7 7" /><ellipse cx="12" cy="12" rx="8" ry="5" /></svg>
              )}
            </button>
              {touched.password && !passwordValid && (
                <div className="text-red-600 text-sm mt-1">Password must be at least 6 characters.</div>
              )}
          </div>
        
            {restricted && (
  <div
    className="mt-3 bg-red-100/80 dark:bg-red-900/40 
               border border-red-300/70 dark:border-red-700/70 
               text-red-700 dark:text-red-300 
               rounded-xl py-3 px-5 text-center font-medium 
               shadow-sm backdrop-blur-md transition-all duration-300"
  >
    <span className="font-semibold">Your account is restricted.</span> <br />
    Please{" "}
    <a
      className="underline font-semibold hover:text-red-500 dark:hover:text-red-200 transition-colors"
      href="mailto:shreyashvairagade29@gmail.com"
    >
      contact admin
    </a>.
  </div>
)}
          {/* Submit */}
          <button
            type="submit"
            disabled={loading || restricted || !emailValid || !passwordValid}
            className="w-full py-2 rounded-xl font-bold text-lg 
                       bg-gradient-to-r from-blue-600 to-indigo-500 
                       hover:from-blue-700 hover:to-indigo-600 
                       text-white shadow-lg transition-all duration-300 
                       disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center mt-6">
          <span className="border-t border-blue-400 w-1/4"></span>
          <span className="mx-3 text-blue-800/80 dark:text-blue-200/60 text-xs">
            OR CONTINUE WITH
          </span>
          <span className="border-t border-blue-400 w-1/4"></span>
        </div>

                 {/* Social buttons group (light + dark theme friendly) */}
<div className="flex items-center justify-center gap-4 mt-4">
  {/* Google */}
  <button
    type="button"
    aria-label="Sign in with Google"
    onClick={comingSoon}
    className="p-2 rounded-lg bg-[#dde1e7] dark:bg-[#1e293b] text-blue-800 dark:text-blue-200 
               shadow-[6px_6px_16px_#b8b9be,-6px_-6px_16px_#ffffff] 
               dark:shadow-[6px_6px_16px_#0f172a,-6px_-6px_16px_#334155]
               transition-all duration-300 hover:scale-105"
  >
    <svg width="24" height="24" viewBox="0 0 24 24">
      <g>
        <path d="M21.5 11.233c0-.797-.072-1.56-.206-2.294H11v4.334h5.91c-.255 1.38-1.03 2.55-2.196 3.34v2.78h3.553c2.084-1.92 3.293-4.75 3.293-8.16z" fill="#4285F4"/>
        <path d="M11 22c2.97 0 5.465-.983 7.287-2.668l-3.553-2.78c-.98.66-2.228 1.05-3.734 1.05-2.87 0-5.302-1.93-6.179-4.517H2.183v2.84C3.998 20.53 7.701 22 11 22z" fill="#34A853"/>
        <path d="M4.821 13.085c-.22-.663-.345-1.366-.345-2.085s.125-1.422.345-2.085V6.09H2.183C1.427 7.56 1 9.22 1 11c0 1.78.427 3.44 1.183 4.91l2.821-2.195.817-.63z" fill="#FBBC05"/>
        <path d="M11 4.084c1.628 0 3.079.557 4.22 1.637l3.164-3.162C17.436 2.094 14.969 1 11 1 7.7 1 3.998 2.79 2.183 6.09l2.817 2.195C5.697 5.564 8.13 4.084 11 4.084z" fill="#EA4335"/>
      </g>
    </svg>
  </button>

  {/* GitHub */}
  <button
    type="button"
    aria-label="Sign in with GitHub"
    onClick={comingSoon}
    className="p-2 rounded-lg bg-[#dde1e7] dark:bg-[#1e293b] text-blue-800 dark:text-gray-200 
               shadow-[6px_6px_16px_#b8b9be,-6px_-6px_16px_#ffffff] 
               dark:shadow-[6px_6px_16px_#0f172a,-6px_-6px_16px_#334155]
               transition-all duration-300 hover:scale-105"
  >
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.4187 2.8657 8.1668 6.8398 9.4891.4994.0919.6828-.2166.6828-.4816 0-.2387-.0088-.8211-.0124-1.6114-2.7827.6047-3.3699-1.342-3.3699-1.342-.4545-1.1547-1.1091-1.4623-1.1091-1.4623-.906-.6193.0689-.6071.0689-.6071 1.0021.0705 1.529.975 1.529.975.8909 1.5262 2.3401 1.0869 2.9094.8313.091-.6457.3487-1.0869.6343-1.3377-2.2208-.2531-4.5554-1.1126-4.5554-4.9484 0-1.0926.3898-1.9889 1.0297-2.6884-.1032-.2533-.4462-1.2736.0986-2.6563 0 0 .8405-.2691 2.7534 1.0257.7982-.2286 1.6551-.3422 2.5076-.3467.8525.0045 1.7094.1181 2.5081.3467 1.9115-1.2948 2.7507-1.0257 2.7507-1.0257.5452 1.3827.2022 2.403.099 2.6563.6405.6995 1.0289 1.5958 1.0289 2.6884 0 3.8431-2.3376 4.6926-4.5632 4.9413.3593.3096.6783.9208.6783 1.8559 0 1.3384-.0127 2.4197-.0127 2.7496 0 .2677.1802.5775.6877.4792C19.1344 20.1636 22 16.4197 22 12c0-5.52-4.48-10-10-10z"/>
    </svg>
  </button>

  {/* Twitter */}
  <button
    type="button"
    aria-label="Sign in with Twitter"
    onClick={comingSoon}
    className="p-2 rounded-lg bg-[#dde1e7] dark:bg-[#1e293b] text-blue-800 dark:text-blue-300 
               shadow-[6px_6px_16px_#b8b9be,-6px_-6px_16px_#ffffff] 
               dark:shadow-[6px_6px_16px_#0f172a,-6px_-6px_16px_#334155]
               transition-all duration-300 hover:scale-105"
  >
    <svg width="22" height="22" viewBox="0 0 24 24">
      <path fill="#1DA1F2" d="M22.46 6c-.77.35-1.6.59-2.47.69a4.21 4.21 0 0 0 1.88-2.33c-.8.47-1.68.82-2.62.99C17.82 4.93 16.72 4.3 15.52 4.3c-2.3 0-4.17 1.87-4.17 4.17 0 .33.04.66.1.97-3.47-.17-6.55-1.84-8.61-4.36-.36.62-.57 1.33-.57 2.09 0 1.44.73 2.72 1.86 3.46-.68-.02-1.32-.21-1.88-.52v.05c0 2.01 1.43 3.68 3.33 4.06-.35.09-.71.14-1.08.14-.26 0-.52-.02-.77-.07.52 1.64 2.04 2.82 3.83 2.85C5.62 19.29 2.92 20.2 0 20.12c2.92 1.87 6.4 2.97 10.18 2.97 12.22 0 18.87-10.12 18.87-18.91 0-.29-.01-.58-.02-.86A13.47 13.47 0 0 0 24 4.59z"/>
    </svg>
  </button>
</div>

        {/* Sign-up link */}
        <div className="mt-6 text-center text-blue-900/90 dark:text-blue-100 text-base font-semibold">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-800 dark:text-blue-300 underline hover:text-indigo-700">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  </div>
);

}


