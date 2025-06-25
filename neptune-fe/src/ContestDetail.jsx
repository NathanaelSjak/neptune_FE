import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

// Mock contest detail data
const mockContestDetail = {
  id: 1,
  title: "Week 1 Programming Contest",
  classId: 1,
  className: "Programming Fundamentals",
  startTime: "2024-06-25T09:00:00",
  endTime: "2024-06-25T11:00:00",
  status: "active",
  description:
    "This contest covers basic programming concepts including variables, loops, and conditional statements. Students will solve problems using C and Python programming languages.",
  caseCount: 3,
  participants: 25,
  type: "weekly",
  cases: [
    {
      id: 1,
      title: "Sum of Two Numbers",
      difficulty: "Easy",
      timeLimit: "1 second",
      memoryLimit: "256 MB",
      points: 100,
      submissions: 20,
      solved: 15,
      userStatus: "Accepted",
      userScore: 100,
      userSubmissions: 2,
    },
    {
      id: 2,
      title: "Palindrome Checker",
      difficulty: "Medium",
      timeLimit: "2 seconds",
      memoryLimit: "512 MB",
      points: 200,
      submissions: 18,
      solved: 12,
      userStatus: "Wrong Answer",
      userScore: 60,
      userSubmissions: 1,
    },
    {
      id: 3,
      title: "Binary Search Implementation",
      difficulty: "Hard",
      timeLimit: "3 seconds",
      memoryLimit: "512 MB",
      points: 300,
      submissions: 15,
      solved: 8,
      userStatus: "Not Attempted",
      userScore: 0,
      userSubmissions: 0,
    },
  ],
  leaderboard: [
    { rank: 1, name: "Alice", score: 600, solved: 3, time: "00:45:30" },
    { rank: 2, name: "Bob", score: 500, solved: 2, time: "01:15:20" },
    { rank: 3, name: "Charlie", score: 400, solved: 2, time: "01:30:45" },
    { rank: 4, name: "David", score: 300, solved: 1, time: "00:55:10" },
    { rank: 5, name: "Eve", score: 200, solved: 1, time: "01:20:30" },
  ],
  userSubmissions: [
    {
      id: 1,
      caseId: 1,
      caseTitle: "Sum of Two Numbers",
      submittedAt: "2024-06-25T10:30:00",
      status: "Accepted",
      score: 100,
      language: "Python",
    },
    {
      id: 2,
      caseId: 2,
      caseTitle: "Palindrome Checker",
      submittedAt: "2024-06-25T11:15:00",
      status: "Wrong Answer",
      score: 60,
      language: "C",
    },
  ],
};

