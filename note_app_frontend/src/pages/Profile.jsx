 
//  while application is not working on production level
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotes } from "../context/NotesContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { userAPI } from "../services/api";

// Utility for avatar url formatting
const getAvatarSrc = (url) => {
  if (!url) return "/default-avatar.png";
  if (url.startsWith("blob:") || url.startsWith("data:")) return url;
  if (url.startsWith("http")) return url;
  return url.startsWith("/") ? `http://localhost:8080${url}` : `http://localhost:8080/${url}`;
};

const formatJoinDate = (ts) => (ts ? new Date(ts).toLocaleDateString() : "--");

export default function Profile() {
  const { user, setUser } = useAuth();
  const { notes } = useNotes();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || "", bio: user?.bio || "" });
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(user?.profilePicture || "");
  const fileInputRef = useRef();

  useEffect(() => {
    setFormData({ name: user?.name || "", bio: user?.bio || "" });
    setProfilePicFile(null);
    setProfilePreview(user?.profilePicture || "");
  }, [user]);

  // ---- API-based profile refresh ----
  async function refreshUserProfile() {
    try {
      const freshUser = await userAPI.getProfile();
      setUser(freshUser);
      localStorage.setItem("user", JSON.stringify(freshUser));
    } catch {}
  }
  useEffect(() => { refreshUserProfile(); }, []);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfilePicFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const daysActive = user?.createdAt
    ? Math.max(1, Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)))
    : 1;

  // --- Minimal changes here ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let profilePictureUrl = user.profilePicture;
      if (profilePicFile) {
        // Use userAPI.uploadProfilePic for proper backend call
        const uploadData = await userAPI.uploadProfilePic(profilePicFile);
        profilePictureUrl = uploadData.profilePictureUrl;
      }
      // Use userAPI.updateProfile for PUT, always goes to backend
      await userAPI.updateProfile({
        name: formData.name.trim(),
        bio: formData.bio || "",
        profilePicture: profilePictureUrl,
      });
      await refreshUserProfile();
      toast.success("Profile updated!");
      setEditing(false);
    } catch {
      toast.error("Could not update profile!");
    } finally {
      setLoading(false);
    }
  };

  // ---- MAIN RENDER ----
  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-blue-100/80 via-indigo-100/70 to-slate-100/60 dark:from-[#10172a] dark:via-[#171f36] dark:to-[#1f294d] py-8">
      {/* Glass super-card */}
      <div className="w-full max-w-2xl p-2 rounded-[2.2rem] bg-white/60 dark:bg-[#161e33]/80 backdrop-blur-2xl shadow-2xl border border-blue-100 dark:border-blue-900">
        {/* Profile cover gradient */}
        <div className="relative h-[120px] sm:h-[148px] bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-t-[2rem] blur-[0.5px] shadow-inner">
          <div className="absolute right-5 bottom-5 flex items-center text-blue-100/90 text-xs font-bold gap-2">
            <span className="animate-pulse">
              {editing ? "Editing..." : "Profile Active"}
            </span>
            <span className={"w-2 h-2 rounded-full " + (editing ? "bg-yellow-400 animate-ping" : "bg-green-500")}></span>
          </div>
        </div>
        {/* Main profile avatar + actions */}
        <div className="flex flex-col items-center -mt-20">
          <div className="relative group mb-2">
            <div className={`w-32 h-32 rounded-full bg-gradient-to-tr from-blue-400 via-indigo-100 to-blue-50 p-1 shadow-xl flex items-center justify-center
              after:content-[''] after:block after:absolute after:inset-0 after:rounded-full 
              after:ring-4 ${editing ? 'after:ring-yellow-400' : 'after:ring-green-400'} after:animate-gradient-move`}>
                <img
                  src={profilePreview ? getAvatarSrc(profilePreview) : "/default-avatar.png"}
                  alt={user?.name}
                  onError={e => { e.currentTarget.src = "/default-avatar.png"; }}
                  className="relative z-10 w-28 h-28 rounded-full object-cover border-4 border-white shadow"
                  draggable={false}
                />
              </div>
            {/* Edit Avatar overlay button */}
            {editing && (
              <>
                <button
                  type="button"
                  className="absolute bottom-1.5 right-2 bg-blue-600 hover:bg-blue-700 rounded-full p-2 text-white shadow-lg outline-none ring-2 ring-white ring-opacity-30 z-20 transition"
                  onClick={() => fileInputRef.current.click()}
                  title="Change profile picture"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h6M5.5 17.5L15 8l3.5 3.5-9.5 9.5H5.5v-2z"/>
                  </svg>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleProfilePicChange}
                  accept="image/*"
                  className="hidden"
                />
              </>
            )}
          </div>
          {/* Animated status */}
          {!editing && (
            <div className="mb-2 flex items-center gap-2 text-sm text-green-500">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span>Active · Joined {formatJoinDate(user?.createdAt)}</span>
            </div>
          )}
        </div>

        <div className="px-4 sm:px-12 pb-8 pt-4">
          {/* View Mode */}
          {!editing ? (
            <>
              <div className="flex flex-col items-center mb-2">
                <h2 className="text-2xl font-extrabold text-blue-900 dark:text-blue-100 tracking-tight">{user?.name}</h2>
                <span className="text-base text-blue-800 dark:text-blue-300">{user?.email}</span>
              </div>
              <div className="text-center text-blue-800 dark:text-blue-100 italic mb-2 min-h-[20px]">{user?.bio ? `"${user.bio}"` : 'No bio provided'}</div>
              {/* Stats bar */}
              <div className="flex flex-row justify-center gap-4 mt-4 mb-7">
                {/* Individual stat cards, neumorphic look */}
                <div className="flex flex-col items-center px-5 py-2 bg-gradient-to-br from-blue-50 to-white/80 dark:from-[#1b2443] dark:to-[#232e52] shadow rounded-xl border dark:border-blue-800">
                  <div className="text-lg font-extrabold text-blue-600 dark:text-blue-100">{notes.length}</div>
                  <div className="text-xs uppercase font-semibold text-blue-600/80 dark:text-blue-100/80">Notes</div>
                </div>
                <div className="flex flex-col items-center px-5 py-2 bg-gradient-to-br from-green-50 to-white/80 dark:from-[#142725] dark:to-[#15262b] shadow rounded-xl border dark:border-green-800">
                  <div className="text-lg font-extrabold text-green-700 dark:text-green-300">
                    {notes.filter((n) => n.shareToken).length}
                  </div>
                  <div className="text-xs uppercase font-semibold text-green-600/70 dark:text-green-100/70">Shared</div>
                </div>
                <div className="flex flex-col items-center px-5 py-2 bg-gradient-to-br from-purple-50 to-white/80 dark:from-[#231638] dark:to-[#2c2343] shadow rounded-xl border dark:border-purple-800">
                  <div className="text-lg font-extrabold text-purple-600 dark:text-purple-200">{daysActive}</div>
                  <div className="text-xs uppercase font-semibold text-purple-600/70 dark:text-purple-100/70">Days Active</div>
                </div>
              </div>
              {/* Actions */}
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                <button
                  onClick={() => setEditing(true)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-xl font-bold hover:from-blue-900 hover:to-indigo-700 shadow-lg transition"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-2 bg-white dark:bg-[#202843] border border-blue-100 dark:border-blue-900 text-blue-800 dark:text-blue-100 rounded-xl font-bold shadow"
                >
                  Back to Notes
                </button>
              </div>
            </>
          ) : (
            // ---- Edit Mode ----
            <form onSubmit={handleSubmit} className="bg-blue-50 dark:bg-[#192544] rounded-xl p-7 my-5 w-full max-w-lg mx-auto shadow space-y-5">
              <div>
                <label className="block text-sm font-bold text-blue-800 dark:text-blue-100 mb-1">Full Name</label>
                <input
                  required type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white/70 dark:bg-[#222d4a] border-2 border-blue-100 dark:border-blue-900 rounded-lg focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-800 font-bold outline-none dark:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-800 dark:text-blue-100 mb-1">Bio/About Me</label>
                <textarea
                  maxLength={160}
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2 bg-white/70 dark:bg-[#222d4a] border-2 border-blue-100 dark:border-blue-900 rounded-lg focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-800 font-bold outline-none dark:text-gray-400"
                  placeholder="Short description about yourself..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-800 dark:text-blue-100 mb-1">Email Address</label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="w-full px-4 py-2 border-2 bg-gray-50 border-blue-100 dark:border-blue-900 dark:bg-[#212a45] text-gray-400 cursor-not-allowed font-mono"
                />
                <p className="text-xs text-amber-700 mt-1">Email cannot be changed for security reasons.</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 px-4 py-2 bg-white dark:bg-[#10162c] border border-blue-100 dark:border-blue-900 text-blue-800 dark:text-blue-100 rounded-xl font-bold shadow"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-xl font-bold shadow-lg transition"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
