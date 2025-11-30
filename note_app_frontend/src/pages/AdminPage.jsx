//  mobile version
import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { getAvatarSrc } from "../services/avatar";
import { Link } from "react-router-dom";

// Glassmorphic base styles for cards
const GLASS = "bg-white/30 dark:bg-[#2c365a]/40 backdrop-blur-lg border border-white/40 dark:border-blue-900 shadow-2xl hover:shadow-blue-200/40 dark:hover:shadow-blue-900/60 transition-all duration-300";

// Icon styles
const CARD_ICON_STYLE =
  "w-9 h-9 rounded-full flex items-center justify-center bg-white/50 dark:bg-[#232b4a]/70 shadow text-xl mx-auto mb-3";

// Card icons
const cardIcons = {
  users: (
    <svg className={CARD_ICON_STYLE + " text-blue-500"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm2 4a6 6 0 10-12 0 6 6 0 0012 0zm4 0a2 2 0 11-4 0 2 2 0zm-16 0a2 2 0 11-4 0 2 2 0z"/>
    </svg>
  ),
  admins: (
    <svg className={CARD_ICON_STYLE + " text-yellow-500"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="7" r="4" strokeWidth={2} />
      <path strokeWidth={2} d="M5.5 21c0-3.5 3-6.5 6.5-6.5s6.5 3 6.5 6.5" />
    </svg>
  ),
  notes: (
    <svg className={CARD_ICON_STYLE + " text-green-500"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="5" y="5" width="14" height="14" rx="2" strokeWidth={2} />
      <path strokeWidth={2} d="M9 9h6M9 13h6" />
    </svg>
  ),
  restricted: (
    <svg className={CARD_ICON_STYLE + " text-indigo-500"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
};

export default function AdminPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.roles?.includes("ADMIN");

  // Fetch admin stats
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch admin stats");
      } finally {
        setLoading(false);
      }
    }
    if (isAdmin) fetchStats();
  }, [isAdmin]);

  // Unauthorized user
  if (!isAdmin) {
    return (
      <div className="text-center text-red-600 py-10 font-semibold">
        Only admins can access this page.
      </div>
    );
  }

  // Loading state
  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-bold text-blue-700 dark:text-blue-200">
        Loading admin stats...
      </div>
    );
  }

  // Stat cards configuration
  const statCards = [
    {
      label: "Users",
      value: stats.totalUsers,
      bg: "bg-blue-100/40 dark:bg-blue-950/60",
      color: "text-blue-800 dark:text-blue-100",
      icon: cardIcons.users,
    },
    {
      label: "Admins",
      value: stats.totalAdmins,
      bg: "bg-yellow-100/40 dark:bg-yellow-950/60",
      color: "text-yellow-800 dark:text-yellow-100",
      icon: cardIcons.admins,
    },
    {
      label: "Notes",
      value: stats.totalNotes,
      bg: "bg-green-100/40 dark:bg-green-950/60",
      color: "text-green-800 dark:text-green-100",
      icon: cardIcons.notes,
    },
    {
      label: "Restricted",
      value: stats.restrictedUsers,
      bg: "bg-indigo-100/40 dark:bg-indigo-950/60",
      color: "text-indigo-800 dark:text-indigo-100",
      icon: cardIcons.restricted,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50/80 dark:from-[#191f33] to-white/60 dark:to-[#293257] p-3 py-7 sm:p-6 lg:p-10 rounded-2xl shadow-2xl border border-blue-100/60 dark:border-blue-900 mt-6 mb-12 transition-all">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-700 dark:text-blue-200 mb-7">
        Admin Dashboard
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {statCards.map((s) => (
          <div
            key={s.label}
            className={
              GLASS +
              ` relative overflow-hidden p-5 rounded-2xl shadow ${s.bg} ${s.color} text-center group hover:scale-[1.03] hover:shadow-lg`
            }
          >
            <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{background:"radial-gradient(ellipse at 60% 10%,rgba(255,255,255,0.27) 0%,rgba(255,255,255,0.02) 100%)"}} />
            {s.icon}
            <h2 className="text-2xl sm:text-3xl font-extrabold relative">{s.value}</h2>
            <p className="text-base md:text-lg font-medium opacity-90 relative">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Users Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-2">
        <h2 className="text-lg sm:text-xl font-bold dark:text-blue-100">Recent Users</h2>
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md shadow bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-700 text-blue-800 dark:text-blue-100 font-semibold transition-colors text-sm"
        >
          Go to full user management →
        </Link>
      </div>

      {/* Recent Users List */}
      <ul className="divide-y divide-blue-100 dark:divide-blue-900 rounded-xl overflow-hidden bg-white/25 dark:bg-[#232b4a]/30 backdrop-blur shadow-sm">
        {stats.recentUsers && stats.recentUsers.length > 0 ? (
          stats.recentUsers.map((u) => (
            <li
              key={u.id}
              className="py-3 px-2 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center"
            >
              <span className="flex items-center gap-3 sm:gap-5">
                <img
                  src={getAvatarSrc(u.profilePicture)}
                  onError={(e) => {
                    e.currentTarget.src = "/default-avatar.png";
                    e.currentTarget.onerror = null;
                  }}
                  alt={u?.name || "User"}
                  className="w-10 h-10 rounded-full object-cover border shadow"
                />
                <div>
                  <span className="font-bold text-blue-950 dark:text-blue-100">{u.name}</span>
                  <span className="text-gray-500 ml-2 text-xs">{u.email}</span>
                  <span className="block text-xs text-gray-400">
                    Joined:{" "}
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString()
                      : ""}
                  </span>
                  <span className="block text-xs text-blue-700 dark:text-blue-200">
                    Notes: {u.notesCount}
                  </span>
                  {u.bio && (
                    <span className="block text-xs text-gray-500">
                      Bio: {u.bio}
                    </span>
                  )}
                </div>
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full font-semibold self-start sm:self-center ${
                  u.restricted
                    ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-400"
                    : "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400"
                }`}
              >
                {u.restricted ? "Restricted" : "Active"}
              </span>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">No recent users found.</p>
        )}
      </ul>
    </div>
  );
}
