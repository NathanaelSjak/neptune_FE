import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import LecturerNavbar from "./LecturerNavbar";

// Mock submission data for lecturer view
const mockSubmissions = [
  {
    id: 1,
    studentName: "Alice Smith",
    studentNim: "12345678",
    caseId: 1,
    caseTitle: "Sum of Two Numbers",
    contestId: 1,
    contestTitle: "Week 1 Programming Contest",
    classId: 1,
    className: "Programming Fundamentals",
    submittedAt: "2024-06-25T10:30:00",
    status: "Accepted",
    score: 100,
    maxScore: 100,
    language: "Python",
    testCasesPassed: 5,
    totalTestCases: 5,
    executionTime: "0.15s",
    memoryUsed: "12.5 MB",
  },
  {
    id: 2,
    studentName: "Bob Wilson",
    studentNim: "12345679",
    caseId: 2,
    caseTitle: "Palindrome Checker",
    contestId: 1,
    contestTitle: "Week 1 Programming Contest",
    classId: 2,
    className: "Data Structures",
    submittedAt: "2024-06-25T11:15:00",
    status: "Wrong Answer",
    score: 60,
    maxScore: 200,
    language: "C",
    testCasesPassed: 3,
    totalTestCases: 5,
    executionTime: "0.25s",
    memoryUsed: "8.2 MB",
  },
  {
    id: 3,
    studentName: "Charlie Brown",
    studentNim: "12345680",
    caseId: 3,
    caseTitle: "Binary Search Implementation",
    contestId: 1,
    contestTitle: "Week 1 Programming Contest",
    classId: 3,
    className: "Algorithm Design",
    submittedAt: "2024-06-25T12:00:00",
    status: "Time Limit Exceeded",
    score: 0,
    maxScore: 300,
    language: "Java",
    testCasesPassed: 0,
    totalTestCases: 5,
    executionTime: "3.5s",
    memoryUsed: "45.2 MB",
  },
  {
    id: 4,
    studentName: "David Lee",
    studentNim: "12345681",
    caseId: 1,
    caseTitle: "Sum of Two Numbers",
    contestId: 1,
    contestTitle: "Week 1 Programming Contest",
    classId: 1,
    className: "Programming Fundamentals",
    submittedAt: "2024-06-25T13:45:00",
    status: "Compilation Error",
    score: 0,
    maxScore: 100,
    language: "C++",
    testCasesPassed: 0,
    totalTestCases: 5,
    executionTime: "0s",
    memoryUsed: "0 MB",
  },
];

