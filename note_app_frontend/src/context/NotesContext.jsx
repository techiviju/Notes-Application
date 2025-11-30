 
import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { notesAPI, getErrorMessage } from '../services/api';

const NotesContext = createContext();

const initialState = {
  notes: [],
  loading: false,
  error: null,
  selectedNote: null,
};

const notesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_NOTES':
      return { ...state, notes: action.payload, loading: false, error: null };
    case 'ADD_NOTE':
      return { ...state, notes: [action.payload, ...state.notes], loading: false, error: null };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(n => String(n.id) === String(action.payload.id) ? action.payload : n),
        loading: false,
        error: null,
      };
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(n => String(n.id) !== String(action.payload)),
        selectedNote: String(state.selectedNote?.id) === String(action.payload) ? null : state.selectedNote,
        loading: false,
        error: null,
      };
    case 'SET_SELECTED_NOTE':
      return { ...state, selectedNote: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
};

export const NotesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  const loadNotes = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const data = await notesAPI.getAllNotes();
      dispatch({ type: 'SET_NOTES', payload: data });
      return data;
    } catch (error) {
      const msg = getErrorMessage(error) || 'Failed to load notes';
      dispatch({ type: 'SET_ERROR', payload: msg });
      return [];
    }
  }, []);

  const createNote = useCallback(async (noteData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const data = await notesAPI.createNote(noteData);
      dispatch({ type: 'ADD_NOTE', payload: data });
      return data;
    } catch (error) {
      const msg = getErrorMessage(error) || 'Failed to create note';
      dispatch({ type: 'SET_ERROR', payload: msg });
      throw error;
    }
  }, []);

  const updateNote = useCallback(async (id, noteData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const data = await notesAPI.updateNote(id, noteData);
      dispatch({ type: 'UPDATE_NOTE', payload: data });
      return data;
    } catch (error) {
      const msg = getErrorMessage(error) || 'Failed to update note';
      dispatch({ type: 'SET_ERROR', payload: msg });
      throw error;
    }
  }, []);

  const deleteNote = useCallback(async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await notesAPI.deleteNote(id);
      dispatch({ type: 'DELETE_NOTE', payload: id });
    } catch (error) {
      const msg = getErrorMessage(error) || 'Failed to delete note';
      dispatch({ type: 'SET_ERROR', payload: msg });
      throw error;
    }
  }, []);

  const getNoteById = useCallback(async (id) => {
    try {
      const data = await notesAPI.getNoteById(id);
      dispatch({ type: 'SET_SELECTED_NOTE', payload: data });
      return data;
    } catch (error) {
      const msg = getErrorMessage(error) || 'Failed to load note';
      dispatch({ type: 'SET_ERROR', payload: msg });
      throw error;
    }
  }, []);

  const getSharedNote = useCallback(async (token) => {
    try {
      const data = await notesAPI.getSharedNote(token);
      return data;
    } catch (error) {
      const msg = getErrorMessage(error) || 'Failed to load shared note';
      dispatch({ type: 'SET_ERROR', payload: msg });
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const resetState = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, []);

  const value = useMemo(() => ({
    ...state,
    loadNotes,
    createNote,
    updateNote,
    deleteNote,
    getNoteById,
    getSharedNote,
    clearError,
    resetState,
  }), [state, loadNotes, createNote, updateNote, deleteNote, getNoteById, getSharedNote, clearError, resetState]);

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) throw new Error("useNotes must be used within a NotesProvider");
  return context;
};

NotesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
