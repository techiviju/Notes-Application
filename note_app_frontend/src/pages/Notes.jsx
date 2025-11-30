 import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { notesAPI } from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Notes() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    async function fetchNotes() {
      try {
        setLoading(true);
        const data = await notesAPI.getAllNotes();
        setNotes(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error(error.normalizedMessage || "Failed to load notes. Please try again.");
        setNotes([]);
      } finally {
        setLoading(false);
      }
    }
    fetchNotes();
  }, [user, navigate]);

  const displayDate = (dateStr) => {
    if (!dateStr) return "--";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "--" : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-extrabold text-blue-800 dark:text-blue-200 mb-8 text-center">Your Notes</h1>
      {loading ? (
        <div className="text-center text-xl text-blue-600 dark:text-blue-400">Loading...</div>
      ) : notes.length === 0 ? (
        <div className="text-center text-blue-600 dark:text-blue-400 text-lg">
          No notes found. Create your first note!
        </div>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white dark:bg-[#1a2038] shadow-xl rounded-3xl p-6 flex flex-col justify-between hover:shadow-2xl transition cursor-default"
            >
              <div>
                <h2 className="text-2xl font-semibold text-blue-900 dark:text-blue-100 mb-3 line-clamp-2">{note.title}</h2>
                <p className="text-gray-700 dark:text-blue-300 mb-6 line-clamp-4">{note.content || "No content available."}</p>
              </div>
              <div className="text-xs font-mono text-blue-500 dark:text-blue-400 mb-6">
                Created: {displayDate(note.createdAt)}
              </div>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => navigate(`/note/${note.id}`)}
                  className="flex-1 min-w-[80px] px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-xl font-semibold shadow hover:from-blue-700 hover:to-indigo-600 transition"
                >
                  View
                </button>
                <button
                  onClick={() => navigate(`/edit/${note.id}`)}
                  className="flex-1 min-w-[80px] px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl font-semibold shadow hover:from-yellow-500 hover:to-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    toast.info("Share feature coming soon!");
                  }}
                  className="flex-1 min-w-[80px] px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold shadow hover:from-green-700 hover:to-green-800 transition"
                >
                  Share
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this note?")) {
                      notesAPI.deleteNote(note.id)
                        .then(() => {
                          setNotes((prev) => prev.filter((n) => n.id !== note.id));
                          toast.success("Note deleted");
                        })
                        .catch(() => toast.error("Failed to delete note, try again"));
                    }
                  }}
                  className="flex-1 min-w-[80px] px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold shadow hover:from-red-700 hover:to-red-800 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
