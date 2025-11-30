import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import { getAvatarSrc } from "../services/avatar";
import { useNavigate } from "react-router-dom";

const DEFAULT_AVATAR = "/default-avatar.png";

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = () => {
    setLoading(true);
    setError("");
    api
      .get("/admin/users")
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load users");
        setError("Could not load users. Please check your server and authorization.");
        setLoading(false);
      });
  };

  useEffect(() => {
    let result = users;
    if (search && result.length > 0) {
      const term = search.toLowerCase();
      result = result.filter(
        (u) =>
          u?.name?.toLowerCase().includes(term) ||
          u?.email?.toLowerCase().includes(term)
      );
    }
    result = [...result].sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    setFiltered(result);
  }, [users, search, sortKey, sortOrder]);

  const handleSort = (key) => {
    if (sortKey === key)
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleRestrict = (id, restrict, isAdmin) => {
    if (isAdmin && restrict) {
      toast.error("Cannot restrict admin user.");
      return;
    }
    api
      .post(`/admin/restrict/${id}?restrict=${restrict}`)
      .then(fetchUsers)
      .catch(() => toast.error("Failed to update user"));
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this user and all their notes?")) {
      api
        .delete(`/admin/users/${id}`)
        .then(fetchUsers)
        .catch(() => toast.error("Delete failed"));
    }
  };

  const handleRole = (id, role, add) => {
    api
      .put(`/admin/users/${id}/role?role=${role}&add=${add}`)
      .then(fetchUsers)
      .catch(() => toast.error("Role update failed"));
  };

  const imgFallbackRef = useRef({});
  function handleImgError(e, id) {
    if (!imgFallbackRef.current[id]) {
      e.target.src = DEFAULT_AVATAR;
      imgFallbackRef.current[id] = true;
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-1">
      <div className="mb-4">
        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md shadow bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-700 text-blue-800 dark:text-blue-100 font-semibold transition-colors"
        >
          &#8592; Admin Dashboard
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-5 text-gray-900 dark:text-gray-100">
        User Management
      </h1>

      <div className="mb-4 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
        <input
          className="border px-3 py-2 rounded-md w-full max-w-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Search user by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {loading && (
          <span className="text-gray-500 self-center text-sm sm:text-base">Loading...</span>
        )}
      </div>
      {error && (
        <div className="text-center text-red-500 font-semibold my-4">{error}</div>
      )}
      <div className="bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-xl shadow-md overflow-x-auto">
        <table className="min-w-full rounded-xl text-sm sm:text-base">
          <thead>
            <tr className="bg-blue-100 dark:bg-[#23305d] text-gray-900 dark:text-white text-base">
              <th className="px-2 py-3 rounded-tl-xl font-semibold text-xs sm:text-sm md:text-base">Avatar</th>
              <th className="px-2 cursor-pointer select-none font-semibold text-xs sm:text-sm md:text-base" onClick={() => handleSort("name")}>
                Name{sortKey === "name" && (sortOrder === "asc" ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />)}
              </th>
              <th className="px-2 cursor-pointer select-none font-semibold text-xs sm:text-sm md:text-base" onClick={() => handleSort("email")}>
                Email{sortKey === "email" && (sortOrder === "asc" ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />)}
              </th>
              <th className="px-2 font-semibold text-xs sm:text-sm md:text-base">Roles</th>
              <th className="px-2 cursor-pointer select-none font-semibold text-xs sm:text-sm md:text-base" onClick={() => handleSort("restricted")}>
                Status{sortKey === "restricted" && (sortOrder === "asc" ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />)}
              </th>
              <th className="px-2 cursor-pointer select-none font-semibold text-xs sm:text-sm md:text-base" onClick={() => handleSort("createdAt")}>
                Joined{sortKey === "createdAt" && (sortOrder === "asc" ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />)}
              </th>
              <th className="px-2 cursor-pointer select-none font-semibold text-xs sm:text-sm md:text-base" onClick={() => handleSort("notesCount")}>
                Notes{sortKey === "notesCount" && (sortOrder === "asc" ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />)}
              </th>
              <th className="px-2 rounded-tr-xl font-semibold text-xs sm:text-sm md:text-base">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && !loading && (
              <tr>
                <td colSpan={8} className="text-center text-gray-400 py-8 font-semibold">
                  No users found.
                </td>
              </tr>
            )}
            {filtered.map((u) => (
              <tr
                key={u.id}
                className="border-t border-slate-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-[#232e4c] transition"
              >
                <td className="py-2 px-2 align-middle text-center min-w-[48px]">
                  <img
                    src={getAvatarSrc(u.profilePicture)}
                    alt={u?.name || "User"}
                    onError={e => handleImgError(e, u.id)}
                    className="w-10 h-10 rounded-full object-cover border shadow bg-white dark:bg-gray-800"
                    loading="lazy"
                  />
                </td>
                <td className="font-bold py-2 px-2 align-middle text-gray-900 dark:text-gray-100">{u.name}</td>
                <td className="py-2 px-2 align-middle">
                  <div className="text-gray-700 dark:text-gray-100">{u.email}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-300">
                    Joined: {u.createdAt ? u.createdAt.slice(0, 10) : "N/A"}
                  </div>
                </td>
                <td className="py-2 px-2 align-middle">
                  <div className="mb-1 text-gray-700 dark:text-gray-100">{u.roles?.join(", ") || "-"}</div>
                  {u.roles?.includes("ADMIN") ? (
                    <button
                      onClick={() => handleRole(u.id, "ADMIN", false)}
                      className="text-xs text-yellow-600 dark:text-yellow-300 hover:underline"
                      disabled={u.email === "admin@example.com"}
                    >
                      Demote
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRole(u.id, "ADMIN", true)}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Promote
                    </button>
                  )}
                </td>
                <td className="py-2 px-2 align-middle">
                  <span className={`px-2 py-1 rounded text-xs font-semibold
                    ${u.restricted
                      ? "text-red-700 bg-red-100 dark:bg-red-700 dark:text-white"
                      : "text-green-700 bg-green-100 dark:bg-green-700 dark:text-white"
                    }`}>
                    {u.restricted ? "Restricted" : "Active"}
                  </span>
                </td>
                <td className="py-2 px-2 align-middle">
                  <span className="text-gray-700 dark:text-gray-100">{u.createdAt?.slice(0, 10) || "N/A"}</span>
                </td>
                <td className="py-2 px-2 align-middle font-bold text-gray-900 dark:text-gray-200"><span>{u.notesCount}</span></td>
                <td className="py-2 px-2 align-middle">
                  <div className="flex flex-col sm:flex-row sm:gap-1 gap-2">
                    <button
                      onClick={() => handleRestrict(u.id, !u.restricted, u.roles?.includes("ADMIN"))}
                      className="mb-1 sm:mb-0 px-2 py-1 text-xs rounded bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-700 dark:hover:bg-yellow-500 text-yellow-900 dark:text-white"
                      disabled={loading}
                    >
                      {u.restricted ? "Unrestrict" : "Restrict"}
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="px-2 py-1 text-xs rounded bg-red-100 hover:bg-red-200 dark:bg-red-700 dark:hover:bg-red-600 text-red-700 dark:text-white"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
