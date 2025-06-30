import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/Navbar/AdminNavbar";

// Mock data for reports
const mockReportData = {
  systemOverview: {
    totalUsers: 450,
    totalClasses: 15,
    totalContests: 25,
    totalCases: 120,
    totalSubmissions: 2500,
    activeUsers: 89,
    systemUptime: 99.9,
    averageResponseTime: 245,
  },
  userActivity: {
    dailyActiveUsers: [45, 52, 48, 67, 89, 76, 82],
    weeklySubmissions: [120, 145, 167, 189, 234, 198, 156],
    monthlyGrowth: 12.5,
    topActiveClasses: [
      { name: "Programming Fundamentals", submissions: 456, students: 45 },
      { name: "Advanced Algorithms", submissions: 389, students: 35 },
      { name: "Data Structures", submissions: 234, students: 40 },
    ],
  },
  performanceMetrics: {
    submissionSuccessRate: 78.5,
    averageExecutionTime: 245,
    averageMemoryUsage: 45.2,
    systemLoad: 65.3,
    queueLength: 12,
    errorRate: 2.1,
  },
  contestAnalytics: {
    totalContests: 25,
    activeContests: 3,
    completedContests: 22,
    averageParticipants: 45,
    topContests: [
      {
        name: "University Programming Challenge 2024",
        participants: 150,
        submissions: 450,
      },
      {
        name: "Advanced Algorithms Midterm",
        participants: 35,
        submissions: 89,
      },
      {
        name: "Programming Fundamentals Final",
        participants: 45,
        submissions: 120,
      },
    ],
  },
  recentActivity: [
    {
      id: 1,
      type: "submission",
      description:
        "New submission from John Smith for Dynamic Programming Challenge",
      timestamp: "2024-06-25T11:30:00",
      user: "John Smith",
      details: "Score: 100, Language: C++",
    },
    {
      id: 2,
      type: "contest",
      description: "New contest created: Programming Fundamentals Final",
      timestamp: "2024-06-25T10:15:00",
      user: "Dr. Michael Chen",
      details: "Duration: 120 minutes, Cases: 3",
    },
    {
      id: 3,
      type: "user",
      description: "New user registered: Sarah Johnson",
      timestamp: "2024-06-25T09:45:00",
      user: "System",
      details: "Role: Student, Class: COMP6040",
    },
    {
      id: 4,
      type: "system",
      description: "System maintenance completed",
      timestamp: "2024-06-25T08:30:00",
      user: "System Admin",
      details: "Uptime: 99.9%, Performance improved",
    },
  ],
};

