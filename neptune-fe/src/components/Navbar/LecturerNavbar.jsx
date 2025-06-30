import React from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/lecturer/dashboard", label: "Dashboard" },
  { to: "/lecturer/classes", label: "My Classes" },
  { to: "/lecturer/contests", label: "Contests" },
  { to: "/lecturer/submissions", label: "Submissions" },
  { to: "/lecturer/downloads", label: "Downloads" },
];

const LecturerNavbar = ({ user, onLogout }) => {
  const location = useLocation();

  return (
    <div className="navbar bg-gradient-to-r from-blue-50 via-white to-blue-100 shadow-lg rounded-b-xl px-8 py-4 flex justify-between items-center mb-10">
      {/* Left: Logo + Links */}
      <div className="flex items-center gap-8">
        <Link
          to="/lecturer/dashboard"
          className="font-extrabold text-2xl text-blue-700 tracking-wide hover:text-blue-900 transition-colors"
        >
          NEPTUNE
        </Link>
        <div className="hidden md:flex gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                location.pathname === link.to
                  ? "bg-blue-100 text-blue-700 shadow"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Right: User Info and Logout */}
      <div className="flex flex-col items-end">
        <div className="bg-white/80 border border-blue-100 rounded-lg px-4 py-2 shadow flex flex-col items-end">
          <span className="font-bold text-blue-700 text-base">
            {user?.name || "Lecturer"}
          </span>
          <span className="text-xs text-gray-600">
            {user?.email || "lecturer@binus.ac.id"}
          </span>
          <span className="text-xs text-blue-600 font-semibold">Lecturer</span>
          <button
            className="btn btn-sm btn-outline btn-primary mt-2 w-full"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LecturerNavbar;
