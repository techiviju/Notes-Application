import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotes } from "../context/NotesContext";
import NoteCard from "./NoteCard";
import Spinner from "./Spinner";

const NotesList = () => {
  const { notes, loading, loadNotes, deleteNote } = useNotes();
  const navigate = useNavigate();

  useEffect(() => {
    loadNotes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
    } catch {
      
    }
  };

  if (loading && notes.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-2">Your Notes</h1>
        <p className="text-blue-600 dark:text-blue-300">
          {notes.length} {notes.length === 1 ? "note" : "notes"}
        </p>
      </div>
      {/* Notes Grid */}
      {notes.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-24 h-24 text-blue-300 dark:text-blue-900 mx-auto mb-4"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-100 mb-2">No notes yet</h2>
          <p className="text-blue-500 dark:text-blue-200 mb-6">Create your first note to get started!</p>
          <button
            onClick={() => navigate("/new")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-xl font-medium hover:from-blue-800 hover:to-indigo-700 transition"
          >
            + Create Note
          </button>
        </div>
      ) : (
        <div
          className="
            grid
            grid-cols-1
            gap-7
            sm:grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            2xl:grid-cols-4
            pb-10
          "
        >
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesList;
