 //  new UI
import React, { useState } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";

const getDisplayDate = (date) => {
  if (!date) return "--";
  const d = new Date(date);
  return !isNaN(d.getTime())
    ? d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "--";
};

const NoteCard = ({ note, onDelete }) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/share/${note.shareToken}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => toast.success("Share link copied!"))
      .catch(() => toast.error("Failed to copy link"));
  };

  const handleView = () => navigate(`/note/${note.id}`);
  const handleEdit = () => navigate(`/edit/${note.id}`);
  const handleDeleteClick = () => setShowDeleteModal(true);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(note.id);
      setShowDeleteModal(false);
      toast.success("Note deleted!");
    } catch {
      toast.error("Failed to delete note");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        className="
        group 
        rounded-3xl border
        border-blue-200 dark:border-blue-900 
        shadow-[6px_6px_28px_#d4d9e6,-6px_-6px_28px_#ffffff] 
        dark:shadow-[0_8px_40px_6px_rgba(22,27,49,0.65)]
        transition-all duration-300 overflow-hidden m-2 
        bg-white dark:bg-[#171e31] 
        hover:shadow-2xl dark:hover:shadow-[0_12px_56px_12px_rgba(30,45,94,0.82)]
      "
      >
        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-blue-100 mb-2 line-clamp-1 group-hover:text-blue-700 dark:group-hover:text-indigo-400 transition-colors">
            {note.title}
          </h3>
          <p className="text-slate-600 dark:text-blue-200 mb-4 line-clamp-3 text-sm leading-relaxed">
            {note.content || "No content"}
          </p>
          <div className="flex items-center gap-2 text-xs text-blue-400 dark:text-blue-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {getDisplayDate(note.createdAt)}
          </div>
        </div>
        <div className="px-4 py-4 bg-blue-50 dark:bg-[#1b2443] border-t border-blue-100 dark:border-blue-900 rounded-b-3xl">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleView}
              className="flex items-center justify-center gap-2 px-3 py-2.5 
                bg-gradient-to-r from-blue-600 to-indigo-400 
                hover:from-blue-800 hover:to-indigo-700 
                text-white rounded-lg 
                shadow transition text-sm font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>View</span>
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center justify-center gap-2 px-3 py-2.5 
                bg-gradient-to-r from-yellow-400 to-yellow-500 
                hover:from-yellow-500 hover:to-yellow-600 
                text-white rounded-lg 
                shadow transition text-sm font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-3 py-2.5 
                bg-gradient-to-r from-green-500 to-green-600 
                hover:from-green-700 hover:to-green-800 
                text-white rounded-lg 
                shadow transition text-sm font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>Share</span>
            </button>
            <button
              onClick={handleDeleteClick}
              className="flex items-center justify-center gap-2 px-3 py-2.5 
                bg-gradient-to-r from-red-500 to-red-700 
                hover:from-red-700 hover:to-red-900 
                text-white rounded-lg 
                shadow transition text-sm font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Note"
        message={`Are you sure you want to delete "${note.title}"? This action cannot be undone.`}
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        type="danger"
      />
    </>
  );
};

NoteCard.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string,
    shareToken: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default NoteCard;
