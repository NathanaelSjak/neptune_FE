import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/Navbar/AdminNavbar";

// Mock data
const mockSubmissions = [
  {
    id: "SUB001",
    studentId: "S001",
    studentName: "John Smith",
    studentNim: "2440001234",
    caseId: "CASE001",
    caseName: "Dynamic Programming Challenge",
    contestId: "C001",
    contestName: "University Programming Challenge 2024",
    classId: "COMP6050",
    className: "Advanced Algorithms",
    language: "C++",
    status: "AC",
    score: 100,
    executionTime: 45,
    memoryUsed: 12.5,
    submittedAt: "2024-06-25T10:30:00",
    judgedAt: "2024-06-25T10:32:00",
    testCases: {
      passed: 15,
      total: 15,
      details: [
        { id: 1, status: "AC", time: 45, memory: 12.5 },
        { id: 2, status: "AC", time: 42, memory: 12.1 },
        { id: 3, status: "AC", time: 48, memory: 12.8 },
      ],
    },
  },
  {
    id: "SUB002",
    studentId: "S002",
    studentName: "Sarah Johnson",
    studentNim: "2440001235",
    caseId: "CASE001",
    caseName: "Dynamic Programming Challenge",
    contestId: "C001",
    contestName: "University Programming Challenge 2024",
    classId: "COMP6050",
    className: "Advanced Algorithms",
    language: "Java",
    status: "WA",
    score: 60,
    executionTime: 120,
    memoryUsed: 45.2,
    submittedAt: "2024-06-25T09:15:00",
    judgedAt: "2024-06-25T09:17:00",
    testCases: {
      passed: 9,
      total: 15,
      details: [
        { id: 1, status: "AC", time: 120, memory: 45.2 },
        { id: 2, status: "WA", time: 118, memory: 44.8 },
        { id: 3, status: "AC", time: 125, memory: 45.5 },
      ],
    },
  },
  {
    id: "SUB003",
    studentId: "S001",
    studentName: "John Smith",
    studentNim: "2440001234",
    caseId: "CASE002",
    caseName: "Graph Algorithms",
    contestId: "C002",
    contestName: "Advanced Algorithms Midterm",
    classId: "COMP6050",
    className: "Advanced Algorithms",
    language: "Python",
    status: "TLE",
    score: 0,
    executionTime: 3000,
    memoryUsed: 128.0,
    submittedAt: "2024-06-24T14:30:00",
    judgedAt: "2024-06-24T14:35:00",
    testCases: {
      passed: 0,
      total: 12,
      details: [
        { id: 1, status: "TLE", time: 3000, memory: 128.0 },
        { id: 2, status: "TLE", time: 3000, memory: 128.0 },
      ],
    },
  },
];

