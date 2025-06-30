import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

// Mock data
const mockContests = [
  {
    id: "C001",
    name: "University Programming Challenge 2024",
    description: "Annual university-wide programming competition",
    type: "global",
    startTime: "2024-07-01T09:00:00",
    endTime: "2024-07-01T17:00:00",
    duration: 480, // minutes
    maxParticipants: 200,
    currentParticipants: 150,
    status: "upcoming",
    assignedClasses: [],
    cases: ["CASE001", "CASE002", "CASE003"],
    createdBy: "Dr. Michael Chen",
    createdAt: "2024-06-20",
    isPublic: true,
  },
  {
    id: "C002",
    name: "Advanced Algorithms Midterm",
    description: "Midterm examination for Advanced Algorithms course",
    type: "class",
    startTime: "2024-06-28T14:00:00",
    endTime: "2024-06-28T16:00:00",
    duration: 120,
    maxParticipants: 35,
    currentParticipants: 35,
    status: "active",
    assignedClasses: ["COMP6050"],
    cases: ["CASE004", "CASE005"],
    createdBy: "Dr. Sarah Johnson",
    createdAt: "2024-06-15",
    isPublic: false,
  },
  {
    id: "C003",
    name: "Programming Fundamentals Final",
    description: "Final examination for Programming Fundamentals",
    type: "class",
    startTime: "2024-07-05T10:00:00",
    endTime: "2024-07-05T12:00:00",
    duration: 120,
    maxParticipants: 45,
    currentParticipants: 0,
    status: "upcoming",
    assignedClasses: ["COMP6040"],
    cases: ["CASE006", "CASE007", "CASE008"],
    createdBy: "Dr. Michael Chen",
    createdAt: "2024-06-18",
    isPublic: false,
  },
];

const mockClasses = [
  {
    id: "COMP6050",
    name: "Advanced Algorithms",
    lecturer: "Dr. Sarah Johnson",
  },
  {
    id: "COMP6040",
    name: "Programming Fundamentals",
    lecturer: "Dr. Michael Chen",
  },
  { id: "COMP6030", name: "Data Structures", lecturer: "Dr. Emily Davis" },
];

const mockCases = [
  { id: "CASE001", name: "Dynamic Programming Challenge", difficulty: "Hard" },
  { id: "CASE002", name: "Graph Algorithms", difficulty: "Medium" },
  { id: "CASE003", name: "String Processing", difficulty: "Easy" },
  { id: "CASE004", name: "Sorting Algorithms", difficulty: "Medium" },
  { id: "CASE005", name: "Binary Search", difficulty: "Easy" },
  { id: "CASE006", name: "Basic Programming", difficulty: "Easy" },
  { id: "CASE007", name: "Arrays and Loops", difficulty: "Medium" },
  { id: "CASE008", name: "Functions and Recursion", difficulty: "Hard" },
];

