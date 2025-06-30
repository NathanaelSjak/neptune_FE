import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

// Mock case detail data
const mockCaseDetail = {
  id: 1,
  title: "Sum of Two Numbers",
  difficulty: "Easy",
  timeLimit: "1 second",
  memoryLimit: "256 MB",
  points: 100,
  description: `Write a program that reads two integers from standard input and prints their sum.

Input Format:
- The first line contains an integer T (1 ≤ T ≤ 100), the number of test cases.
- Each of the next T lines contains two space-separated integers A and B (1 ≤ A, B ≤ 10^9).

Output Format:
- For each test case, print a single line containing the sum of A and B.

Example:
Input:
3
1 2
5 7
10 20

Output:
3
12
30`,
  constraints: [
    "1 ≤ T ≤ 100",
    "1 ≤ A, B ≤ 10^9",
    "All input values are integers",
  ],
  sampleInput: `3
1 2
5 7
10 20`,
  sampleOutput: `3
12
30`,
  caseFile: {
    name: "sum_of_two_numbers.pdf",
    size: "245 KB",
    type: "application/pdf",
  },
  submissions: 20,
  solved: 15,
  contestId: 1,
  contestTitle: "Week 1 Programming Contest",
  // Mock submission history for this case
  userSubmissions: [
    {
      id: 1,
      submittedAt: "2024-06-25T10:30:00",
      status: "Accepted",
      score: 100,
      language: "Python",
      testCasesPassed: 5,
      totalTestCases: 5,
    },
    {
      id: 2,
      submittedAt: "2024-06-25T09:45:00",
      status: "Wrong Answer",
      score: 60,
      language: "C",
      testCasesPassed: 3,
      totalTestCases: 5,
    },
  ],
};

