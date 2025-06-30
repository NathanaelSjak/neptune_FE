import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LecturerNavbar from "../../components/Navbar/LecturerNavbar";

// Mock contest data for lecturer management
const mockLecturerContests = [
  {
    id: 1,
    title: "Week 1 Programming Contest",
    classId: 1,
    className: "Programming Fundamentals",
    startTime: "2024-06-25T09:00:00",
    endTime: "2024-06-25T11:00:00",
    status: "active", // active, upcoming, ended
    type: "weekly",
    participants: 45,
    submissions: 120,
    cases: [
      { id: 1, title: "Sum of Two Numbers", submissions: 45, solved: 38 },
      { id: 2, title: "Palindrome Checker", submissions: 42, solved: 25 },
      { id: 3, title: "Binary Search", submissions: 33, solved: 18 },
    ],
  },
  {
    id: 2,
    title: "Data Structures Quiz",
    classId: 2,
    className: "Data Structures",
    startTime: "2024-06-26T14:00:00",
    endTime: "2024-06-26T15:30:00",
    status: "upcoming",
    type: "quiz",
    participants: 38,
    submissions: 0,
    cases: [
      { id: 4, title: "Array Operations", submissions: 0, solved: 0 },
      { id: 5, title: "Linked List Implementation", submissions: 0, solved: 0 },
    ],
  },
  {
    id: 3,
    title: "Algorithm Design Final Exam",
    classId: 3,
    className: "Algorithm Design",
    startTime: "2024-06-28T08:00:00",
    endTime: "2024-06-28T10:00:00",
    status: "upcoming",
    type: "exam",
    participants: 32,
    submissions: 0,
    cases: [
      { id: 6, title: "Sorting Algorithms", submissions: 0, solved: 0 },
      { id: 7, title: "Graph Traversal", submissions: 0, solved: 0 },
      { id: 8, title: "Dynamic Programming", submissions: 0, solved: 0 },
    ],
  },
  {
    id: 4,
    title: "Week 2 Practice Contest",
    classId: 1,
    className: "Programming Fundamentals",
    startTime: "2024-06-20T09:00:00",
    endTime: "2024-06-20T11:00:00",
    status: "ended",
    type: "weekly",
    participants: 45,
    submissions: 95,
    cases: [
      { id: 9, title: "Basic Loops", submissions: 45, solved: 42 },
      { id: 10, title: "Conditional Statements", submissions: 43, solved: 38 },
      { id: 11, title: "Functions", submissions: 40, solved: 35 },
    ],
  },
];