const AdminContests = () => {
  const [user, setUser] = useState(null);
  const [contests, setContests] = useState([]);
  const [classes, setClasses] = useState([]);
  const [cases, setCases] = useState([]);
  const [showContestModal, setShowContestModal] = useState(false);
  const [selectedContest, setSelectedContest] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const navigate = useNavigate();

  // Form state for contest management
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "class",
    startTime: "",
    endTime: "",
    duration: 120,
    maxParticipants: 50,
    assignedClasses: [],
    cases: [],
    isPublic: false,
  });

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
      setContests(mockContests);
      setClasses(mockClasses);
      setCases(mockCases);
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

  const handleCreateContest = () => {
    const newContest = {
      ...formData,
      id: `C${String(contests.length + 1).padStart(3, "0")}`,
      currentParticipants: 0,
      status: "upcoming",
      createdBy: user.name,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setContests([...contests, newContest]);
    setShowContestModal(false);
    setFormData({
      name: "",
      description: "",
      type: "class",
      startTime: "",
      endTime: "",
      duration: 120,
      maxParticipants: 50,
      assignedClasses: [],
      cases: [],
      isPublic: false,
    });
  };

  const handleUpdateContest = () => {
    const updatedContests = contests.map((contest) =>
      contest.id === selectedContest.id ? { ...contest, ...formData } : contest
    );

    setContests(updatedContests);
    setShowContestModal(false);
    setSelectedContest(null);
    setFormData({
      name: "",
      description: "",
      type: "class",
      startTime: "",
      endTime: "",
      duration: 120,
      maxParticipants: 50,
      assignedClasses: [],
      cases: [],
      isPublic: false,
    });
  };

  const handleDeleteContest = (contestId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this contest? This action cannot be undone."
      )
    ) {
      setContests(contests.filter((contest) => contest.id !== contestId));
    }
  };

  const openContestModal = (contestData = null) => {
    if (contestData) {
      setSelectedContest(contestData);
      setFormData({
        name: contestData.name,
        description: contestData.description,
        type: contestData.type,
        startTime: contestData.startTime,
        endTime: contestData.endTime,
        duration: contestData.duration,
        maxParticipants: contestData.maxParticipants,
        assignedClasses: contestData.assignedClasses,
        cases: contestData.cases,
        isPublic: contestData.isPublic,
      });
    } else {
      setSelectedContest(null);
      setFormData({
        name: "",
        description: "",
        type: "class",
        startTime: "",
        endTime: "",
        duration: 120,
        maxParticipants: 50,
        assignedClasses: [],
        cases: [],
        isPublic: false,
      });
    }
    setShowContestModal(true);
  };

  // Filter contests
  const filteredContests = contests.filter((contest) => {
    const matchesSearch =
      contest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contest.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || contest.type === filterType;
    const matchesStatus = !filterStatus || contest.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

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
      case "active":
        return "badge-success";
      case "upcoming":
        return "badge-warning";
      case "ended":
        return "badge-error";
      default:
        return "badge-neutral";
    }
  };

  const getTypeColor = (type) => {
    return type === "global" ? "badge-primary" : "badge-secondary";
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
                  Contest Management
                </h1>
                <p className="text-gray-600">
                  Create and manage global contests and class assignments
                </p>
              </div>
              <button
                onClick={() => openContestModal()}
                className="btn btn-primary bg-red-600 hover:bg-red-700 border-red-600"
              >
                <span className="material-icons mr-2">add</span>
                Create Contest
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Search contests..."
                  className="input input-bordered"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="form-control">
                <select
                  className="select select-bordered"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="global">Global</option>
                  <option value="class">Class</option>
                </select>
              </div>
              <div className="form-control">
                <select
                  className="select select-bordered"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="ended">Ended</option>
                </select>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-600">
                  Total: {filteredContests.length} contests
                </span>
              </div>
            </div>
          </div>

          {/* Contests Table */}
          <div className="bg-white/90 shadow-2xl rounded-2xl border border-red-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead className="bg-red-50">
                  <tr>
                    <th className="text-red-700">Contest ID</th>
                    <th className="text-red-700">Name</th>
                    <th className="text-red-700">Type</th>
                    <th className="text-red-700">Schedule</th>
                    <th className="text-red-700">Participants</th>
                    <th className="text-red-700">Status</th>
                    <th className="text-red-700">Created By</th>
                    <th className="text-red-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContests.map((contest) => (
                    <tr key={contest.id} className="hover:bg-red-50">
                      <td className="font-mono font-bold text-red-600">
                        {contest.id}
                      </td>
                      <td>
                        <div>
                          <div className="font-semibold">{contest.name}</div>
                          <div className="text-sm text-gray-500">
                            {contest.description}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${getTypeColor(contest.type)}`}>
                          {contest.type}
                        </span>
                      </td>
                      <td>
                        <div className="text-sm">
                          <div>
                            <strong>Start:</strong>{" "}
                            {formatDateTime(contest.startTime)}
                          </div>
                          <div>
                            <strong>End:</strong>{" "}
                            {formatDateTime(contest.endTime)}
                          </div>
                          <div>
                            <strong>Duration:</strong> {contest.duration} min
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          <div>
                            {contest.currentParticipants}/
                            {contest.maxParticipants}
                          </div>
                          <progress
                            className="progress progress-primary w-full"
                            value={contest.currentParticipants}
                            max={contest.maxParticipants}
                          ></progress>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge ${getStatusColor(contest.status)}`}
                        >
                          {contest.status}
                        </span>
                      </td>
                      <td>
                        <div className="text-sm">
                          <div className="font-semibold">
                            {contest.createdBy}
                          </div>
                          <div className="text-gray-500">
                            {contest.createdAt}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => openContestModal(contest)}
                            className="btn btn-sm btn-outline btn-primary"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/admin/contests/${contest.id}`)
                            }
                            className="btn btn-sm btn-outline btn-info"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteContest(contest.id)}
                            className="btn btn-sm btn-outline btn-error"
                          >
                            Delete
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

        {/* Contest Modal */}
        {showContestModal && (
          <div className="modal modal-open">
            <div className="modal-box max-w-4xl">
              <h3 className="font-bold text-lg text-red-700 mb-4">
                {selectedContest
                  ? `Edit Contest: ${selectedContest.name}`
                  : "Create New Contest"}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Contest Name</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., University Programming Challenge"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Type</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  >
                    <option value="class">Class Contest</option>
                    <option value="global">Global Contest</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Start Time</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="input input-bordered"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">End Time</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="input input-bordered"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Duration (minutes)</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        duration: parseInt(e.target.value),
                      })
                    }
                    min="30"
                    max="480"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Max Participants</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={formData.maxParticipants}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxParticipants: parseInt(e.target.value),
                      })
                    }
                    min="1"
                    max="500"
                  />
                </div>
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Contest description..."
                  rows="3"
                />
              </div>

              {formData.type === "class" && (
                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Assigned Classes</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {classes.map((cls) => (
                      <label
                        key={cls.id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm"
                          checked={formData.assignedClasses.includes(cls.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                assignedClasses: [
                                  ...formData.assignedClasses,
                                  cls.id,
                                ],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                assignedClasses:
                                  formData.assignedClasses.filter(
                                    (id) => id !== cls.id
                                  ),
                              });
                            }
                          }}
                        />
                        <span className="text-sm">
                          {cls.id} - {cls.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Cases</span>
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {cases.map((caseItem) => (
                    <label
                      key={caseItem.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={formData.cases.includes(caseItem.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              cases: [...formData.cases, caseItem.id],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              cases: formData.cases.filter(
                                (id) => id !== caseItem.id
                              ),
                            });
                          }
                        }}
                      />
                      <span className="text-sm">
                        {caseItem.id} - {caseItem.name} ({caseItem.difficulty})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-control mt-4">
                <label className="label cursor-pointer">
                  <span className="label-text">Public Contest</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={formData.isPublic}
                    onChange={(e) =>
                      setFormData({ ...formData, isPublic: e.target.checked })
                    }
                  />
                </label>
              </div>

              <div className="modal-action">
                <button
                  className="btn btn-outline"
                  onClick={() => setShowContestModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary bg-red-600 hover:bg-red-700 border-red-600"
                  onClick={
                    selectedContest ? handleUpdateContest : handleCreateContest
                  }
                >
                  {selectedContest ? "Update Contest" : "Create Contest"}
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

export default AdminContests;
