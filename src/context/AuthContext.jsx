import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user data from sessionStorage on mount
    try {
      const storedUser = sessionStorage.getItem("user");
      const storedToken = sessionStorage.getItem("token");
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
      // Clear corrupted data
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle error response from server
        throw new Error(data.message || "Login failed");
      }

      const userData = {
        username: data.username,
        role: data.role,
        userId: data.userId,
        shopId: data.shopId, // Include shopId from backend
      };

      setUser(userData);
      setToken(data.token);

      sessionStorage.setItem("user", JSON.stringify(userData));
      sessionStorage.setItem("token", data.token);

      return { success: true, userData };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.message || "An unexpected error occurred",
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
  };

  // Helper function to check if token is expired (optional)
  const isTokenValid = () => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isTokenValid,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
