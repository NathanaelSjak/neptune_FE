import React from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/classes", label: "Classes" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/contests", label: "Contests" },
  { to: "/admin/cases", label: "Cases" },
  { to: "/admin/submissions", label: "Submissions" },
  { to: "/admin/reports", label: "Reports" },
  { to: "/admin/settings", label: "Settings" },
];

const AdminNavbar = ({ user, onLogout }) => {
  const location = useLocation();

  return (
    <div className="navbar bg-gradient-to-r from-red-50 via-white to-red-100 shadow-lg rounded-b-xl px-8 py-4 flex justify-between items-center mb-10">
      {/* Left: Logo + Links */}
      <div className="flex items-center gap-8">
        <Link
          to="/admin/dashboard"
          className="font-extrabold text-2xl text-red-700 tracking-wide hover:text-red-900 transition-colors"
        >
          NEPTUNE ADMIN
        </Link>
        <div className="hidden lg:flex gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                location.pathname === link.to
                  ? "bg-red-100 text-red-700 shadow"
                  : "text-gray-700 hover:bg-red-50 hover:text-red-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Right: User Info and Logout */}
      <div className="flex flex-col items-end">
        <div className="bg-white/80 border border-red-100 rounded-lg px-4 py-2 shadow flex flex-col items-end">
          <span className="font-bold text-red-700 text-base">
            {user?.name || "Admin"}
          </span>
          <span className="text-xs text-gray-600">
            {user?.email || "admin@binus.ac.id"}
          </span>
          <span className="text-xs text-red-600 font-semibold">
            System Administrator
          </span>
          <button
            className="btn btn-sm btn-outline btn-error mt-2 w-full"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
