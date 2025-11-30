import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useNotes } from "../context/NotesContext";

const NoteViewer = ({ isShared = false }) => {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const { getNoteById, getSharedNote, loading, error } = useNotes();
  const [note, setNote] = useState(null);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (isShared ? token : id) loadNote();
    // eslint-disable-next-line
  }, [id, token, isShared]);

  const loadNote = async () => {
    try {
      const noteData = isShared
        ? await getSharedNote(token)
        : await getNoteById(id);
      setNote(noteData);
      if (!isShared && noteData.shareToken) {
        setShareUrl(`${window.location.origin}/share/${noteData.shareToken}`);
      }
    } catch (err) {
      toast.error("Failed to load note");
    }
  };

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied to clipboard!");
    } catch {
      toast.error("Failed to copy share link");
    }
  };

  const formatDate = (d) => {
    if (!d) return "--";
    const date = new Date(d);
    return !isNaN(date.getTime())
      ? date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "--";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 px-3">
        <div className="text-red-600 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium">Error loading note</p>
          <p className="text-sm text-blue-600">{error}</p>
        </div>
        {!isShared && (
          <Link to="/" className="block px-4 py-2 rounded-lg bg-blue-600 text-white font-bold mt-4">
            Back to Notes
          </Link>
        )}
      </div>
    );
  }

  if (!note) {
    return (
      <div className="text-center py-12 px-3">
        <div className="text-blue-300 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-medium text-blue-600">Note not found</p>
        </div>
        {!isShared && (
          <Link to="/" className="block px-4 py-2 rounded-lg bg-blue-600 text-white font-bold mt-4">
            Back to Notes
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-2 md:px-6 py-6">
      {isShared && (
        <div className="mb-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-900 rounded-xl text-xs sm:text-sm">
          <div className="flex items-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-blue-800 dark:text-blue-200">
              This is a shared note. You can view it but cannot edit it.
            </p>
          </div>
        </div>
      )}
      <div className="bg-white dark:bg-[#171e31] rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900 p-3 sm:p-6 md:p-8">
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900 dark:text-blue-100 break-words max-w-full">
              {note.title || "Untitled Note"}
            </h1>
            {!isShared && (
              <div className="flex flex-wrap gap-2 mt-2 sm:mt-0 ml-0 sm:ml-4">
                <Link to={`/edit/${note.id}`}
                  className="px-3 py-2 rounded-xl bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-blue-100 transition hover:bg-blue-200 dark:hover:bg-blue-800 font-semibold text-xs sm:text-sm"
                >
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </Link>
                <button
                  onClick={copyShareUrl}
                  className="px-3 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-semibold text-xs sm:text-sm transition"
                >
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Share
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-1 sm:gap-4 text-xs sm:text-sm text-blue-500 dark:text-blue-200">
            <span>Created: {formatDate(note.createdAt)}</span>
            {note.updatedAt && note.updatedAt !== note.createdAt && (
              <span>Updated: {formatDate(note.updatedAt)}</span>
            )}
          </div>
        </div>
        <div className="prose prose-blue dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap text-blue-900 dark:text-blue-100 leading-relaxed break-words text-base sm:text-lg">
            {note.content || "No content available."}
          </div>
        </div>
      </div>
      {!isShared && shareUrl && (
        <div className="mt-6 p-2 sm:p-4 bg-blue-50 dark:bg-blue-900 rounded-xl">
          <h3 className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-100 mb-2">Share this note</h3>
          <div className="flex flex-col xs:flex-row gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-2 py-2 border border-blue-200 dark:border-blue-800 rounded-lg bg-white dark:bg-[#212a45] text-xs sm:text-sm text-blue-900 dark:text-blue-200"
            />
            <button
              onClick={copyShareUrl}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-xs sm:text-sm transition"
            >
              Copy
            </button>
          </div>
        </div>
      )}
      {!isShared && (
        <div className="mt-8 flex justify-start">
          <Link to="/" className="px-3 py-2 sm:px-4 sm:py-2 rounded-xl bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-blue-100 transition font-semibold text-xs sm:text-sm">
            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Notes
          </Link>
        </div>
      )}
    </div>
  );
};

NoteViewer.propTypes = {
  isShared: PropTypes.bool,
};

export default NoteViewer;
