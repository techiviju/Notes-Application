import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import api, { getErrorMessage } from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(true);

  // Always validate session with backend and reload profile
  useEffect(() => {
    if (!token) {
      setLoading(false);
      setUser(null);
      return;
    }
    
    const fetchProfile = async () => {
      try {
        // Changed from /user/profile to /api/user/profile
        const { data: profile } = await api.get("/user/profile");
        
        if (profile.restricted) throw new Error("restricted");
        
        console.log(" Profile loaded:", profile);
        
        setUser(profile);
        localStorage.setItem("user", JSON.stringify(profile));
      } catch (error) {
        console.error("Profile fetch error:", error);
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        
        if (error?.message === "restricted") {
          toast.error("Your account is restricted. Please contact support.");
        }
        
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [token, navigate]);

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      
      // Expect backend to return { token, user }
      if (!data.token || !data.user) {
        throw new Error("Invalid backend response: Missing token or user");
      }
      
      console.log("Registration response:", data);
      console.log("User name:", data.user.name);
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      
      toast.success(` Welcome, ${data.user.name || data.user.email}!`);
      navigate("/", { replace: true });
      
      return { success: true, data: data.user };
    } catch (error) {
      const msg = getErrorMessage(error) || "Registration failed.";
      console.error("Registration error:", error);
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      
      if (!data.token || !data.user) {
        throw new Error("Invalid login: Missing token or user in response");
      }
      
      console.log("Login response:", data);
      console.log("User name:", data.user.name);
      console.log("User roles:", data.user.roles);
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      
      // Show actual user name
      toast.success(` Welcome back, ${data.user.name || data.user.email}!`);
      
      navigate("/", { replace: true });
      return { success: true, data: data.user };
    } catch (error) {
      console.error("Login error:", error);
      
      let msg;
      if (
        error.response &&
        error.response.status === 403 &&
        typeof error.response.data === "string" &&
        error.response.data.toLowerCase().includes("restricted")
      ) {
        msg = "Your account is restricted. Please contact support.";
      } else {
        msg = getErrorMessage(error) || "Login failed.";
      }
      
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success(" Logged out successfully.");
    navigate("/login", { replace: true });
  }, [navigate]);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    register,
    login,
    logout,
    setUser,
    roles: user?.roles || [],
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = { children: PropTypes.node.isRequired };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