const AdminReports = () => {
  const [user, setUser] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [selectedReport, setSelectedReport] = useState("overview");
  const [dateRange, setDateRange] = useState("7d");
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication and role
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const userData = localStorage.getItem("user");

    if (!isAuthenticated || !userData) {
      navigate("/");
      return;
    }

    try {
      const userObj = JSON.parse(userData);
      if (userObj.role !== "admin") {
        navigate("/");
        return;
      }

      setUser(userObj);
      setReportData(mockReportData);
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

  const getActivityIcon = (type) => {
    switch (type) {
      case "submission":
        return "code";
      case "contest":
        return "emoji_events";
      case "user":
        return "person_add";
      case "system":
        return "settings";
      default:
        return "info";
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "submission":
        return "text-blue-600";
      case "contest":
        return "text-green-600";
      case "user":
        return "text-purple-600";
      case "system":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  if (!user || !reportData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      <AdminNavbar user={user} onLogout={handleLogout} />
      <div className="min-h-[80vh] bg-gradient-to-br from-red-100 via-white to-red-200 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white/90 shadow-2xl rounded-2xl p-8 mb-8 border border-red-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-red-700 mb-2">
                  System Reports
                </h1>
                <p className="text-gray-600">
                  Comprehensive analytics and system performance metrics
                </p>
              </div>
              <div className="flex gap-2">
                <select
                  className="select select-bordered"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="1d">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
                <button className="btn btn-primary bg-red-600 hover:bg-red-700 border-red-600">
                  <span className="material-icons mr-2">download</span>
                  Export Report
                </button>
              </div>
            </div>

            {/* Report Navigation */}
            <div className="flex gap-2 mb-6">
              <button
                className={`btn ${
                  selectedReport === "overview" ? "btn-primary" : "btn-outline"
                }`}
                onClick={() => setSelectedReport("overview")}
              >
                System Overview
              </button>
              <button
                className={`btn ${
                  selectedReport === "performance"
                    ? "btn-primary"
                    : "btn-outline"
                }`}
                onClick={() => setSelectedReport("performance")}
              >
                Performance
              </button>
              <button
                className={`btn ${
                  selectedReport === "users" ? "btn-primary" : "btn-outline"
                }`}
                onClick={() => setSelectedReport("users")}
              >
                User Analytics
              </button>
              <button
                className={`btn ${
                  selectedReport === "contests" ? "btn-primary" : "btn-outline"
                }`}
                onClick={() => setSelectedReport("contests")}
              >
                Contest Analytics
              </button>
            </div>
          </div>

          {/* System Overview */}
          {selectedReport === "overview" && (
            <div className="space-y-8">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="card bg-blue-50 border border-blue-200 shadow-lg rounded-xl p-6 text-center">
                  <span className="material-icons text-blue-500 text-3xl mb-2">
                    people
                  </span>
                  <div className="text-2xl font-bold text-blue-700">
                    {reportData.systemOverview.totalUsers}
                  </div>
                  <div className="text-sm text-blue-600">Total Users</div>
                  <div className="text-xs text-blue-500 mt-1">
                    {reportData.systemOverview.activeUsers} active
                  </div>
                </div>

                <div className="card bg-green-50 border border-green-200 shadow-lg rounded-xl p-6 text-center">
                  <span className="material-icons text-green-500 text-3xl mb-2">
                    assignment
                  </span>
                  <div className="text-2xl font-bold text-green-700">
                    {reportData.systemOverview.totalSubmissions}
                  </div>
                  <div className="text-sm text-green-600">
                    Total Submissions
                  </div>
                </div>

                <div className="card bg-purple-50 border border-purple-200 shadow-lg rounded-xl p-6 text-center">
                  <span className="material-icons text-purple-500 text-3xl mb-2">
                    school
                  </span>
                  <div className="text-2xl font-bold text-purple-700">
                    {reportData.systemOverview.totalClasses}
                  </div>
                  <div className="text-sm text-purple-600">Total Classes</div>
                </div>

                <div className="card bg-orange-50 border border-orange-200 shadow-lg rounded-xl p-6 text-center">
                  <span className="material-icons text-orange-500 text-3xl mb-2">
                    emoji_events
                  </span>
                  <div className="text-2xl font-bold text-orange-700">
                    {reportData.systemOverview.totalContests}
                  </div>
                  <div className="text-sm text-orange-600">Total Contests</div>
                </div>
              </div>

              {/* System Health */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card bg-white border border-gray-200 shadow-lg rounded-xl p-6">
                  <h3 className="font-bold text-gray-700 mb-4">
                    System Health
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Uptime</span>
                      <span className="font-semibold text-green-600">
                        {reportData.systemOverview.systemUptime}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Response Time</span>
                      <span className="font-semibold">
                        {reportData.systemOverview.averageResponseTime}ms
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Queue Length</span>
                      <span className="font-semibold">
                        {reportData.performanceMetrics.queueLength}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card bg-white border border-gray-200 shadow-lg rounded-xl p-6">
                  <h3 className="font-bold text-gray-700 mb-4">
                    Performance Metrics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Success Rate</span>
                      <span className="font-semibold text-green-600">
                        {reportData.performanceMetrics.submissionSuccessRate}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Execution</span>
                      <span className="font-semibold">
                        {reportData.performanceMetrics.averageExecutionTime}ms
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Error Rate</span>
                      <span className="font-semibold text-red-600">
                        {reportData.performanceMetrics.errorRate}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card bg-white border border-gray-200 shadow-lg rounded-xl p-6">
                  <h3 className="font-bold text-gray-700 mb-4">Growth</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Monthly Growth</span>
                      <span className="font-semibold text-green-600">
                        +{reportData.userActivity.monthlyGrowth}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Users</span>
                      <span className="font-semibold">
                        {reportData.systemOverview.activeUsers}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>System Load</span>
                      <span className="font-semibold">
                        {reportData.performanceMetrics.systemLoad}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Performance Report */}
          {selectedReport === "performance" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-white border border-gray-200 shadow-lg rounded-xl p-6">
                  <h3 className="font-bold text-gray-700 mb-4">
                    Submission Performance
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Success Rate</span>
                        <span className="font-semibold">
                          {reportData.performanceMetrics.submissionSuccessRate}%
                        </span>
                      </div>
                      <progress
                        className="progress progress-success w-full"
                        value={
                          reportData.performanceMetrics.submissionSuccessRate
                        }
                        max="100"
                      ></progress>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Average Execution Time</span>
                        <span className="font-semibold">
                          {reportData.performanceMetrics.averageExecutionTime}ms
                        </span>
                      </div>
                      <progress
                        className="progress progress-info w-full"
                        value={
                          reportData.performanceMetrics.averageExecutionTime /
                          10
                        }
                        max="100"
                      ></progress>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Memory Usage</span>
                        <span className="font-semibold">
                          {reportData.performanceMetrics.averageMemoryUsage}MB
                        </span>
                      </div>
                      <progress
                        className="progress progress-warning w-full"
                        value={
                          reportData.performanceMetrics.averageMemoryUsage / 2
                        }
                        max="100"
                      ></progress>
                    </div>
                  </div>
                </div>

                <div className="card bg-white border border-gray-200 shadow-lg rounded-xl p-6">
                  <h3 className="font-bold text-gray-700 mb-4">
                    System Performance
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>System Load</span>
                        <span className="font-semibold">
                          {reportData.performanceMetrics.systemLoad}%
                        </span>
                      </div>
                      <progress
                        className="progress progress-primary w-full"
                        value={reportData.performanceMetrics.systemLoad}
                        max="100"
                      ></progress>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Queue Length</span>
                        <span className="font-semibold">
                          {reportData.performanceMetrics.queueLength}
                        </span>
                      </div>
                      <progress
                        className="progress progress-secondary w-full"
                        value={reportData.performanceMetrics.queueLength * 5}
                        max="100"
                      ></progress>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Error Rate</span>
                        <span className="font-semibold text-red-600">
                          {reportData.performanceMetrics.errorRate}%
                        </span>
                      </div>
                      <progress
                        className="progress progress-error w-full"
                        value={reportData.performanceMetrics.errorRate * 10}
                        max="100"
                      ></progress>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Analytics */}
          {selectedReport === "users" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-white border border-gray-200 shadow-lg rounded-xl p-6">
                  <h3 className="font-bold text-gray-700 mb-4">
                    Most Active Classes
                  </h3>
                  <div className="space-y-3">
                    {reportData.userActivity.topActiveClasses.map(
                      (classItem, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-2 bg-gray-50 rounded"
                        >
                          <div>
                            <div className="font-semibold">
                              {classItem.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {classItem.students} students
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-blue-600">
                              {classItem.submissions}
                            </div>
                            <div className="text-xs text-gray-500">
                              submissions
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="card bg-white border border-gray-200 shadow-lg rounded-xl p-6">
                  <h3 className="font-bold text-gray-700 mb-4">User Growth</h3>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        +{reportData.userActivity.monthlyGrowth}%
                      </div>
                      <div className="text-sm text-gray-600">
                        Monthly Growth
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-xl font-bold">
                          {reportData.systemOverview.activeUsers}
                        </div>
                        <div className="text-xs text-gray-600">
                          Active Users
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold">
                          {reportData.systemOverview.totalUsers}
                        </div>
                        <div className="text-xs text-gray-600">Total Users</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contest Analytics */}
          {selectedReport === "contests" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-white border border-gray-200 shadow-lg rounded-xl p-6">
                  <h3 className="font-bold text-gray-700 mb-4">
                    Contest Statistics
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {reportData.contestAnalytics.totalContests}
                        </div>
                        <div className="text-xs text-gray-600">Total</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {reportData.contestAnalytics.activeContests}
                        </div>
                        <div className="text-xs text-gray-600">Active</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {reportData.contestAnalytics.completedContests}
                        </div>
                        <div className="text-xs text-gray-600">Completed</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">
                        {reportData.contestAnalytics.averageParticipants}
                      </div>
                      <div className="text-sm text-gray-600">
                        Average Participants per Contest
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card bg-white border border-gray-200 shadow-lg rounded-xl p-6">
                  <h3 className="font-bold text-gray-700 mb-4">Top Contests</h3>
                  <div className="space-y-3">
                    {reportData.contestAnalytics.topContests.map(
                      (contest, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-2 bg-gray-50 rounded"
                        >
                          <div>
                            <div className="font-semibold">{contest.name}</div>
                            <div className="text-sm text-gray-500">
                              {contest.participants} participants
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-blue-600">
                              {contest.submissions}
                            </div>
                            <div className="text-xs text-gray-500">
                              submissions
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="bg-white/90 shadow-2xl rounded-2xl border border-red-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-red-100 bg-gradient-to-r from-red-50 to-red-100">
              <h2 className="text-xl font-bold text-red-700">
                Recent Activity
              </h2>
            </div>
            <div className="p-8">
              <div className="space-y-4">
                {reportData.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="card bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`material-icons ${getActivityColor(
                          activity.type
                        )} text-xl`}
                      >
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
                        <div className="text-xs text-gray-400 mt-1">
                          {activity.details}
                        </div>
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

export default AdminReports;
