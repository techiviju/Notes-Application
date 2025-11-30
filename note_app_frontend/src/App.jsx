import React, { Suspense, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { NotesProvider } from "./context/NotesContext.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";
import SharedNote from "./pages/SharedNote.jsx";
import Spinner from "./components/Spinner.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import AdminUserManagement from "./pages/AdminUserManagement.jsx"; // <-- Add this line

const NotesList = React.lazy(() => import("./components/NotesList.jsx"));
const NoteEditor = React.lazy(() => import("./components/NoteEditor.jsx"));
const NoteViewer = React.lazy(() => import("./components/NoteViewer.jsx"));

// const API_BASE_URL = import.meta.env.VITE_API_URL || "https://note-backend-kaej.onrender.com";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <Spinner size="lg" />
      <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

function Layout({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isPublicPage = ["/login", "/register"].includes(location.pathname);
  const isSharedNotePage = location.pathname.startsWith("/share/");
  const showNavbar = isAuthenticated && !isPublicPage && !isSharedNotePage;
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {showNavbar && <Navbar />}
      {children}
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  const isSharedNotePage = location.pathname.startsWith("/share/");
  const containerClass = isSharedNotePage
    ? ""
    : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8";

  return (
    <Layout>
      <main className={containerClass}>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/share/:token" element={<SharedNote />} />
            {/* User-Protected */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <NotesList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/new"
              element={
                <ProtectedRoute>
                  <NoteEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <ProtectedRoute>
                  <NoteEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/note/:id"
              element={
                <ProtectedRoute>
                  <NoteViewer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            {/* Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminUserManagement />
                </ProtectedRoute>
              }
            />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: "#363636", color: "#fff" },
          success: { duration: 3000, iconTheme: { primary: "#4ade80", secondary: "#fff" } },
          error: { duration: 4000, iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />
    </Layout>
  );
}

function App() {
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/actuator/health`)
      .then(() => console.log("Backend connected"))
      .catch((err) => console.error("Backend error:", err.message));
  }, []);
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <NotesProvider>
            <AppRoutes />
          </NotesProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
