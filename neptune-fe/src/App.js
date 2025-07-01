import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuthState } from "./hooks/useAuth";
import Login from "./pages/User/Login";
import Dashboard from "./pages/User/Dashboard";
import Submission from "./pages/User/Submission";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import Contests from "./pages/Admin/ContestsList";
import ContestDetail from "./pages/Admin/ContestDetail";
import CaseDetail from "./pages/Admin/CaseDetail";
import SubmissionHistory from "./pages/User/SubmissionHistory";
import LecturerDashboard from "./pages/Lecturer/Dashboard";
import LecturerSubmissions from "./pages/Lecturer/Submissions";
import LecturerContests from "./pages/Lecturer/Contests";
import LecturerDownloads from "./pages/Lecturer/Downloads";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminClasses from "./pages/Admin/Classes";
import AdminUsers from "./pages/Admin/Users";
import AdminContests from "./pages/Admin/Contests";
import AdminCases from "./pages/Admin/Cases";
import AdminSubmissions from "./pages/Admin/Submissions";
import AdminReports from "./pages/Admin/Reports";

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

// Protected Route Component for Students
const StudentRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuthState();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== "student") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Protected Route Component for Lecturers
const LecturerRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuthState();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== "lecturer") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Protected Route Component for Admins
const AdminRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuthState();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Main App Component
const AppRoutes = () => {
  const { loading, isAuthenticated, user } = useAuthState();

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
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
      <Route
        path="*"
        element={
          isAuthenticated && user ? (
            user.role === "admin" ? (
              <Navigate to="/admin/dashboard" replace />
            ) : user.role === "lecturer" ? (
              <Navigate to="/lecturer/dashboard" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