const AdminSubmissions = () => {
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterLanguage, setFilterLanguage] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterContest, setFilterContest] = useState("");
  const [filterDateRange, setFilterDateRange] = useState("");
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
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
      setSubmissions(mockSubmissions);
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

  const openSubmissionModal = (submission) => {
    setSelectedSubmission(submission);
    setShowSubmissionModal(true);
  };

  // Filter submissions
  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      submission.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.studentNim.includes(searchTerm) ||
      submission.caseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || submission.status === filterStatus;
    const matchesLanguage =
      !filterLanguage || submission.language === filterLanguage;
    const matchesClass = !filterClass || submission.classId === filterClass;
    const matchesContest =
      !filterContest || submission.contestId === filterContest;

    let matchesDate = true;
    if (filterDateRange) {
      const submissionDate = new Date(submission.submittedAt);
      const today = new Date();
      const daysAgo = parseInt(filterDateRange);
      const cutoffDate = new Date(
        today.getTime() - daysAgo * 24 * 60 * 60 * 1000
      );
      matchesDate = submissionDate >= cutoffDate;
    }

    return (
      matchesSearch &&
      matchesStatus &&
      matchesLanguage &&
      matchesClass &&
      matchesContest &&
      matchesDate
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "AC":
        return "badge-success";
      case "WA":
        return "badge-error";
      case "TLE":
        return "badge-warning";
      case "MLE":
        return "badge-warning";
      case "RE":
        return "badge-error";
      case "CE":
        return "badge-error";
      case "Queued":
        return "badge-neutral";
      case "Running":
        return "badge-info";
      default:
        return "badge-neutral";
    }
  };

  const getLanguageColor = (language) => {
    switch (language) {
      case "C++":
        return "badge-primary";
      case "Java":
        return "badge-secondary";
      case "Python":
        return "badge-accent";
      case "JavaScript":
        return "badge-warning";
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

  const getUniqueValues = (field) => {
    return [...new Set(submissions.map((s) => s[field]))];
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
      <AdminNavbar user={user} onLogout={handleLogout} />
      <div className="min-h-[80vh] bg-gradient-to-br from-red-100 via-white to-red-200 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white/90 shadow-2xl rounded-2xl p-8 mb-8 border border-red-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-red-700 mb-2">
                  System Submissions
                </h1>
                <p className="text-gray-600">
                  Monitor all submissions across the entire platform
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-700">
                  {filteredSubmissions.length}
                </div>
                <div className="text-sm text-gray-600">Total Submissions</div>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Search submissions..."
                  className="input input-bordered"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="form-control">
                <select
                  className="select select-bordered"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="AC">Accepted</option>
                  <option value="WA">Wrong Answer</option>
                  <option value="TLE">Time Limit Exceeded</option>
                  <option value="MLE">Memory Limit Exceeded</option>
                  <option value="RE">Runtime Error</option>
                  <option value="CE">Compilation Error</option>
                  <option value="Queued">Queued</option>
                  <option value="Running">Running</option>
                </select>
              </div>
              <div className="form-control">
                <select
                  className="select select-bordered"
                  value={filterLanguage}
                  onChange={(e) => setFilterLanguage(e.target.value)}
                >
                  <option value="">All Languages</option>
                  {getUniqueValues("language").map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <select
                  className="select select-bordered"
                  value={filterClass}
                  onChange={(e) => setFilterClass(e.target.value)}
                >
                  <option value="">All Classes</option>
                  {getUniqueValues("classId").map((classId) => (
                    <option key={classId} value={classId}>
                      {classId}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <select
                  className="select select-bordered"
                  value={filterContest}
                  onChange={(e) => setFilterContest(e.target.value)}
                >
                  <option value="">All Contests</option>
                  {getUniqueValues("contestId").map((contestId) => (
                    <option key={contestId} value={contestId}>
                      {contestId}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <select
                  className="select select-bordered"
                  value={filterDateRange}
                  onChange={(e) => setFilterDateRange(e.target.value)}
                >
                  <option value="">All Time</option>
                  <option value="1">Last 24 hours</option>
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="bg-white/90 shadow-2xl rounded-2xl border border-red-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead className="bg-red-50">
                  <tr>
                    <th className="text-red-700">Submission ID</th>
                    <th className="text-red-700">Student</th>
                    <th className="text-red-700">Case</th>
                    <th className="text-red-700">Contest</th>
                    <th className="text-red-700">Class</th>
                    <th className="text-red-700">Language</th>
                    <th className="text-red-700">Status</th>
                    <th className="text-red-700">Score</th>
                    <th className="text-red-700">Performance</th>
                    <th className="text-red-700">Submitted</th>
                    <th className="text-red-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-red-50">
                      <td className="font-mono font-bold text-red-600">
                        {submission.id}
                      </td>
                      <td>
                        <div>
                          <div className="font-semibold">
                            {submission.studentName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {submission.studentNim}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-semibold">
                            {submission.caseName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {submission.caseId}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-semibold">
                            {submission.contestName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {submission.contestId}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-semibold">
                            {submission.className}
                          </div>
                          <div className="text-sm text-gray-500">
                            {submission.classId}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge ${getLanguageColor(
                            submission.language
                          )}`}
                        >
                          {submission.language}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${getStatusColor(
                            submission.status
                          )}`}
                        >
                          {submission.status}
                        </span>
                      </td>
                      <td>
                        <div className="text-center">
                          <div className="font-bold text-lg">
                            {submission.score}
                          </div>
                          <div className="text-xs text-gray-500">points</div>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          <div>Time: {submission.executionTime}ms</div>
                          <div>Memory: {submission.memoryUsed}MB</div>
                          <div>
                            Tests: {submission.testCases.passed}/
                            {submission.testCases.total}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm text-gray-600">
                          {formatDateTime(submission.submittedAt)}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openSubmissionModal(submission)}
                            className="btn btn-xs btn-outline btn-primary"
                          >
                            View
                          </button>
                          <button className="btn btn-xs btn-outline btn-info">
                            Download
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Submission Detail Modal */}
        {showSubmissionModal && selectedSubmission && (
          <div className="modal modal-open">
            <div className="modal-box max-w-4xl">
              <h3 className="font-bold text-lg text-red-700 mb-4">
                Submission Details: {selectedSubmission.id}
              </h3>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Student Information
                  </h4>
                  <div className="space-y-1 text-sm">
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
                      {selectedSubmission.className} (
                      {selectedSubmission.classId})
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Problem Information
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="font-semibold">Case:</span>{" "}
                      {selectedSubmission.caseName}
                    </div>
                    <div>
                      <span className="font-semibold">Contest:</span>{" "}
                      {selectedSubmission.contestName}
                    </div>
                    <div>
                      <span className="font-semibold">Language:</span>{" "}
                      {selectedSubmission.language}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="card bg-blue-50 border border-blue-200 p-4 text-center">
                  <div className="text-2xl font-bold text-blue-700">
                    {selectedSubmission.score}
                  </div>
                  <div className="text-sm text-blue-600">Score</div>
                </div>
                <div className="card bg-green-50 border border-green-200 p-4 text-center">
                  <div className="text-2xl font-bold text-green-700">
                    {selectedSubmission.executionTime}ms
                  </div>
                  <div className="text-sm text-green-600">Execution Time</div>
                </div>
                <div className="card bg-purple-50 border border-purple-200 p-4 text-center">
                  <div className="text-2xl font-bold text-purple-700">
                    {selectedSubmission.memoryUsed}MB
                  </div>
                  <div className="text-sm text-purple-600">Memory Used</div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-2">
                  Test Case Results
                </h4>
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Test Case</th>
                        <th>Status</th>
                        <th>Time (ms)</th>
                        <th>Memory (MB)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSubmission.testCases.details.map((testCase) => (
                        <tr key={testCase.id}>
                          <td className="font-mono">{testCase.id}</td>
                          <td>
                            <span
                              className={`badge ${getStatusColor(
                                testCase.status
                              )}`}
                            >
                              {testCase.status}
                            </span>
                          </td>
                          <td>{testCase.time}</td>
                          <td>{testCase.memory}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Timeline</h4>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="font-semibold">Submitted:</span>{" "}
                      {formatDateTime(selectedSubmission.submittedAt)}
                    </div>
                    <div>
                      <span className="font-semibold">Judged:</span>{" "}
                      {formatDateTime(selectedSubmission.judgedAt)}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="font-semibold">Status:</span>
                      <span
                        className={`badge ${getStatusColor(
                          selectedSubmission.status
                        )} ml-2`}
                      >
                        {selectedSubmission.status}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">Tests Passed:</span>{" "}
                      {selectedSubmission.testCases.passed}/
                      {selectedSubmission.testCases.total}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-action">
                <button
                  className="btn btn-outline"
                  onClick={() => setShowSubmissionModal(false)}
                >
                  Close
                </button>
                <button className="btn btn-primary bg-red-600 hover:bg-red-700 border-red-600">
                  Download Code
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Material Icons font */}
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </div>
    </>
  );
};

export default AdminSubmissions;
