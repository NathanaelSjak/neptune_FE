import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import { useAuthState } from "../../hooks/useAuth";

// Mock admin data
const mockAdminData = {
  id: "A001",
  name: "Dr. Michael Chen",
  email: "michael.chen@binus.ac.id",
  role: "System Administrator",
  department: "Software Laboratory Center",
  systemStats: {
    totalClasses: 15,
    totalStudents: 450,
    totalLecturers: 8,
    totalContests: 25,
    totalCases: 120,
    totalSubmissions: 2500,
    activeContests: 3,
    systemHealth: "Excellent",
  },
  recentActivities: [
    {
      id: 1,
      type: "class_created",
      description: "Created new class: Advanced Algorithms (COMP6050)",
      timestamp: "2024-06-25T10:30:00",
      user: "Dr. Sarah Johnson",
    },
    {
      id: 2,
      type: "user_promoted",
      description: "Promoted John Smith to lecturer role",
      timestamp: "2024-06-25T09:15:00",
      user: "System Admin",
    },
    {
      id: 3,
      type: "contest_created",
      description: "Created global contest: University Programming Challenge",
      timestamp: "2024-06-24T16:45:00",
      user: "Dr. Michael Chen",
    },
    {
      id: 4,
      type: "case_uploaded",
      description: "Uploaded 15 new test cases for Dynamic Programming",
      timestamp: "2024-06-24T14:20:00",
      user: "Dr. Sarah Johnson",
    },
  ],
  systemAlerts: [
    {
      id: 1,
      type: "warning",
      message:
        "High submission volume detected in Programming Fundamentals class",
      timestamp: "2024-06-25T11:00:00",
    },
    {
      id: 2,
      type: "info",
      message: "System maintenance scheduled for tonight at 2:00 AM",
      timestamp: "2024-06-25T08:30:00",
    },
  ],
};

