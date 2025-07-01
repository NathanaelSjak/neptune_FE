import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LecturerNavbar from "../../components/Navbar/LecturerNavbar";
import { useAuthState } from "../../hooks/useAuth";

// Mock lecturer data
const mockLecturerData = {
  id: "L001",
  name: "Dr. Sarah Johnson",
  email: "sarah.johnson@binus.ac.id",
  department: "Computer Science",
  assignedClasses: [
    {
      id: 1,
      name: "Programming Fundamentals",
      code: "COMP6047",
      semester: "2024/2025-1",
      studentCount: 45,
      activeContests: 2,
      totalContests: 5,
    },
    {
      id: 2,
      name: "Data Structures",
      code: "COMP6048",
      semester: "2024/2025-1",
      studentCount: 38,
      activeContests: 1,
      totalContests: 3,
    },
    {
      id: 3,
      name: "Algorithm Design",
      code: "COMP6049",
      semester: "2024/2025-1",
      studentCount: 32,
      activeContests: 0,
      totalContests: 4,
    },
  ],
  recentSubmissions: [
    {
      id: 1,
      studentName: "Alice Smith",
      studentNim: "12345678",
      caseTitle: "Sum of Two Numbers",
      className: "Programming Fundamentals",
      submittedAt: "2024-06-25T10:30:00",
      status: "Accepted",
      score: 100,
    },
    {
      id: 2,
      studentName: "Bob Wilson",
      studentNim: "12345679",
      caseTitle: "Palindrome Checker",
      className: "Data Structures",
      submittedAt: "2024-06-25T11:15:00",
      status: "Wrong Answer",
      score: 60,
    },
    {
      id: 3,
      studentName: "Charlie Brown",
      studentNim: "12345680",
      caseTitle: "Binary Search",
      className: "Algorithm Design",
      submittedAt: "2024-06-25T12:00:00",
      status: "Time Limit Exceeded",
      score: 0,
    },
  ],
};