const ContestDetail = () => {
  const [user, setUser] = useState(null);
  const [contest, setContest] = useState(null);
  const [activeTab, setActiveTab] = useState("cases"); // cases, leaderboard, submissions
  const { contestId } = useParams();
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

      // In real implementation, fetch contest details from API
      // For now, use mock data
      setContest(mockContestDetail);
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/");
    }
  }, [navigate, contestId]);

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
      case "Not Attempted":
        return "badge-neutral";
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

  const isContestActive = () => {
    if (!contest) return false;
    const now = new Date();
    const start = new Date(contest.startTime);
    const end = new Date(contest.endTime);
    return now >= start && now <= end;
  };

  if (!user || !contest) {
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
        <div className="bg-white/95 shadow-2xl rounded-2xl p-0 w-full max-w-6xl flex flex-col gap-0 border border-blue-100">
          {/* Contest Header */}
          <div className="px-8 py-6 border-b border-blue-100 rounded-t-2xl bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="material-icons text-blue-500 text-3xl">
                  emoji_events
                </span>
                <div>
                  <h2 className="text-2xl font-bold text-blue-700">
                    {contest.title}
                  </h2>
                  <p className="text-gray-600">{contest.className}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="badge badge-primary badge-lg">
                  {contest.type}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {contest.participants} participants
                </div>
              </div>
            </div>
          </div>

          {/* Contest Info */}
          <div className="px-8 py-4 bg-blue-50 border-b border-blue-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-semibold text-blue-700">Start Time:</span>
                <div className="text-gray-600">
                  {formatDateTime(contest.startTime)}
                </div>
              </div>
              <div>
                <span className="font-semibold text-blue-700">End Time:</span>
                <div className="text-gray-600">
                  {formatDateTime(contest.endTime)}
                </div>
              </div>
              <div>
                <span className="font-semibold text-blue-700">Status:</span>
                <div
                  className={`badge ${
                    isContestActive() ? "badge-success" : "badge-neutral"
                  } badge-sm`}
                >
                  {isContestActive() ? "Active" : "Ended"}
                </div>
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-700">
              {contest.description}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-blue-100">
            <button
              className={`flex-1 tab tab-lg tab-bordered text-lg font-semibold transition-colors duration-200 ${
                activeTab === "cases"
                  ? "tab-active bg-blue-100 text-blue-700 border-b-2 border-blue-500"
                  : "bg-white text-gray-600 hover:bg-blue-50"
              }`}
              onClick={() => setActiveTab("cases")}
            >
              Cases ({contest.cases.length})
            </button>
            <button
              className={`flex-1 tab tab-lg tab-bordered text-lg font-semibold transition-colors duration-200 ${
                activeTab === "leaderboard"
                  ? "tab-active bg-blue-100 text-blue-700 border-b-2 border-blue-500"
                  : "bg-white text-gray-600 hover:bg-blue-50"
              }`}
              onClick={() => setActiveTab("leaderboard")}
            >
              Leaderboard
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
            {activeTab === "cases" ? (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-blue-700 mb-4">
                  Contest Cases
                </h3>
                {contest.cases.map((caseItem) => (
                  <div
                    key={caseItem.id}
                    className="card bg-white border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="material-icons text-blue-500 text-2xl">
                          assignment
                        </span>
                        <div>
                          <span
                            className={`badge ${getDifficultyColor(
                              caseItem.difficulty
                            )} badge-sm`}
                          >
                            {caseItem.difficulty}
                          </span>
                          <span className="badge badge-outline badge-primary badge-sm ml-2">
                            {caseItem.points} pts
                          </span>
                          {caseItem.userStatus !== "Not Attempted" && (
                            <span
                              className={`badge ${getStatusColor(
                                caseItem.userStatus
                              )} badge-sm ml-2`}
                            >
                              {caseItem.userStatus}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <h4 className="card-title text-lg font-bold text-blue-700 mb-3">
                      {caseItem.title}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-semibold">Time Limit:</span>{" "}
                        {caseItem.timeLimit}
                      </div>
                      <div>
                        <span className="font-semibold">Memory Limit:</span>{" "}
                        {caseItem.memoryLimit}
                      </div>
                      <div>
                        <span className="font-semibold">Solved:</span>{" "}
                        {caseItem.solved}/{caseItem.submissions}
                      </div>
                    </div>

                    {caseItem.userStatus !== "Not Attempted" && (
                      <div className="bg-gray-50 p-3 rounded-lg mb-4">
                        <div className="text-sm text-gray-700">
                          <span className="font-semibold">Your Progress:</span>{" "}
                          {caseItem.userScore}/{caseItem.points} points (
                          {caseItem.userSubmissions} submission
                          {caseItem.userSubmissions !== 1 ? "s" : ""})
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Link
                        to={`/case/${caseItem.id}`}
                        className="btn btn-primary btn-sm flex-1"
                      >
                        View Case
                      </Link>
                      <Link
                        to={`/submission?caseId=${caseItem.id}`}
                        className="btn btn-outline btn-primary btn-sm flex-1"
                      >
                        Submit Solution
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : activeTab === "leaderboard" ? (
              <div>
                <h3 className="text-xl font-bold text-blue-700 mb-4">
                  Current Leaderboard
                </h3>
                <div className="overflow-x-auto rounded-xl border border-blue-100 bg-white/90">
                  <table className="table w-full">
                    <thead>
                      <tr className="bg-blue-50 text-blue-700">
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Score</th>
                        <th>Solved</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contest.leaderboard.map((row) => (
                        <tr key={row.rank} className="hover:bg-blue-50">
                          <td className="font-bold text-lg text-blue-700">
                            {row.rank}
                          </td>
                          <td>{row.name}</td>
                          <td>{row.score}</td>
                          <td>
                            {row.solved}/{contest.cases.length}
                          </td>
                          <td className="font-mono text-sm">{row.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-blue-700">
                    My Submissions
                  </h3>
                  <Link
                    to={`/submission-history?contestId=${contestId}`}
                    className="btn btn-outline btn-primary btn-sm"
                  >
                    View Full History
                  </Link>
                </div>

                {contest.userSubmissions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No submissions yet. Start solving cases to see your
                    progress!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {contest.userSubmissions.map((submission) => (
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
                          <div>Case: {submission.caseTitle}</div>
                          <div>Score: {submission.score} points</div>
                        </div>

                        <div className="mt-3 flex gap-2">
                          <Link
                            to={`/submission-history?caseId=${submission.caseId}`}
                            className="btn btn-outline btn-primary btn-xs"
                          >
                            View Details
                          </Link>
                          {submission.status !== "Accepted" && (
                            <Link
                              to={`/submission?caseId=${submission.caseId}`}
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

export default ContestDetail;
