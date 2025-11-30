// mobile friendly version
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { notesAPI, getErrorMessage } from '../services/api';

const SharedNote = () => {
  const { token } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSharedNote = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await notesAPI.getSharedNote(token);
        setNote(data);
      } catch (err) {
        const msg = getErrorMessage(err) || 'Failed to load shared note';
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    loadSharedNote();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shared note...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white flex items-center justify-center px-2">
        <div className="w-full max-w-md bg-white/90 rounded-xl shadow-2xl p-8 sm:p-10 text-center border-t-4 border-red-400">
          <div className="mb-4">
            <svg
              className="w-16 h-16 text-red-500 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">Note Not Found</h2>
          <p className="text-gray-600 mb-2 font-semibold">{error}</p>
          <p className="text-xs text-gray-400 mb-2">
            This shared link may be invalid or expired.
          </p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white flex items-center justify-center">
        <p className="text-gray-500 font-semibold">No note found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex flex-col items-center justify-center py-8 px-2">
      <div className="w-full max-w-2xl bg-white/90 shadow-2xl rounded-2xl border border-blue-100 backdrop-blur-lg p-4 sm:p-8 relative">
        {/* Floating shared icon - shrinks on mobile */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-blue-500 rounded-full shadow-xl flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 ring-4 ring-white">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>

        <div className="pt-12">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-2">
            <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900 break-words">
              {note.title}
            </h1>
            <span className="mt-1 sm:mt-0 inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm font-semibold ring-1 ring-blue-200 ml-2 select-none">
              📝 Shared Note
            </span>
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap items-start gap-3 text-xs sm:text-sm text-gray-500 mb-2 mt-2">
            <span>
              <svg className="inline w-4 h-4 text-blue-400 mr-1 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              {`Created: ${new Date(note.createdAt).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric"
              })}`}
            </span>
            {note.updatedAt && note.updatedAt !== note.createdAt && (
              <span>
                <svg className="inline w-4 h-4 text-green-400 mr-1 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {`Updated: ${new Date(note.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric"
                })}`}
              </span>
            )}
          </div>
          <div className="my-6 rounded-xl bg-white shadow-inner border border-gray-100 p-4 sm:p-8 min-h-[90px] sm:min-h-[120px]">
            <div className="prose max-w-none whitespace-pre-wrap text-gray-800 text-base sm:text-lg break-words">
              {note.content || "No content available."}
            </div>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-between">
            <span className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
              <svg className="inline w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 12l-4-4-4 4m8 0a4 4 0 01-8 0"/>
              </svg>
              This is a read-only view
            </span>
            <button
              className="inline-flex items-center px-4 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold rounded-lg transition text-xs sm:text-sm"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied!");
              }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 16h8m-8 4h8M8 4v4a4 4 0 004 4h4"/>
              </svg>
              Copy Share Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedNote;