const LecturerContests = () => {
  const [user, setUser] = useState(null);
  const [contests, setContests] = useState([]);
  const [selectedContest, setSelectedContest] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    startTime: "",
    endTime: "",
    type: "weekly",
  });
  const navigate = useNavigate();

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
      setContests(mockLecturerContests);
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

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "badge-success";
      case "upcoming":
        return "badge-warning";
      case "ended":
        return "badge-neutral";
      default:
        return "badge-neutral";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Active";
      case "upcoming":
        return "Upcoming";
      case "ended":
        return "Ended";
      default:
        return "Unknown";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "weekly":
        return "schedule";
      case "quiz":
        return "quiz";
      case "exam":
        return "assignment";
      default:
        return "event";
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

  const isContestActive = (contest) => {
    const now = new Date();
    const start = new Date(contest.startTime);
    const end = new Date(contest.endTime);
    return now >= start && now <= end;
  };

  const handleEditContest = (contest) => {
    setSelectedContest(contest);
    setEditForm({
      title: contest.title,
      startTime: contest.startTime.slice(0, 16), // Format for datetime-local input
      endTime: contest.endTime.slice(0, 16),
      type: contest.type,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    // In real implementation, this would update the contest via API
    const updatedContests = contests.map((contest) =>
      contest.id === selectedContest.id ? { ...contest, ...editForm } : contest
    );
    setContests(updatedContests);
    setShowEditModal(false);
    setSelectedContest(null);
  };

  const handlePostClarification = (contestId) => {
    // In real implementation, this would open a clarification modal
    alert(`Post clarification for contest ${contestId}`);
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
        <div className="bg-white/95 shadow-2xl rounded-2xl p-0 w-full max-w-6xl flex flex-col gap-0 border border-blue-100">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-blue-100 rounded-t-2xl bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center gap-3">
              <span className="material-icons text-blue-500 text-3xl">
                emoji_events
              </span>
              <h2 className="text-2xl font-bold text-blue-700">
                Manage Contests
              </h2>
            </div>
            <button className="btn btn-primary btn-sm">
              + Create New Contest
            </button>
          </div>

          {/* Contest List */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {contests.map((contest) => (
                <div
                  key={contest.id}
                  className="card bg-white border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="material-icons text-blue-500 text-2xl">
                        {getTypeIcon(contest.type)}
                      </span>
                      <div>
                        <span
                          className={`badge ${getStatusColor(
                            contest.status
                          )} badge-sm`}
                        >
                          {getStatusText(contest.status)}
                        </span>
                        <span className="badge badge-outline badge-primary badge-sm ml-2">
                          {contest.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3 className="card-title text-lg font-bold text-blue-700 mb-2">
                    {contest.title}
                  </h3>

                  <div className="text-sm text-gray-600 mb-4 space-y-1">
                    <div>
                      <span className="font-semibold">Class:</span>{" "}
                      {contest.className}
                    </div>
                    <div>
                      <span className="font-semibold">Start:</span>{" "}
                      {formatDateTime(contest.startTime)}
                    </div>
                    <div>
                      <span className="font-semibold">End:</span>{" "}
                      {formatDateTime(contest.endTime)}
                    </div>
                    <div>
                      <span className="font-semibold">Participants:</span>{" "}
                      {contest.participants} students
                    </div>
                    <div>
                      <span className="font-semibold">Cases:</span>{" "}
                      {contest.cases.length} problems
                    </div>
                    <div>
                      <span className="font-semibold">Submissions:</span>{" "}
                      {contest.submissions} total
                    </div>
                  </div>

                  {/* Case Progress */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Case Progress
                    </h4>
                    <div className="space-y-2">
                      {contest.cases.map((caseItem) => (
                        <div
                          key={caseItem.id}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="text-gray-600">
                            {caseItem.title}
                          </span>
                          <span className="text-blue-600">
                            {caseItem.solved}/{caseItem.submissions}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditContest(contest)}
                      className="btn btn-outline btn-primary btn-sm flex-1"
                    >
                      Edit Times
                    </button>
                    {contest.status === "active" && (
                      <button
                        onClick={() => handlePostClarification(contest.id)}
                        className="btn btn-outline btn-warning btn-sm flex-1"
                      >
                        Post Clarification
                      </button>
                    )}
                    <Link
                      to={`/lecturer/contest/${contest.id}`}
                      className="btn btn-primary btn-sm flex-1"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Edit Modal */}
          {showEditModal && (
            <div className="modal modal-open">
              <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">Edit Contest Times</h3>
                <div className="space-y-4">
                  <div>
                    <label className="label">
                      <span className="label-text">Contest Title</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Start Time</span>
                    </label>
                    <input
                      type="datetime-local"
                      className="input input-bordered w-full"
                      value={editForm.startTime}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          startTime: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">End Time</span>
                    </label>
                    <input
                      type="datetime-local"
                      className="input input-bordered w-full"
                      value={editForm.endTime}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          endTime: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Contest Type</span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={editForm.type}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          type: e.target.value,
                        }))
                      }
                    >
                      <option value="weekly">Weekly Contest</option>
                      <option value="quiz">Quiz</option>
                      <option value="exam">Exam</option>
                    </select>
                  </div>
                </div>

                <div className="modal-action">
                  <button
                    className="btn btn-outline"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleSaveEdit}>
                    Save Changes
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
      </div>
    </>
  );
};

export default LecturerContests;