const LecturerDashboard = () => {
  const { user } = useAuthState();
  const [lecturerData, setLecturerData] = useState(null);

  useEffect(() => {
    // Set mock lecturer data
    setLecturerData(mockLecturerData);
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "badge-success";
      case "Wrong Answer":
        return "badge-error";
      case "Time Limit Exceeded":
        return "badge-warning";
      case "Memory Limit Exceeded":
        return "badge-warning";
      case "Compilation Error":
        return "badge-error";
      case "Runtime Error":
        return "badge-error";
      default:
        return "badge-neutral";
    }
  };

  if (!user || !lecturerData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <LecturerNavbar />
      <div className="min-h-[80vh] flex flex-col items-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-2 py-8">
        <div className="bg-white/90 shadow-2xl rounded-2xl p-10 w-full max-w-2xl flex flex-col items-center mb-12 border border-blue-100">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-3 text-center drop-shadow">
            Lecturer Dashboard
          </h1>
          <p className="text-gray-600 mb-2 text-lg text-center max-w-xl">
            Monitor and manage your assigned classes and student progress.
          </p>
          <div className="text-center text-sm text-blue-600 mt-2">
            <div className="font-semibold">Lecturer: {lecturerData.name}</div>
            <div>Department: {lecturerData.department}</div>
            <div>Email: {lecturerData.email}</div>
          </div>
        </div>

        {/* Assigned Classes */}
        <div className="w-full max-w-6xl mb-8">
          <div className="bg-white/95 shadow-2xl rounded-2xl p-0 border border-blue-100">
            <div className="flex items-center gap-3 px-8 py-6 border-b border-blue-100 rounded-t-2xl bg-gradient-to-r from-blue-50 to-blue-100">
              <span className="material-icons text-blue-500 text-3xl">
                school
              </span>
              <h2 className="text-2xl font-bold text-blue-700">
                Your Assigned Classes
              </h2>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lecturerData.assignedClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="card bg-white border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="material-icons text-blue-500 text-3xl">
                        class
                      </span>
                      <span className="badge badge-primary badge-sm">
                        {cls.code}
                      </span>
                    </div>

                    <h3 className="card-title text-lg font-bold text-blue-700 mb-2">
                      {cls.name}
                    </h3>

                    <div className="text-sm text-gray-600 mb-4 space-y-1">
                      <div>Course Code: {cls.code}</div>
                      <div>Semester: {cls.semester}</div>
                      <div>Students: {cls.studentCount}</div>
                      <div>Active Contests: {cls.activeContests}</div>
                      <div>Total Contests: {cls.totalContests}</div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/lecturer/contests?class=${cls.id}`}
                        className="btn btn-primary btn-sm flex-1"
                      >
                        Manage Contests
                      </Link>
                      <Link
                        to={`/lecturer/submissions?class=${cls.id}`}
                        className="btn btn-outline btn-primary btn-sm flex-1"
                      >
                        View Submissions
                      </Link>
                    </div>
                  </div>
                ))}
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
              to="/lecturer/contests"
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
              to="/lecturer/submissions"
              className="card bg-white/80 border border-blue-100 shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-200 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer group"
            >
              <span className="material-icons text-blue-500 text-4xl mb-2 group-hover:text-blue-700 transition-colors">
                assignment
              </span>
              <h2 className="card-title text-lg font-bold text-blue-700 group-hover:text-blue-900">
                View Submissions
              </h2>
              <p className="text-gray-600 text-center text-sm">
                Review student submissions
              </p>
            </Link>

            <Link
              to="/lecturer/downloads"
              className="card bg-white/80 border border-blue-100 shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-200 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer group"
            >
              <span className="material-icons text-blue-500 text-4xl mb-2 group-hover:text-blue-700 transition-colors">
                download
              </span>
              <h2 className="card-title text-lg font-bold text-blue-700 group-hover:text-blue-900">
                Downloads
              </h2>
              <p className="text-gray-600 text-center text-sm">
                Download reports and data
              </p>
            </Link>

            <Link
              to="/lecturer/classes"
              className="card bg-white/80 border border-blue-100 shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-200 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer group"
            >
              <span className="material-icons text-blue-500 text-4xl mb-2 group-hover:text-blue-700 transition-colors">
                school
              </span>
              <h2 className="card-title text-lg font-bold text-blue-700 group-hover:text-blue-900">
                My Classes
              </h2>
              <p className="text-gray-600 text-center text-sm">
                View class details and stats
              </p>
            </Link>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="w-full max-w-6xl">
          <div className="bg-white/95 shadow-2xl rounded-2xl p-0 border border-blue-100">
            <div className="flex items-center gap-3 px-8 py-6 border-b border-blue-100 rounded-t-2xl bg-gradient-to-r from-blue-50 to-blue-100">
              <span className="material-icons text-blue-500 text-3xl">
                assignment
              </span>
              <h2 className="text-2xl font-bold text-blue-700">
                Recent Submissions
              </h2>
            </div>

            <div className="p-8">
              {lecturerData.recentSubmissions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No recent submissions
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Case</th>
                        <th>Class</th>
                        <th>Status</th>
                        <th>Score</th>
                        <th>Submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lecturerData.recentSubmissions.map((submission) => (
                        <tr key={submission.id}>
                          <td>
                            <div>
                              <div className="font-bold">
                                {submission.studentName}
                              </div>
                              <div className="text-sm opacity-50">
                                {submission.studentNim}
                              </div>
                            </div>
                          </td>
                          <td>{submission.caseTitle}</td>
                          <td>{submission.className}</td>
                          <td>
                            <span
                              className={`badge ${getStatusColor(
                                submission.status
                              )}`}
                            >
                              {submission.status}
                            </span>
                          </td>
                          <td>{submission.score}</td>
                          <td>{formatDateTime(submission.submittedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

export default LecturerDashboard;
