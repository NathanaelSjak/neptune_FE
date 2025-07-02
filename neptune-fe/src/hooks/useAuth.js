import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

// Development bypass flag - set to true to skip login
const BYPASS_LOGIN = true; // Change this to false when backend is ready

// Mock user data for development
const MOCK_USERS = {
  student: {
    nim: "12345678",
    name: "John Doe",
    email: "12345678@binus.ac.id",
    role: "student",
    enrolledClasses: [
      {
        id: 1,
        name: "Programming Fundamentals",
        code: "COMP6047",
        semester: "2024/2025-1",
      },
      {
        id: 2,
        name: "Data Structures",
        code: "COMP6048",
        semester: "2024/2025-1",
      },
      {
        id: 3,
        name: "Algorithm Design",
        code: "COMP6049",
        semester: "2024/2025-1",
      },
    ],
  },
  lecturer: {
    nim: "87654321",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@binus.ac.id",
    role: "lecturer",
    department: "Computer Science",
    assignedClasses: [
      {
        id: 1,
        name: "Programming Fundamentals",
        code: "COMP6047",
        semester: "2024/2025-1",
      },
      {
        id: 2,
        name: "Data Structures",
        code: "COMP6048",
        semester: "2024/2025-1",
      },
      {
        id: 3,
        name: "Algorithm Design",
        code: "COMP6049",
        semester: "2024/2025-1",
      },
    ],
  },
  admin: {
    nim: "admin",
    name: "Dr. Michael Chen",
    email: "michael.chen@binus.ac.id",
    role: "admin",
    department: "Software Laboratory Center",
    assignedClasses: [],
  },
};

// Create authentication context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

// Main authentication hook
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Development bypass function
  const bypassLogin = useCallback(
    async (role = "student") => {
      if (!BYPASS_LOGIN) return false;

      setLoading(true);
      setError(null);

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const mockUser = MOCK_USERS[role];
        const mockToken = `mock-token-${role}-${Date.now()}`;

        // Store authentication data
        localStorage.setItem("token", mockToken);
        localStorage.setItem("user", JSON.stringify(mockUser));
        localStorage.setItem("isAuthenticated", "true");

        setUser(mockUser);
        setIsAuthenticated(true);

        // Redirect based on role
        if (mockUser.role === "admin") {
          navigate("/admin/dashboard");
        } else if (mockUser.role === "lecturer") {
          navigate("/lecturer/dashboard");
        } else {
          navigate("/dashboard");
        }

        return true;
      } catch (err) {
        setError("Bypass login failed");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  // Check if token is valid
  const isTokenValid = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    // For development bypass, always consider mock tokens as valid
    if (BYPASS_LOGIN && token.startsWith("mock-token-")) {
      return true;
    }

    try {
      // Check if token is expired (if it's a JWT)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;

      if (payload.exp && payload.exp < currentTime) {
        return false;
      }

      return true;
    } catch (error) {
      // If token is not a valid JWT, assume it's valid (for non-JWT tokens)
      return true;
    }
  }, []);

  // Validate authentication on page load/switch
  const validateAuth = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if token exists and is valid
      if (!isTokenValid()) {
        throw new Error("Invalid or expired token");
      }

      // For development bypass, use stored mock data
      if (BYPASS_LOGIN) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
          setLoading(false);
          return;
        }
      }

      // Get user profile from backend
      const response = await authAPI.getProfile();
      const userData = response.data;

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("isAuthenticated", "true");
    } catch (err) {
      // Clear invalid authentication data without calling logout to avoid circular dependency
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      setUser(null);
      setIsAuthenticated(false);
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }, [isTokenValid]);

  // Login function
  const login = useCallback(
    async (credentials, options = {}) => {
      setLoading(true);
      setError(null);

      try {
        let response;

        if (options.mockData) {
          // Use mock data for development
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
          response = {
            data: {
              user: options.mockData,
              token: "mock-token-" + Date.now(),
            },
          };
        } else {
          // Use real API
          response = await authAPI.login(credentials);
        }

        const { user: userData, token } = response.data;

        // Store authentication data
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isAuthenticated", "true");

        setUser(userData);
        setIsAuthenticated(true);

        // Redirect based on role
        if (userData.role === "admin") {
          navigate("/admin/dashboard");
        } else if (userData.role === "lecturer") {
          navigate("/lecturer/dashboard");
        } else {
          navigate("/dashboard");
        }

        return response.data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || "Login failed";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Call logout endpoint if authenticated and not in bypass mode
      if (isAuthenticated && !BYPASS_LOGIN) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Clear all authentication data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");

      setUser(null);
      setIsAuthenticated(false);
      setError(null);

      // Redirect to login
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Refresh token function
  const refreshToken = useCallback(async () => {
    try {
      const response = await authAPI.refreshToken();
      const { token: newToken } = response.data;

      localStorage.setItem("token", newToken);
      return newToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      throw error;
    }
  }, [logout]);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Check authentication on mount and when dependencies change
  useEffect(() => {
    // If bypass is enabled and no user is logged in, automatically log in as student
    if (BYPASS_LOGIN && !isAuthenticated && !user && !loading) {
      // Use a separate effect to avoid dependency issues
      const performBypassLogin = async () => {
        setLoading(true);
        setError(null);

        try {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          const mockUser = MOCK_USERS.student;
          const mockToken = `mock-token-student-${Date.now()}`;

          // Store authentication data
          localStorage.setItem("token", mockToken);
          localStorage.setItem("user", JSON.stringify(mockUser));
          localStorage.setItem("isAuthenticated", "true");

          setUser(mockUser);
          setIsAuthenticated(true);

          // Redirect based on role
          navigate("/dashboard");
        } catch (err) {
          setError("Bypass login failed");
        } finally {
          setLoading(false);
        }
      };

      performBypassLogin();
    } else if (!BYPASS_LOGIN) {
      validateAuth();
    }
  }, [validateAuth, isAuthenticated, user, loading, navigate]);

  // Set up periodic token validation (every 5 minutes)
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      if (!isTokenValid()) {
        logout();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated, isTokenValid, logout]);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    refreshToken,
    validateAuth,
    clearError,
    bypassLogin,
  };
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Hook for components that need auth state but don't need to trigger validation
export const useAuthState = () => {
  const { user, loading, error, isAuthenticated } = useAuthContext();

  return {
    user,
    loading,
    error,
    isAuthenticated,
  };
};

// Hook for components that need auth actions
export const useAuthActions = () => {
  const { login, logout, refreshToken, validateAuth, clearError, bypassLogin } =
    useAuthContext();

  return {
    login,
    logout,
    refreshToken,
    validateAuth,
    clearError,
    bypassLogin,
  };
};
