import React, { useState } from "react";
import { useAuthActions, useAuthState } from "../../hooks/useAuth";

const Login = () => {
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error } = useAuthState();
  const { login, clearError } = useAuthActions();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    // Validate NIM format
    if (!nim) {
      return;
    }

    if (!password) {
      return;
    }

    try {
      await login({ nim, password });
      // Navigation is handled by the auth hook
    } catch (err) {
      // Error is handled by the auth hook
      console.error("Login failed:", err);
    }
  };

  // Fallback to mock data if API is not available
  const handleMockLogin = async (e) => {
    e.preventDefault();
    clearError();

    if (!nim || !password) {
      return;
    }

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let user = null;

      // Mock validation
      if (nim === "12345678" && password === "password") {
        user = {
          nim: nim,
          name: "John Doe",
          email: `${nim}@binus.ac.id`,
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
        };
      } else if (nim === "87654321" && password === "lecturer") {
        user = {
          nim: nim,
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
        };
      } else if (nim === "admin" && password === "admin123") {
        user = {
          nim: nim,
          name: "Dr. Michael Chen",
          email: "michael.chen@binus.ac.id",
          role: "admin",
          department: "Software Laboratory Center",
          assignedClasses: [],
        };
      }

      if (user) {
        // Use the auth hook's login function with mock data
        await login({ nim, password }, { mockData: user });
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      console.error("Mock login failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-400 to-blue-600 relative overflow-hidden">
      {/* Animated background lines (optional, can be added later) */}
      <div className="z-10 w-full flex flex-col items-center">
        <div className="bg-white shadow-xl rounded-lg p-8 w-80 flex flex-col items-center">
          {/* Logo Placeholder */}
          <div className="mb-6">
            <div className="w-24 h-12 mx-auto mb-2 flex items-center justify-center">
              {/* Replace with <img src="/path/to/logo.png" alt="Logo" /> */}
              <span className="font-bold text-blue-700 text-lg">NEPTUNE</span>
            </div>
            <div className="text-center text-xs text-gray-500 font-semibold leading-tight">
              BINUS
              <br />
              UNIVERSITY
              <br />
              Software Laboratory Center
            </div>
          </div>

          {/* Login Form */}
          <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="input input-bordered flex items-center gap-2">
                <span className="material-icons text-blue-500">person</span>
                <input
                  type="text"
                  className="grow"
                  placeholder="NIM/ID"
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  disabled={loading}
                />
              </label>
              <div className="text-xs text-gray-500 mt-1">
                Enter your BINUS NIM or Admin ID
              </div>
            </div>

            <div>
              <label className="input input-bordered flex items-center gap-2">
                <span className="material-icons text-blue-500">lock</span>
                <input
                  type="password"
                  className="grow"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </label>
              <div className="text-xs text-gray-500 mt-1">
                Your BIMAY account password or admin password
              </div>
            </div>

            {error && (
              <div className="alert alert-error text-sm">
                <span className="material-icons">error</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            {/* Fallback button for development */}
            <button
              type="button"
              onClick={handleMockLogin}
              className="btn btn-outline btn-sm w-full"
              disabled={loading}
            >
              Use Mock Data (Dev)
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>© 2024 BINUS University</p>
            <p>Software Laboratory Center</p>
          </div>
        </div>
      </div>

      {/* Google Fonts for Material Icons */}
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />
    </div>
  );
};

export default Login;
