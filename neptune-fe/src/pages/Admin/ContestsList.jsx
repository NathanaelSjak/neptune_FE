import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

// Mock contest data - in real implementation, this would come from API
const mockContests = [
  {
    id: 1,
    title: "Week 1 Programming Contest",
    classId: 1,
    className: "Programming Fundamentals",
    startTime: "2024-06-25T09:00:00",
    endTime: "2024-06-25T11:00:00",
    status: "active", // active, upcoming, ended
    caseCount: 3,
    participants: 25,
    type: "weekly",
  },
  {
    id: 2,
    title: "Data Structures Quiz",
    classId: 2,
    className: "Data Structures",
    startTime: "2024-06-26T14:00:00",
    endTime: "2024-06-26T15:30:00",
    status: "upcoming",
    caseCount: 5,
    participants: 18,
    type: "quiz",
  },
  {
    id: 3,
    title: "Algorithm Design Final Exam",
    classId: 3,
    className: "Algorithm Design",
    startTime: "2024-06-28T08:00:00",
    endTime: "2024-06-28T10:00:00",
    status: "upcoming",
    caseCount: 8,
    participants: 22,
    type: "exam",
  },
  {
    id: 4,
    title: "Week 2 Practice Contest",
    classId: 1,
    className: "Programming Fundamentals",
    startTime: "2024-06-20T09:00:00",
    endTime: "2024-06-20T11:00:00",
    status: "ended",
    caseCount: 4,
    participants: 30,
    type: "weekly",
  },
];

const Contests = () => {
  const [user, setUser] = useState(null);
  const [contests, setContests] = useState([]);
  const [selectedClass, setSelectedClass] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
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

      // Filter contests for user's enrolled classes
      const userClassIds = userObj.enrolledClasses.map((cls) => cls.id);
      const userContests = mockContests.filter((contest) =>
        userClassIds.includes(contest.classId)
      );
      setContests(userContests);
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

  const filteredContests = contests.filter((contest) => {
    const classMatch =
      selectedClass === "all" || contest.classId === parseInt(selectedClass);
    const statusMatch =
      filterStatus === "all" || contest.status === filterStatus;
    return classMatch && statusMatch;
  });

  if (!user) {
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
          {/* Card Header */}
          <div className="flex items-center gap-3 px-8 py-6 border-b border-blue-100 rounded-t-2xl bg-gradient-to-r from-blue-50 to-blue-100">
            <span className="material-icons text-blue-500 text-3xl">
              emoji_events
            </span>
            <h2 className="text-2xl font-bold text-blue-700">Contests</h2>
          </div>

          {/* Student Info */}
          <div className="px-8 pt-4 pb-2 bg-blue-50">
            <div className="text-sm text-blue-700">
              <span className="font-semibold">Student:</span> {user.name} (
              {user.nim})
            </div>
          </div>

          {/* Filters */}
          <div className="px-8 py-6 border-b border-blue-100">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="font-semibold text-gray-700">Class:</label>
                  <select
                    className="select select-bordered select-sm"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option value="all">All Classes</option>
                    {user.enrolledClasses.map((cls) => (
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
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="ended">Ended</option>
                  </select>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                {filteredContests.length} contest
                {filteredContests.length !== 1 ? "s" : ""} found
              </div>
            </div>
          </div>

          {/* Contests List */}
          <div className="p-8">
            {filteredContests.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">
                  No contests found
                </div>
                <div className="text-gray-400 text-sm">
                  Try adjusting your filters or check back later for new
                  contests.
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredContests.map((contest) => (
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
                        <span className="font-semibold">Cases:</span>{" "}
                        {contest.caseCount} problems
                      </div>
                      <div>
                        <span className="font-semibold">Participants:</span>{" "}
                        {contest.participants} students
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/contest/${contest.id}`}
                        className="btn btn-primary btn-sm flex-1"
                      >
                        View Details
                      </Link>
                      {contest.status === "active" && (
                        <Link
                          to={`/contest/${contest.id}/leaderboard`}
                          className="btn btn-outline btn-primary btn-sm flex-1"
                        >
                          Leaderboard
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
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

export default Contests;
