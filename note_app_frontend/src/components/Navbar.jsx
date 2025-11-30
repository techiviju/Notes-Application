//  mobile
import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getAvatarSrc } from "../services/avatar";

const Navbar = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Close dropdown on outside click (desktop menu)
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowUserMenu(false);
    };
    if (showUserMenu) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showUserMenu]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setMobileMenuOpen(false);
  };

  const navLinks = (
    <>
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            isActive
              ? "bg-blue-100 text-blue-800 md:bg-white/30 md:text-white shadow-lg neumorph-pill"
              : "text-blue-700 md:text-blue-100 hover:bg-blue-50 md:hover:bg-white/10 hover:text-blue-900 md:hover:text-white"
          }`
        }
        onClick={() => setMobileMenuOpen(false)}
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          All Notes
        </div>
      </NavLink>
      <Link
        to="/new"
        className="block bg-blue-600 text-white my-2 md:my-0 hover:bg-blue-700 px-5 py-2 rounded-xl text-sm font-semibold shadow-md neumorph-pill hover:scale-105 transition"
        onClick={() => setMobileMenuOpen(false)}
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Note
        </div>
      </Link>
      <button
        onClick={toggleTheme}
        className="block md:inline-block p-2 ml-1 rounded-xl neumorph-icon-inner bg-white/30 border border-white/60 shadow-md hover:bg-blue-100 md:hover:bg-white/20 transition"
        title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {theme === "dark" ? (
          <svg className="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>
    </>
  );

  const userMenuDropdown = (
    <div
      ref={menuRef}
      className="absolute right-0 mt-2 w-64 rounded-2xl border border-blue-100 dark:border-blue-900 neumorph-modal shadow-2xl py-2 bg-white/90 dark:bg-[#18233d] backdrop-blur-lg animate-fade-in"
    >
      <div className="px-4 py-3 border-b border-blue-100 dark:border-blue-900">
        <div className="flex items-center gap-3">
          <img
            src={getAvatarSrc(user?.profilePicture)}
            onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = "/default-avatar.png"; }}
            alt={user?.name || "User"}
            className="w-12 h-12 rounded-full object-cover shadow-md"
          />
          <div>
            <div className="font-semibold text-slate-800 dark:text-blue-50">{user?.name || user?.email?.split("@")[0] || "User"}</div>
            <div className="text-sm text-blue-400 dark:text-blue-300">{user?.email || "user@example.com"}</div>
          </div>
        </div>
      </div>
      <div className="py-2">
        <button
          onClick={() => { navigate("/profile"); setShowUserMenu(false); setMobileMenuOpen(false); }}
          className="w-full px-4 py-2 text-left text-sm text-blue-700 dark:text-blue-100 hover:bg-blue-50 dark:hover:bg-[#24345a] hover:text-blue-900 dark:hover:text-blue-300 flex items-center gap-3"
        >
          My Profile
        </button>
        <button
          onClick={() => { navigate("/settings"); setShowUserMenu(false); setMobileMenuOpen(false); }}
          className="w-full px-4 py-2 text-left text-sm text-blue-700 dark:text-blue-100 hover:bg-blue-50 dark:hover:bg-[#24345a] hover:text-blue-900 dark:hover:text-blue-300 flex items-center gap-3"
        >
          Settings
        </button>
        {user?.roles?.includes("ADMIN") && (
          <button
            onClick={() => { navigate("/admin"); setShowUserMenu(false); setMobileMenuOpen(false); }}
            className="w-full px-4 py-2 text-left text-sm text-indigo-600 dark:text-indigo-200 hover:bg-indigo-50 dark:hover:bg-[#2b2f52] flex items-center gap-3"
          >
            Admin Panel
          </button>
        )}
      </div>
      <div className="border-t border-blue-100 dark:border-blue-900 pt-2">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-[#301921] flex items-center gap-3 font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );

  const getDrawerBg = () =>
    theme === "dark"
      ? "bg-gradient-to-br from-slate-900/80 via-blue-900/80 to-indigo-900/60 backdrop-blur-2xl"
      : "bg-gradient-to-br from-white/90 via-blue-100/90 to-blue-200/70 backdrop-blur-2xl";

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-xl neumorph-header transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative neumorph-icon">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-md group-hover:bg-white/30 transition-all"></div>
              <div className="relative bg-white/10 p-2 rounded-xl group-hover:scale-110 transition-transform flex items-center justify-center neumorph-icon-inner">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white tracking-tight">NotesHub</span>
              <span className="text-xs text-blue-100">Your Digital Workspace</span>
            </div>
          </Link>

          {/* Hamburger for mobile */}
          <div className="md:hidden ml-auto flex items-center gap-2">
            <button
              className="p-2 rounded-md text-white hover:bg-blue-100 hover:text-blue-800 focus:outline-none"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Open Menu"
            >
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
            </button>
            {isAuthenticated && (
              <img
                src={getAvatarSrc(user?.profilePicture)}
                onClick={() => setShowUserMenu(!showUserMenu)}
                onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = "/default-avatar.png"; }}
                alt={user?.name || "User"}
                className="w-9 h-9 rounded-full object-cover border shadow cursor-pointer"
              />
            )}
          </div>

          {/* Desktop nav links and user menu */}
          <div className="hidden md:flex items-center gap-3">
            {navLinks}
            {isAuthenticated && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu((v) => !v)}
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-2xl neumorph-pill transition-all group"
                >
                  <img
                    src={getAvatarSrc(user?.profilePicture)}
                    onError={e => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/default-avatar.png";
                    }}
                    alt={user?.name || "User"}
                    className="w-10 h-10 rounded-full object-cover border shadow"
                  />
                  <div className="text-left hidden lg:block">
                    <div className="text-sm font-semibold text-white">{user?.name || user?.email?.split("@")[0] || "User"}</div>
                    <div className="text-xs text-blue-100">{user?.email || "user@example.com"}</div>
                  </div>
                  <svg className={`w-4 h-4 text-white transition-transform ${showUserMenu ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showUserMenu && userMenuDropdown}
              </div>
            )}
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setMobileMenuOpen(false)}></div>
        )}
        <div className={`md:hidden fixed top-0 right-0 z-50 transition-transform duration-300 transform 
          ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"} 
          w-80 h-full border-l border-blue-200 dark:border-blue-900 shadow-xl flex flex-col
          ${getDrawerBg()}`}>
          <button className="absolute top-2 right-2 text-blue-900 dark:text-white" onClick={() => setMobileMenuOpen(false)}>
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex flex-col gap-4 mt-10 p-2">
            {navLinks}
            {isAuthenticated && (
              <div className="relative flex flex-col gap-2 mt-2">
                <div className="flex items-center gap-3 mx-3 mt-2">
                  <img
                    src={getAvatarSrc(user?.profilePicture)}
                    onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = "/default-avatar.png"; }}
                    alt={user?.name || "User"}
                    className="w-10 h-10 rounded-full object-cover border shadow"
                  />
                  <div>
                    <div className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-blue-900"}`}>{user?.name || user?.email?.split("@")[0] || "User"}</div>
                    <div className={`text-xs ${theme === "dark" ? "text-blue-100" : "text-blue-500"}`}>{user?.email || "user@example.com"}</div>
                  </div>
                </div>
                <button
                  onClick={() => { navigate("/profile"); setMobileMenuOpen(false); }}
                  className={`w-full px-3 py-2 text-left text-sm ${theme === "dark" ? "text-white hover:bg-blue-800" : "text-blue-800 hover:bg-blue-50"} rounded-lg transition`}
                >My Profile</button>
                <button
                  onClick={() => { navigate("/settings"); setMobileMenuOpen(false); }}
                  className={`w-full px-3 py-2 text-left text-sm ${theme === "dark" ? "text-white hover:bg-blue-800" : "text-blue-800 hover:bg-blue-50"} rounded-lg transition`}
                >Settings</button>
                {user?.roles?.includes("ADMIN") && (
                  <button
                    onClick={() => { navigate("/admin"); setMobileMenuOpen(false); }}
                    className={`w-full px-3 py-2 text-left text-sm ${theme === "dark" ? "text-indigo-200 hover:bg-indigo-700" : "text-indigo-700 hover:bg-indigo-100"} rounded-lg transition`}
                  >Admin Panel</button>
                )}
                <button
                  onClick={handleLogout}
                  className={`w-full px-3 py-2 text-left text-sm font-semibold ${theme === "dark" ? "text-red-200 hover:bg-red-700" : "text-red-700 hover:bg-red-100"} rounded-lg transition`}
                >Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
