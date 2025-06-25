import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Submission from "./Submission";
import Leaderboard from "./Leaderboard";
import Contests from "./Contests";
import ContestDetail from "./ContestDetail";
import CaseDetail from "./CaseDetail";
import SubmissionHistory from "./SubmissionHistory";
import LecturerDashboard from "./LecturerDashboard";
import LecturerSubmissions from "./LecturerSubmissions";
import LecturerContests from "./LecturerContests";
import LecturerDownloads from "./LecturerDownloads";
import AdminDashboard from "./AdminDashboard";
import AdminClasses from "./AdminClasses";
import AdminUsers from "./AdminUsers";
import AdminContests from "./AdminContests";
import AdminCases from "./AdminCases";
import AdminSubmissions from "./AdminSubmissions";
import AdminReports from "./AdminReports";

// Protected Route Component for Students
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

// Protected Route Component for Lecturers
const LecturerRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const userData = localStorage.getItem("user");

  if (!isAuthenticated || !userData) {
    return <Navigate to="/" replace />;
  }

  try {
    const user = JSON.parse(userData);
    if (user.role !== "lecturer") {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  } catch (error) {
    return <Navigate to="/" replace />;
  }
};

// Protected Route Component for Students
const StudentRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const userData = localStorage.getItem("user");

  if (!isAuthenticated || !userData) {
    return <Navigate to="/" replace />;
  }

  try {
    const user = JSON.parse(userData);
    if (user.role !== "student") {
      return <Navigate to="/lecturer/dashboard" replace />;
    }
    return children;
  } catch (error) {
    return <Navigate to="/" replace />;
  }
};

// Protected Route Component for Admins
const AdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const userData = localStorage.getItem("user");

  if (!isAuthenticated || !userData) {
    return <Navigate to="/" replace />;
  }

  try {
    const user = JSON.parse(userData);
    if (user.role !== "admin") {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  } catch (error) {
    return <Navigate to="/" replace />;
  }
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Student Routes */}
        <Route
          path="/dashboard"
          element={
            <StudentRoute>
              <Dashboard />
            </StudentRoute>
          }
        />
        <Route
          path="/submission"
          element={
            <StudentRoute>
              <Submission />
            </StudentRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <StudentRoute>
              <Leaderboard />
            </StudentRoute>
          }
        />
        <Route
          path="/contests"
          element={
            <StudentRoute>
              <Contests />
            </StudentRoute>
          }
        />
        <Route
          path="/contest/:contestId"
          element={
            <StudentRoute>
              <ContestDetail />
            </StudentRoute>
          }
        />
        <Route
          path="/case/:caseId"
          element={
            <StudentRoute>
              <CaseDetail />
            </StudentRoute>
          }
        />
        <Route
          path="/submission-history"
          element={
            <StudentRoute>
              <SubmissionHistory />
            </StudentRoute>
          }
        />

        {/* Lecturer Routes */}
        <Route
          path="/lecturer/dashboard"
          element={
            <LecturerRoute>
              <LecturerDashboard />
            </LecturerRoute>
          }
        />
        <Route
          path="/lecturer/submissions"
          element={
            <LecturerRoute>
              <LecturerSubmissions />
            </LecturerRoute>
          }
        />
        <Route
          path="/lecturer/contests"
          element={
            <LecturerRoute>
              <LecturerContests />
            </LecturerRoute>
          }
        />
        <Route
          path="/lecturer/downloads"
          element={
            <LecturerRoute>
              <LecturerDownloads />
            </LecturerRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/classes"
          element={
            <AdminRoute>
              <AdminClasses />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/contests"
          element={
            <AdminRoute>
              <AdminContests />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/cases"
          element={
            <AdminRoute>
              <AdminCases />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/submissions"
          element={
            <AdminRoute>
              <AdminSubmissions />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <AdminRoute>
              <AdminReports />
            </AdminRoute>
          }
        />

        {/* Redirect any unknown routes to appropriate dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