const LecturerSubmissions = () => {
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [filters, setFilters] = useState({
    classId: "all",
    status: "all",
    contestId: "all",
  });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get filters from URL
  const classId = searchParams.get("classId");
  const contestId = searchParams.get("contestId");

  useEffect(() => {
    // Check if user is authenticated and is a lecturer
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const userData = localStorage.getItem("user");

    if (!isAuthenticated || !userData) {
      navigate("/");
      return;
    }

    try {
      const userObj = JSON.parse(userData);

      // Check if user is a lecturer
      if (userObj.role !== "lecturer") {
        navigate("/dashboard");
        return;
      }

      setUser(userObj);

      // Apply URL filters
      if (classId) {
        setFilters((prev) => ({ ...prev, classId }));
      }
      if (contestId) {
        setFilters((prev) => ({ ...prev, contestId }));
      }

      setSubmissions(mockSubmissions);
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/");
    }
  }, [navigate, classId, contestId]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    navigate("/");
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

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter submissions based on current filters
  const filteredSubmissions = submissions.filter((submission) => {
    const classMatch =
      filters.classId === "all" ||
      submission.classId === parseInt(filters.classId);
    const statusMatch =
      filters.status === "all" || submission.status === filters.status;
    const contestMatch =
      filters.contestId === "all" ||
      submission.contestId === parseInt(filters.contestId);
    return classMatch && statusMatch && contestMatch;
  });

  // Get unique classes and contests for filters
  const classes = [
    ...new Set(submissions.map((s) => ({ id: s.classId, name: s.className }))),
  ];
  const contests = [
    ...new Set(
      submissions.map((s) => ({ id: s.contestId, title: s.contestTitle }))
    ),
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      <LecturerNavbar user={user} onLogout={handleLogout} />
      <div className="min-h-[80vh] flex flex-col items-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-2 py-8">
        <div className="bg-white/95 shadow-2xl rounded-2xl p-0 w-full max-w-7xl flex flex-col gap-0 border border-blue-100">
          {/* Header */}
          <div className="flex items-center gap-3 px-8 py-6 border-b border-blue-100 rounded-t-2xl bg-gradient-to-r from-blue-50 to-blue-100">
            <span className="material-icons text-blue-500 text-3xl">
              assignment
            </span>
            <h2 className="text-2xl font-bold text-blue-700">
              Student Submissions Monitor
            </h2>
          </div>

          {/* Filters */}
          <div className="px-8 py-6 border-b border-blue-100 bg-blue-50">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="font-semibold text-gray-700">Class:</label>
                  <select
                    className="select select-bordered select-sm"
                    value={filters.classId}
                    onChange={(e) =>
                      handleFilterChange("classId", e.target.value)
                    }
                  >
                    <option value="all">All Classes</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="font-semibold text-gray-700">Status:</label>
                  <select
                    className="select select-bordered select-sm"
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                  >
                    <option value="all">All Status</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Wrong Answer">Wrong Answer</option>
                    <option value="Time Limit Exceeded">Time Limit</option>
                    <option value="Memory Limit Exceeded">Memory Limit</option>
                    <option value="Compilation Error">Compilation Error</option>
                    <option value="Runtime Error">Runtime Error</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="font-semibold text-gray-700">
                    Contest:
                  </label>
                  <select
                    className="select select-bordered select-sm"
                    value={filters.contestId}
                    onChange={(e) =>
                      handleFilterChange("contestId", e.target.value)
                    }
                  >
                    <option value="all">All Contests</option>
                    {contests.map((contest) => (
                      <option key={contest.id} value={contest.id}>
                        {contest.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                {filteredSubmissions.length} submission
                {filteredSubmissions.length !== 1 ? "s" : ""} found
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Submissions List */}
            <div className="lg:w-1/2 border-r border-blue-100">
              <div className="p-6">
                <h3 className="text-lg font-bold text-blue-700 mb-4">
                  Submissions ({filteredSubmissions.length})
                </h3>

                {filteredSubmissions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No submissions found with current filters
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredSubmissions.map((submission) => (
                      <div
                        key={submission.id}
                        className={`card bg-white border cursor-pointer transition-all duration-200 rounded-lg p-4 ${
                          selectedSubmission?.id === submission.id
                            ? "border-blue-500 shadow-lg"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                        onClick={() => setSelectedSubmission(submission)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-blue-700 text-sm">
                              {submission.studentName} ({submission.studentNim})
                            </h4>
                            <p className="text-xs text-gray-600">
                              {submission.caseTitle} - {submission.className}
                            </p>
                          </div>
                          <div
                            className={`badge ${getStatusColor(
                              submission.status
                            )} badge-sm`}
                          >
                            {submission.status}
                          </div>
                        </div>

                        <div className="text-xs text-gray-600 space-y-1">
                          <div>
                            Score: {submission.score}/{submission.maxScore}
                          </div>
                          <div>
                            Tests: {submission.testCasesPassed}/
                            {submission.totalTestCases}
                          </div>
                          <div>Language: {submission.language}</div>
                          <div>{formatDateTime(submission.submittedAt)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submission Details */}
            <div className="lg:w-1/2">
              {selectedSubmission ? (
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-blue-700">
                        {selectedSubmission.caseTitle}
                      </h3>
                      <p className="text-gray-600">
                        {selectedSubmission.contestTitle}
                      </p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`badge ${getStatusColor(
                          selectedSubmission.status
                        )} badge-lg`}
                      >
                        {selectedSubmission.status}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Score: {selectedSubmission.score}/
                        {selectedSubmission.maxScore}
                      </div>
                    </div>
                  </div>

                  {/* Student Info */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h4 className="font-bold text-blue-700 mb-2">
                      Student Information
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>
                        <span className="font-semibold">Name:</span>{" "}
                        {selectedSubmission.studentName}
                      </div>
                      <div>
                        <span className="font-semibold">NIM:</span>{" "}
                        {selectedSubmission.studentNim}
                      </div>
                      <div>
                        <span className="font-semibold">Class:</span>{" "}
                        {selectedSubmission.className}
                      </div>
                      <div>
                        <span className="font-semibold">Submitted:</span>{" "}
                        {formatDateTime(selectedSubmission.submittedAt)}
                      </div>
                    </div>
                  </div>

                  {/* Submission Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm font-semibold text-gray-700">
                        Execution Time
                      </div>
                      <div className="text-lg text-blue-700">
                        {selectedSubmission.executionTime}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm font-semibold text-gray-700">
                        Memory Used
                      </div>
                      <div className="text-lg text-blue-700">
                        {selectedSubmission.memoryUsed}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm font-semibold text-gray-700">
                        Language
                      </div>
                      <div className="text-lg text-blue-700">
                        {selectedSubmission.language}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm font-semibold text-gray-700">
                        Test Cases
                      </div>
                      <div className="text-lg text-blue-700">
                        {selectedSubmission.testCasesPassed}/
                        {selectedSubmission.totalTestCases}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      to={`/lecturer/submission/${selectedSubmission.id}/details`}
                      className="btn btn-primary btn-sm flex-1"
                    >
                      View Full Details
                    </Link>
                    <button className="btn btn-outline btn-primary btn-sm flex-1">
                      Download Code
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <span className="material-icons text-4xl mb-2">
                      description
                    </span>
                    <p>Select a submission to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Material Icons font */}
          <link
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet"
          />
        </div>
      </div>
    </>
  );
};

export default LecturerSubmissions;
