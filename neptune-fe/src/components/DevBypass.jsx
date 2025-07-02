import React from "react";
import { useAuthActions, useAuthState } from "../hooks/useAuth";

const DevBypass = () => {
  const { user, isAuthenticated } = useAuthState();
  const { bypassLogin, logout } = useAuthActions();

  // Only show in development mode
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const handleRoleSwitch = async (role) => {
    await logout();
    await bypassLogin(role);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-xs">
        <div className="text-sm font-semibold text-gray-700 mb-2">
          🛠️ Dev Mode - Current: {user?.role || "Unknown"}
        </div>
        <div className="space-y-1">
          <button
            onClick={() => handleRoleSwitch("student")}
            className={`w-full text-left px-2 py-1 text-xs rounded ${
              user?.role === "student"
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100"
            }`}
          >
            👨‍🎓 Switch to Student
          </button>
          <button
            onClick={() => handleRoleSwitch("lecturer")}
            className={`w-full text-left px-2 py-1 text-xs rounded ${
              user?.role === "lecturer"
                ? "bg-green-100 text-green-700"
                : "hover:bg-gray-100"
            }`}
          >
            👨‍🏫 Switch to Lecturer
          </button>
          <button
            onClick={() => handleRoleSwitch("admin")}
            className={`w-full text-left px-2 py-1 text-xs rounded ${
              user?.role === "admin"
                ? "bg-red-100 text-red-700"
                : "hover:bg-gray-100"
            }`}
          >
            👨‍💼 Switch to Admin
          </button>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full text-xs text-red-600 hover:text-red-800"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default DevBypass;
