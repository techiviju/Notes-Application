//  while production level is note working 
import axios from 'axios';

// --- Configurable Backend Base URL ---
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://noteapp-back-ka.onrender.com/api';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';


// --- Standardized Error Message Extraction ---
export const getErrorMessage = (error) => {
  if (!error) return 'Unexpected error';
  if (error.response?.data?.message) return error.response.data.message;
  if (typeof error.response?.data === 'string') return error.response.data;
  if (typeof error.message === 'string') return error.message;
  return 'Something went wrong. Please try again.';
};

// --- Create Axios Instance ---
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// --- Attach JWT Automatically to Each Request ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Session Expiry & Global Error Handling ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    error.normalizedMessage = getErrorMessage(error);
    return Promise.reject(error);
  }
);

// --- NOTE ENDPOINTS (User Mode) ---
export const notesAPI = {
  async getAllNotes() {
    const res = await api.get('/notes/user');
    return res.data;
  },
  async getNoteById(id) {
    const res = await api.get(`/notes/${id}`);
    return res.data;
  },
  async getSharedNote(token) {
    const res = await api.get(`/notes/share/${token}`);
    return res.data;
  },
  async createNote(noteData) {
    const res = await api.post('/notes', noteData);
    return res.data;
  },
  async updateNote(id, noteData) {
    const res = await api.put(`/notes/${id}`, noteData);
    return res.data;
  },
  async deleteNote(id) {
    const res = await api.delete(`/notes/${id}`);
    return res.data;
  },
  async shareNote(id) {
    const res = await api.post(`/notes/${id}/share`);
    return res.data;
  },
};

// --- ADMIN ENDPOINTS ---
export const adminAPI = {
  async getStats() {
    const res = await api.get('/admin/stats');
    return res.data;
  },
  async getUsers() {
    const res = await api.get('/admin/users');
    return res.data;
  },
  async restrictUser(id, restrict) {
    const res = await api.post(`/admin/restrict/${id}?restrict=${restrict}`);
    return res.data;
  },
  async deleteUser(id) {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  },
  async updateUserRole(id, role, add) {
    // add: true (promote), false (demote)
    const res = await api.put(`/admin/users/${id}/role?role=${role}&add=${add}`);
    return res.data;
  }
};

// --- USER PROFILE ENDPOINTS ---
export const userAPI = {
  async getProfile() {
    const res = await api.get('/user/profile');
    return res.data;
  },
  async updateProfile(profile) {
    const res = await api.put('/user/profile', profile);
    return res.data;
  },
  async uploadProfilePic(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/user/upload-profile-pic', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};

// --- Generalized Export for Manual/Ad-Hoc Requests ---
export default api;
