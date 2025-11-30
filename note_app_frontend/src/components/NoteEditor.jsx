import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotes } from "../context/NotesContext";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

const NoteEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createNote, updateNote, getNoteById, deleteNote } = useNotes();
  const isEditMode = !!id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [sharedChecked, setSharedChecked] = useState(false);
  const [shareToken, setShareToken] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (isEditMode) {
        try {
          const note = await getNoteById(id);
          setTitle(note.title || "");
          setContent(note.content || "");
          setSharedChecked(!!note.shareToken);
          setShareToken(note.shareToken || null);
        } catch {
          toast.error("Failed to load note.");
          navigate("/");
        }
      } else {
        const defaultShare = localStorage.getItem("defaultShare") === "true";
        setSharedChecked(defaultShare);
        setShareToken(null);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleToggleShare = () => {
    setSharedChecked((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a title.");
      return;
    }
    setLoading(true);
    try {
      if (isEditMode) {
        await updateNote(id, {
          title,
          content,
          shareToken: sharedChecked ? shareToken || uuidv4() : null,
        });
        toast.success("Note updated!");
      } else {
        await createNote({
          title,
          content,
          shareToken: sharedChecked ? uuidv4() : null,
        });
        toast.success("Note created!");
      }
      navigate("/");
    } catch {
      toast.error(isEditMode ? "Could not update note." : "Could not create note.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNote(id);
      toast.success("Note deleted!");
      navigate("/");
    } catch {
      toast.error("Failed to delete note.");
    }
    setShowDelete(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-2">
      <h1 className="text-3xl font-bold mb-6 text-blue-900 dark:text-blue-100 text-center">{isEditMode ? "Edit Note" : "Create New Note"}</h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#181f36] rounded-2xl shadow-2xl p-8 space-y-6 border border-blue-100 dark:border-blue-900 transition">
        <div>
          <label className="block text-sm font-semibold mb-2 text-blue-900 dark:text-blue-100">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-3 bg-blue-50 dark:bg-[#212a45] text-blue-900 dark:text-blue-100 border border-blue-200 dark:border-blue-800 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
            placeholder="Note title"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2 text-blue-900 dark:text-blue-100">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="w-full px-4 py-3 bg-blue-50 dark:bg-[#212a45] text-blue-900 dark:text-blue-100 border border-blue-200 dark:border-blue-800 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
            placeholder="Write your note here..."
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="makeShared"
            checked={sharedChecked}
            onChange={handleToggleShare}
            className="accent-blue-600 dark:accent-indigo-400 h-5 w-5"
          />
          <label htmlFor="makeShared" className="text-sm text-blue-800 dark:text-blue-200 font-medium">
            Make this note shared/public
          </label>
        </div>
        <div className="flex gap-4 mt-8">
          {isEditMode && (
            <button
              type="button"
              onClick={() => setShowDelete(true)}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold"
            >
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gray-200 dark:bg-blue-900 text-gray-700 dark:text-blue-100 rounded-xl font-semibold"
          >
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-xl font-bold transition-all hover:from-blue-800 hover:to-indigo-700">
            {loading ? (isEditMode ? "Updating..." : "Creating...") : isEditMode ? "Update Note" : "Create Note"}
          </button>
        </div>
      </form>
      {showDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#181f36] p-8 rounded-xl shadow-2xl border border-blue-100 dark:border-blue-900">
            <p className="mb-4 text-lg font-bold text-blue-900 dark:text-blue-100">Are you sure you want to delete this note?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDelete(false)}
                className="px-6 py-2 bg-gray-200 dark:bg-blue-900 text-gray-700 dark:text-blue-100 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button onClick={handleDelete} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteEditor;