const AdminDashboard = () => {
  const { user } = useAuthState();
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    // Set mock admin data
    setAdminData(mockAdminData);
  }, []);

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAlertColor = (type) => {
    switch (type) {
      case "warning":
        return "alert-warning";
      case "error":
        return "alert-error";
      case "success":
        return "alert-success";
      default:
        return "alert-info";
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "class_created":
        return "school";
      case "user_promoted":
        return "person_add";
      case "contest_created":
        return "emoji_events";
      case "case_uploaded":
        return "upload_file";
      default:
        return "info";
    }
  };

  if (!user || !adminData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="min-h-[80vh] flex flex-col items-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-2 py-8">
        <div className="bg-white/90 shadow-2xl rounded-2xl p-10 w-full max-w-2xl flex flex-col items-center mb-12 border border-blue-100">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-3 text-center drop-shadow">
            System Administration
          </h1>
          <p className="text-gray-600 mb-2 text-lg text-center max-w-xl">
            Manage the entire NEPTUNE platform and oversee all system
            operations.
          </p>
          <div className="text-center text-sm text-blue-600 mt-2">
            <div className="font-semibold">Admin: {adminData.name}</div>
            <div>Role: {adminData.role}</div>
            <div>Department: {adminData.department}</div>
          </div>
        </div>

        {/* System Statistics */}
        <div className="w-full max-w-6xl mb-8">
          <div className="bg-white/95 shadow-2xl rounded-2xl p-0 border border-blue-100">
            <div className="flex items-center gap-3 px-8 py-6 border-b border-blue-100 rounded-t-2xl bg-gradient-to-r from-blue-50 to-blue-100">
              <span className="material-icons text-blue-500 text-3xl">
                analytics
              </span>
              <h2 className="text-2xl font-bold text-blue-700">
                System Overview
              </h2>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="card bg-blue-50 border border-blue-200 shadow-lg rounded-xl p-6 text-center">
                  <span className="material-icons text-blue-500 text-3xl mb-2">
                    school
                  </span>
                  <div className="text-2xl font-bold text-blue-700">
                    {adminData.systemStats.totalClasses}
                  </div>
                  <div className="text-sm text-gray-600">Classes</div>
                </div>

                <div className="card bg-green-50 border border-green-200 shadow-lg rounded-xl p-6 text-center">
                  <span className="material-icons text-green-500 text-3xl mb-2">
                    people
                  </span>
                  <div className="text-2xl font-bold text-green-700">
                    {adminData.systemStats.totalStudents}
                  </div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>

                <div className="card bg-purple-50 border border-purple-200 shadow-lg rounded-xl p-6 text-center">
                  <span className="material-icons text-purple-500 text-3xl mb-2">
                    person
                  </span>
                  <div className="text-2xl font-bold text-purple-700">
                    {adminData.systemStats.totalLecturers}
                  </div>
                  <div className="text-sm text-gray-600">Lecturers</div>
                </div>

                <div className="card bg-orange-50 border border-orange-200 shadow-lg rounded-xl p-6 text-center">
                  <span className="material-icons text-orange-500 text-3xl mb-2">
                    emoji_events
                  </span>
                  <div className="text-2xl font-bold text-orange-700">
                    {adminData.systemStats.totalContests}
                  </div>
                  <div className="text-sm text-gray-600">Contests</div>
                </div>

                <div className="card bg-red-50 border border-red-200 shadow-lg rounded-xl p-6 text-center">
                  <span className="material-icons text-red-500 text-3xl mb-2">
                    description
                  </span>
                  <div className="text-2xl font-bold text-red-700">
                    {adminData.systemStats.totalCases}
                  </div>
                  <div className="text-sm text-gray-600">Test Cases</div>
                </div>

                <div className="card bg-indigo-50 border border-indigo-200 shadow-lg rounded-xl p-6 text-center">
                  <span className="material-icons text-indigo-500 text-3xl mb-2">
                    upload
                  </span>
                  <div className="text-2xl font-bold text-indigo-700">
                    {adminData.systemStats.totalSubmissions}
                  </div>
                  <div className="text-sm text-gray-600">Submissions</div>
                </div>

                <div className="card bg-teal-50 border border-teal-200 shadow-lg rounded-xl p-6 text-center">
                  <span className="material-icons text-teal-500 text-3xl mb-2">
                    play_circle
                  </span>
                  <div className="text-2xl font-bold text-teal-700">
                    {adminData.systemStats.activeContests}
                  </div>
                  <div className="text-sm text-gray-600">Active Contests</div>
                </div>

                <div className="card bg-emerald-50 border border-emerald-200 shadow-lg rounded-xl p-6 text-center">
                  <span className="material-icons text-emerald-500 text-3xl mb-2">
                    health_and_safety
                  </span>
                  <div className="text-lg font-bold text-emerald-700">
                    {adminData.systemStats.systemHealth}
                  </div>
                  <div className="text-sm text-gray-600">System Health</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="w-full max-w-6xl mb-8">
          <h3 className="text-xl font-bold text-blue-700 mb-4 text-center">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/admin/classes"
              className="card bg-white/80 border border-blue-100 shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-200 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer group"
            >
              <span className="material-icons text-blue-500 text-4xl mb-2 group-hover:text-blue-700 transition-colors">
                school
              </span>
              <h2 className="card-title text-lg font-bold text-blue-700 group-hover:text-blue-900">
                Manage Classes
              </h2>
              <p className="text-gray-600 text-center text-sm">
                Create and manage classes
              </p>
            </Link>

            <Link
              to="/admin/users"
              className="card bg-white/80 border border-blue-100 shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-200 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer group"
            >
              <span className="material-icons text-blue-500 text-4xl mb-2 group-hover:text-blue-700 transition-colors">
                people
              </span>
              <h2 className="card-title text-lg font-bold text-blue-700 group-hover:text-blue-900">
                Manage Users
              </h2>
              <p className="text-gray-600 text-center text-sm">
                Manage students and lecturers
              </p>
            </Link>

            <Link
              to="/admin/contests"
              className="card bg-white/80 border border-blue-100 shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-200 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer group"
            >
              <span className="material-icons text-blue-500 text-4xl mb-2 group-hover:text-blue-700 transition-colors">
                emoji_events
              </span>
              <h2 className="card-title text-lg font-bold text-blue-700 group-hover:text-blue-900">
                Manage Contests
              </h2>
              <p className="text-gray-600 text-center text-sm">
                Create and manage contests
              </p>
            </Link>

            <Link
              to="/admin/reports"
              className="card bg-white/80 border border-blue-100 shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-200 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer group"
            >
              <span className="material-icons text-blue-500 text-4xl mb-2 group-hover:text-blue-700 transition-colors">
                assessment
              </span>
              <h2 className="card-title text-lg font-bold text-blue-700 group-hover:text-blue-900">
                View Reports
              </h2>
              <p className="text-gray-600 text-center text-sm">
                System analytics and reports
              </p>
            </Link>
          </div>
        </div>

        {/* Recent Activities and Alerts */}
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <div className="bg-white/95 shadow-2xl rounded-2xl p-0 border border-blue-100">
            <div className="flex items-center gap-3 px-8 py-6 border-b border-blue-100 rounded-t-2xl bg-gradient-to-r from-blue-50 to-blue-100">
              <span className="material-icons text-blue-500 text-3xl">
                history
              </span>
              <h2 className="text-2xl font-bold text-blue-700">
                Recent Activities
              </h2>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {adminData.recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <span className="material-icons text-blue-500 text-xl mt-1">
                      {getActivityIcon(activity.type)}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 mb-1">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{activity.user}</span>
                        <span>•</span>
                        <span>{formatDateTime(activity.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Alerts */}
          <div className="bg-white/95 shadow-2xl rounded-2xl p-0 border border-blue-100">
            <div className="flex items-center gap-3 px-8 py-6 border-b border-blue-100 rounded-t-2xl bg-gradient-to-r from-blue-50 to-blue-100">
              <span className="material-icons text-blue-500 text-3xl">
                notifications
              </span>
              <h2 className="text-2xl font-bold text-blue-700">
                System Alerts
              </h2>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {adminData.systemAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`alert ${getAlertColor(alert.type)} shadow-lg`}
                  >
                    <span className="material-icons">
                      {alert.type === "warning" ? "warning" : "info"}
                    </span>
                    <div>
                      <div className="font-medium">{alert.message}</div>
                      <div className="text-xs opacity-75">
                        {formatDateTime(alert.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Material Icons font */}
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </div>
    </>
  );
};

export default AdminDashboard;
