import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

const AuthContext = createContext();

// Configure axios to include credentials (cookies) in every request
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/auth/user");
      if (data.isAuthenticated) {
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const loginEmail = async (email, password) => {
    try {
      const { data } = await axios.post("/auth/login", { email, password });
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      console.error("Local login failed:", error);
      throw error;
    }
  };

  const signupEmail = async (email, password, displayName) => {
    try {
      const { data } = await axios.post("/auth/signup", { email, password, displayName });
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      console.error("Local signup failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.get("/auth/logout");
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const updateSkills = async (skills) => {
    try {
      const { data } = await axios.patch("/api/profile/skills", { skills });
      setUser(data);
      return data;
    } catch (error) {
      console.error("Failed to update skills:", error);
      throw error;
    }
  };

  const updateProfileImage = async (image) => {
    try {
      const { data } = await axios.patch("/api/profile/image", { image });
      setUser(data);
      return data;
    } catch (error) {
      console.error("Failed to update profile image:", error);
      throw error;
    }
  };

  const saveResume = async (title, content) => {
    try {
      const { data } = await axios.post("/api/profile/resumes", { title, content });
      setUser(data);
      return data;
    } catch (error) {
      console.error("Failed to save resume:", error);
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const { data } = await axios.post('/auth/forgot-password', { email });
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || "Failed to process request" };
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const { data } = await axios.post(`/auth/reset-password/${token}`, { password });
      if (data.success) {
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.response?.data?.error || "Failed to reset password" };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, loginEmail, signupEmail, logout, updateSkills, updateProfileImage, saveResume, forgotPassword, resetPassword, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
