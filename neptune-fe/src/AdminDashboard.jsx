import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

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
  const [user, setUser] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated and is an admin
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const userData = localStorage.getItem("user");

    if (!isAuthenticated || !userData) {
      navigate("/");
      return;
    }

    try {
      const userObj = JSON.parse(userData);

      // Check if user is an admin
      if (userObj.role !== "admin") {
        if (userObj.role === "lecturer") {
          navigate("/lecturer/dashboard");
        } else {
          navigate("/dashboard");
        }
        return;
      }

      setUser(userObj);
      setAdminData(mockAdminData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

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
        Loading...
      </div>
    );
  }

  return (
    <>
      <AdminNavbar user={user} onLogout={handleLogout} />
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="card bg-white border border-gray-200 shadow-lg rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-icons text-blue-500 text-2xl">
                      assignment
                    </span>
                    <h3 className="font-bold text-blue-700">
                      Cases & Submissions
                    </h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold">Total Cases:</span>{" "}
                      {adminData.systemStats.totalCases}
                    </div>
                    <div>
                      <span className="font-semibold">Total Submissions:</span>{" "}
                      {adminData.systemStats.totalSubmissions}
                    </div>
                    <div>
                      <span className="font-semibold">Active Contests:</span>{" "}
                      {adminData.systemStats.activeContests}
                    </div>
                  </div>
                </div>

                <div className="card bg-white border border-gray-200 shadow-lg rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-icons text-green-500 text-2xl">
                      health_and_safety
                    </span>
                    <h3 className="font-bold text-green-700">System Health</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold">Status:</span>{" "}
                      {adminData.systemStats.systemHealth}
                    </div>
                    <div>
                      <span className="font-semibold">Uptime:</span> 99.9%
                    </div>
                    <div>
                      <span className="font-semibold">Last Backup:</span> 2
                      hours ago
                    </div>
                  </div>
                </div>

                <div className="card bg-white border border-gray-200 shadow-lg rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-icons text-purple-500 text-2xl">
                      settings
                    </span>
                    <h3 className="font-bold text-purple-700">Quick Actions</h3>
                  </div>
                  <div className="space-y-2">
                    <Link
                      to="/admin/classes"
                      className="btn btn-primary btn-sm w-full"
                    >
                      Manage Classes
                    </Link>
                    <Link
                      to="/admin/users"
                      className="btn btn-outline btn-primary btn-sm w-full"
                    >
                      Manage Users
                    </Link>
                    <Link
                      to="/admin/contests"
                      className="btn btn-outline btn-primary btn-sm w-full"
                    >
                      Manage Contests
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Alerts */}
        <div className="w-full max-w-6xl mb-8">
          <div className="bg-white/95 shadow-2xl rounded-2xl p-0 border border-blue-100">
            <div className="flex items-center gap-3 px-8 py-6 border-b border-blue-100 rounded-t-2xl bg-gradient-to-r from-blue-50 to-blue-100">
              <span className="material-icons text-blue-500 text-3xl">
                notifications
              </span>
              <h2 className="text-2xl font-bold text-blue-700">
                System Alerts
              </h2>
            </div>

            <div className="p-8">
              {adminData.systemAlerts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No system alerts at this time
                </div>
              ) : (
                <div className="space-y-3">
                  {adminData.systemAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`alert ${getAlertColor(alert.type)}`}
                    >
                      <span className="material-icons">
                        {alert.type === "warning"
                          ? "warning"
                          : alert.type === "error"
                          ? "error"
                          : alert.type === "success"
                          ? "check_circle"
                          : "info"}
                      </span>
                      <div>
                        <div className="font-semibold">{alert.message}</div>
                        <div className="text-xs opacity-75">
                          {formatDateTime(alert.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="w-full max-w-6xl">
          <div className="bg-white/95 shadow-2xl rounded-2xl p-0 border border-blue-100">
            <div className="flex items-center gap-3 px-8 py-6 border-b border-blue-100 rounded-t-2xl bg-gradient-to-r from-blue-50 to-blue-100">
              <span className="material-icons text-blue-500 text-3xl">
                history
              </span>
              <h2 className="text-2xl font-bold text-blue-700">
                Recent Activities
              </h2>
            </div>

            <div className="p-8">
              {adminData.recentActivities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No recent activities
                </div>
              ) : (
                <div className="space-y-3">
                  {adminData.recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="card bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-icons text-blue-500 text-xl">
                          {getActivityIcon(activity.type)}
                        </span>
                        <div className="flex-1">
                          <div className="text-sm text-gray-700">
                            {activity.description}
                          </div>
                          <div className="text-xs text-gray-500">
                            by {activity.user} •{" "}
                            {formatDateTime(activity.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
