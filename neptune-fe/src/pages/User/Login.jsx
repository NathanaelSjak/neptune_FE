import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate NIM format (BINUS NIM is typically 8 digits, but admin can use different format)
    if (!nim) {
      setError("Please enter your NIM/ID");
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError("Please enter your password");
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Replace with actual BINUS API call
      // For now, simulate API call with mock data
      const response = await simulateBinusLogin(nim, password);

      if (response.success) {
        // Store user data in localStorage or context
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("isAuthenticated", "true");

        // Redirect based on role
        if (response.user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (response.user.role === "lecturer") {
          navigate("/lecturer/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(response.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Mock function to simulate BINUS login API
  const simulateBinusLogin = async (nim, password) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation - in real implementation, this would call BINUS API
    if (nim === "12345678" && password === "password") {
      return {
        success: true,
        user: {
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
        },
      };
    } else if (nim === "87654321" && password === "lecturer") {
      return {
        success: true,
        user: {
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
        },
      };
    } else if (nim === "admin" && password === "admin123") {
      return {
        success: true,
        user: {
          nim: nim,
          name: "Dr. Michael Chen",
          email: "michael.chen@binus.ac.id",
          role: "admin",
          department: "Software Laboratory Center",
          assignedClasses: [],
        },
      };
    } else {
      return {
        success: false,
        message: "Invalid NIM/ID or password",
      };
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
              <span className="font-bold text-blue-700 text-lg">LOGO</span>
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </label>
              <div className="text-xs text-gray-500 mt-1">
                Your BIMAY account password or admin password
              </div>
            </div>

            {error && (
              <div className="alert alert-error text-sm">
                <span className="material-icons text-red-600">error</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className={`btn btn-primary w-full mt-2 ${
                isLoading ? "loading" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-xs text-blue-700 font-semibold mb-1">
              Demo Credentials:
            </div>
            <div className="text-xs text-blue-600 space-y-1">
              <div>
                <span className="font-semibold">Student:</span> NIM: 12345678,
                Password: password
              </div>
              <div>
                <span className="font-semibold">Lecturer:</span> NIM: 87654321,
                Password: lecturer
              </div>
              <div>
                <span className="font-semibold">Admin:</span> ID: admin,
                Password: admin123
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-8 left-0 right-0 text-center text-white text-sm z-20">
        LF & XY
        <br />
        Software Laboratory Center
        <br />
        <a href="mailto:academic.slc@binus.edu" className="underline">
          academic.slc@binus.edu
        </a>
      </footer>

      {/* Google Fonts for Material Icons */}
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />
    </div>
  );
};

export default Login;