const CaseDetail = () => {
  const [user, setUser] = useState(null);
  const [caseDetail, setCaseDetail] = useState(null);
  const [activeTab, setActiveTab] = useState("description"); // description, constraints, samples, submissions
  const { caseId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const userData = localStorage.getItem("user");

    if (!isAuthenticated || !userData) {
      navigate("/");
      return;
    }

    try {
      const userObj = JSON.parse(userData);
      setUser(userObj);

      // In real implementation, fetch case details from API
      // For now, use mock data
      setCaseDetail(mockCaseDetail);
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/");
    }
  }, [navigate, caseId]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "badge-success";
      case "medium":
        return "badge-warning";
      case "hard":
        return "badge-error";
      default:
        return "badge-neutral";
    }
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

  const handleDownloadCaseFile = () => {
    // In real implementation, this would download the actual file
    // For now, simulate download
    const link = document.createElement("a");
    link.href = "#";
    link.download = caseDetail.caseFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show success message
    alert(`Downloading ${caseDetail.caseFile.name}...`);
  };

  if (!user || !caseDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="min-h-[80vh] flex flex-col items-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-2 py-8">
        <div className="bg-white/95 shadow-2xl rounded-2xl p-0 w-full max-w-4xl flex flex-col gap-0 border border-blue-100">
          {/* Case Header */}
          <div className="px-8 py-6 border-b border-blue-100 rounded-t-2xl bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="material-icons text-blue-500 text-3xl">
                  assignment
                </span>
                <div>
                  <h2 className="text-2xl font-bold text-blue-700">
                    {caseDetail.title}
                  </h2>
                  <p className="text-gray-600">{caseDetail.contestTitle}</p>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`badge ${getDifficultyColor(
                    caseDetail.difficulty
                  )} badge-lg`}
                >
                  {caseDetail.difficulty}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {caseDetail.points} points
                </div>
              </div>
            </div>
          </div>

          {/* Case Info */}
          <div className="px-8 py-4 bg-blue-50 border-b border-blue-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-semibold text-blue-700">Time Limit:</span>
                <div className="text-gray-600">{caseDetail.timeLimit}</div>
              </div>
              <div>
                <span className="font-semibold text-blue-700">
                  Memory Limit:
                </span>
                <div className="text-gray-600">{caseDetail.memoryLimit}</div>
              </div>
              <div>
                <span className="font-semibold text-blue-700">
                  Success Rate:
                </span>
                <div className="text-gray-600">
                  {Math.round(
                    (caseDetail.solved / caseDetail.submissions) * 100
                  )}
                  % ({caseDetail.solved}/{caseDetail.submissions})
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-blue-100">
            <button
              className={`flex-1 tab tab-lg tab-bordered text-lg font-semibold transition-colors duration-200 ${
                activeTab === "description"
                  ? "tab-active bg-blue-100 text-blue-700 border-b-2 border-blue-500"
                  : "bg-white text-gray-600 hover:bg-blue-50"
              }`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={`flex-1 tab tab-lg tab-bordered text-lg font-semibold transition-colors duration-200 ${
                activeTab === "constraints"
                  ? "tab-active bg-blue-100 text-blue-700 border-b-2 border-blue-500"
                  : "bg-white text-gray-600 hover:bg-blue-50"
              }`}
              onClick={() => setActiveTab("constraints")}
            >
              Constraints
            </button>
            <button
              className={`flex-1 tab tab-lg tab-bordered text-lg font-semibold transition-colors duration-200 ${
                activeTab === "samples"
                  ? "tab-active bg-blue-100 text-blue-700 border-b-2 border-blue-500"
                  : "bg-white text-gray-600 hover:bg-blue-50"
              }`}
              onClick={() => setActiveTab("samples")}
            >
              Sample I/O
            </button>
            <button
              className={`flex-1 tab tab-lg tab-bordered text-lg font-semibold transition-colors duration-200 ${
                activeTab === "submissions"
                  ? "tab-active bg-blue-100 text-blue-700 border-b-2 border-blue-500"
                  : "bg-white text-gray-600 hover:bg-blue-50"
              }`}
              onClick={() => setActiveTab("submissions")}
            >
              My Submissions
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === "description" && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-blue-700 mb-4">
                  Problem Description
                </h3>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                    {caseDetail.description}
                  </pre>
                </div>
              </div>
            )}

            {activeTab === "constraints" && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-blue-700 mb-4">
                  Constraints
                </h3>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                    {caseDetail.constraints.map((constraint, index) => (
                      <li key={index} className="font-mono">
                        {constraint}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "samples" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-blue-700 mb-4">
                  Sample Input and Output
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-blue-700 mb-2">
                      Sample Input:
                    </h4>
                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                      <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                        {caseDetail.sampleInput}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-blue-700 mb-2">
                      Sample Output:
                    </h4>
                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                      <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                        {caseDetail.sampleOutput}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "submissions" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-blue-700">
                    My Submissions
                  </h3>
                  <Link
                    to={`/submission-history?caseId=${caseId}`}
                    className="btn btn-outline btn-primary btn-sm"
                  >
                    View Full History
                  </Link>
                </div>

                {caseDetail.userSubmissions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No submissions yet. Be the first to solve this case!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {caseDetail.userSubmissions.map((submission) => (
                      <div
                        key={submission.id}
                        className="card bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div
                              className={`badge ${getStatusColor(
                                submission.status
                              )} badge-sm`}
                            >
                              {submission.status}
                            </div>
                            <span className="text-sm text-gray-600">
                              {submission.language}
                            </span>
                          </div>
                          <div className="text-right text-sm text-gray-600">
                            {formatDateTime(submission.submittedAt)}
                          </div>
                        </div>

                        <div className="text-sm text-gray-600 space-y-1">
                          <div>
                            Score: {submission.score}/{caseDetail.points}
                          </div>
                          <div>
                            Test Cases: {submission.testCasesPassed}/
                            {submission.totalTestCases}
                          </div>
                        </div>

                        <div className="mt-3 flex gap-2">
                          <Link
                            to={`/submission-history?caseId=${caseId}`}
                            className="btn btn-outline btn-primary btn-xs"
                          >
                            View Details
                          </Link>
                          {submission.status !== "Accepted" && (
                            <Link
                              to={`/submission?caseId=${caseId}`}
                              className="btn btn-primary btn-xs"
                            >
                              Try Again
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="px-8 py-6 border-t border-blue-100 bg-gray-50 rounded-b-2xl">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleDownloadCaseFile}
                  className="btn btn-outline btn-primary btn-sm"
                >
                  <span className="material-icons text-sm mr-1">download</span>
                  Download Case File
                </button>
                <div className="text-sm text-gray-600">
                  {caseDetail.caseFile.name} ({caseDetail.caseFile.size})
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/contest/${caseDetail.contestId}`}
                  className="btn btn-outline btn-secondary btn-sm"
                >
                  Back to Contest
                </Link>
                <Link
                  to={`/submission?caseId=${caseId}`}
                  className="btn btn-primary btn-sm"
                >
                  Submit Solution
                </Link>
              </div>
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

export default CaseDetail;
