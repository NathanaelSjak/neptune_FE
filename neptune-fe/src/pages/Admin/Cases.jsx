import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

// Mock data
const mockCases = [
  {
    id: "CASE001",
    name: "Dynamic Programming Challenge",
    description: "Solve complex problems using dynamic programming techniques",
    difficulty: "Hard",
    category: "Algorithms",
    timeLimit: 3000, // milliseconds
    memoryLimit: 256, // MB
    testCases: 15,
    submissions: 45,
    successRate: 67,
    createdBy: "Dr. Sarah Johnson",
    createdAt: "2024-06-15",
    isGlobal: true,
    tags: ["dynamic-programming", "optimization", "algorithms"],
    language: "C++",
    sampleInput: "5\n1 2 3 4 5",
    sampleOutput: "15",
    problemStatement:
      "Given an array of integers, find the maximum sum of a contiguous subarray...",
  },
  {
    id: "CASE002",
    name: "Graph Algorithms",
    description:
      "Implement various graph traversal and shortest path algorithms",
    difficulty: "Medium",
    category: "Data Structures",
    timeLimit: 2000,
    memoryLimit: 128,
    testCases: 12,
    submissions: 78,
    successRate: 82,
    createdBy: "Dr. Michael Chen",
    createdAt: "2024-06-10",
    isGlobal: true,
    tags: ["graphs", "algorithms", "traversal"],
    language: "Java",
    sampleInput: "4 4\n1 2 1\n2 3 2\n3 4 3\n1 4 10",
    sampleOutput: "6",
    problemStatement:
      "Given a weighted graph, find the shortest path between two vertices...",
  },
  {
    id: "CASE003",
    name: "String Processing",
    description: "Basic string manipulation and pattern matching",
    difficulty: "Easy",
    category: "Strings",
    timeLimit: 1000,
    memoryLimit: 64,
    testCases: 8,
    submissions: 120,
    successRate: 95,
    createdBy: "Dr. Emily Davis",
    createdAt: "2024-06-05",
    isGlobal: false,
    tags: ["strings", "pattern-matching", "basic"],
    language: "Python",
    sampleInput: "hello world\nworld",
    sampleOutput: "true",
    problemStatement: "Check if a substring exists within a given string...",
  },
];

const mockTestCases = {
  CASE001: [
    { id: 1, input: "3\n1 2 3", output: "6", isHidden: false },
    { id: 2, input: "5\n-1 -2 -3 -4 -5", output: "-1", isHidden: false },
    { id: 3, input: "10\n1 2 3 4 5 6 7 8 9 10", output: "55", isHidden: true },
    { id: 4, input: "1\n100", output: "100", isHidden: true },
  ],
  CASE002: [
    { id: 1, input: "3 2\n1 2 5\n2 3 3", output: "8", isHidden: false },
    { id: 2, input: "4 3\n1 2 1\n2 3 2\n3 4 1", output: "4", isHidden: false },
    {
      id: 3,
      input: "5 4\n1 2 10\n2 3 5\n3 4 2\n4 5 1",
      output: "18",
      isHidden: true,
    },
  ],
  CASE003: [
    { id: 1, input: "hello world\nworld", output: "true", isHidden: false },
    { id: 2, input: "programming\ncode", output: "false", isHidden: false },
    { id: 3, input: "algorithm\nalgo", output: "true", isHidden: true },
  ],
};

const AdminCases = () => {
  const [user, setUser] = useState(null);
  const [cases, setCases] = useState([]);
  const [testCases, setTestCases] = useState({});
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [showTestCaseModal, setShowTestCaseModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedTestCase, setSelectedTestCase] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterGlobal, setFilterGlobal] = useState("");
  const navigate = useNavigate();

  // Form state for case management
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    difficulty: "Easy",
    category: "Algorithms",
    timeLimit: 1000,
    memoryLimit: 64,
    language: "C++",
    tags: [],
    sampleInput: "",
    sampleOutput: "",
    problemStatement: "",
    isGlobal: false,
  });

  // Form state for test case management
  const [testCaseForm, setTestCaseForm] = useState({
    input: "",
    output: "",
    isHidden: false,
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
      setCases(mockCases);
      setTestCases(mockTestCases);
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

  const handleCreateCase = () => {
    const newCase = {
      ...formData,
      id: `CASE${String(cases.length + 1).padStart(3, "0")}`,
      testCases: 0,
      submissions: 0,
      successRate: 0,
      createdBy: user.name,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setCases([...cases, newCase]);
    setTestCases({ ...testCases, [newCase.id]: [] });
    setShowCaseModal(false);
    setFormData({
      name: "",
      description: "",
      difficulty: "Easy",
      category: "Algorithms",
      timeLimit: 1000,
      memoryLimit: 64,
      language: "C++",
      tags: [],
      sampleInput: "",
      sampleOutput: "",
      problemStatement: "",
      isGlobal: false,
    });
  };

  const handleUpdateCase = () => {
    const updatedCases = cases.map((caseItem) =>
      caseItem.id === selectedCase.id ? { ...caseItem, ...formData } : caseItem
    );

    setCases(updatedCases);
    setShowCaseModal(false);
    setSelectedCase(null);
    setFormData({
      name: "",
      description: "",
      difficulty: "Easy",
      category: "Algorithms",
      timeLimit: 1000,
      memoryLimit: 64,
      language: "C++",
      tags: [],
      sampleInput: "",
      sampleOutput: "",
      problemStatement: "",
      isGlobal: false,
    });
  };

  const handleDeleteCase = (caseId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this case? This action cannot be undone."
      )
    ) {
      setCases(cases.filter((caseItem) => caseItem.id !== caseId));
      const newTestCases = { ...testCases };
      delete newTestCases[caseId];
      setTestCases(newTestCases);
    }
  };

  const handleCreateTestCase = () => {
    const caseId = selectedCase.id;
    const newTestCase = {
      ...testCaseForm,
      id: testCases[caseId] ? testCases[caseId].length + 1 : 1,
    };

    setTestCases({
      ...testCases,
      [caseId]: [...(testCases[caseId] || []), newTestCase],
    });

    // Update case test case count
    const updatedCases = cases.map((caseItem) =>
      caseItem.id === caseId
        ? { ...caseItem, testCases: (testCases[caseId] || []).length + 1 }
        : caseItem
    );
    setCases(updatedCases);

    setShowTestCaseModal(false);
    setTestCaseForm({
      input: "",
      output: "",
      isHidden: false,
    });
  };

  const handleDeleteTestCase = (caseId, testCaseId) => {
    const updatedTestCases = testCases[caseId].filter(
      (tc) => tc.id !== testCaseId
    );
    setTestCases({
      ...testCases,
      [caseId]: updatedTestCases,
    });

    // Update case test case count
    const updatedCases = cases.map((caseItem) =>
      caseItem.id === caseId
        ? { ...caseItem, testCases: updatedTestCases.length }
        : caseItem
    );
    setCases(updatedCases);
  };

  const openCaseModal = (caseData = null) => {
    if (caseData) {
      setSelectedCase(caseData);
      setFormData({
        name: caseData.name,
        description: caseData.description,
        difficulty: caseData.difficulty,
        category: caseData.category,
        timeLimit: caseData.timeLimit,
        memoryLimit: caseData.memoryLimit,
        language: caseData.language,
        tags: caseData.tags,
        sampleInput: caseData.sampleInput,
        sampleOutput: caseData.sampleOutput,
        problemStatement: caseData.problemStatement,
        isGlobal: caseData.isGlobal,
      });
    } else {
      setSelectedCase(null);
      setFormData({
        name: "",
        description: "",
        difficulty: "Easy",
        category: "Algorithms",
        timeLimit: 1000,
        memoryLimit: 64,
        language: "C++",
        tags: [],
        sampleInput: "",
        sampleOutput: "",
        problemStatement: "",
        isGlobal: false,
      });
    }
    setShowCaseModal(true);
  };

  const openTestCaseModal = (caseData) => {
    setSelectedCase(caseData);
    setShowTestCaseModal(true);
  };

  // Filter cases
  const filteredCases = cases.filter((caseItem) => {
    const matchesSearch =
      caseItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      !filterDifficulty || caseItem.difficulty === filterDifficulty;
    const matchesCategory =
      !filterCategory || caseItem.category === filterCategory;
    const matchesGlobal =
      filterGlobal === "" ||
      (filterGlobal === "true" && caseItem.isGlobal) ||
      (filterGlobal === "false" && !caseItem.isGlobal);

    return (
      matchesSearch && matchesDifficulty && matchesCategory && matchesGlobal
    );
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "badge-success";
      case "Medium":
        return "badge-warning";
      case "Hard":
        return "badge-error";
      default:
        return "badge-neutral";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Algorithms":
        return "badge-primary";
      case "Data Structures":
        return "badge-secondary";
      case "Strings":
        return "badge-accent";
      default:
        return "badge-neutral";
    }
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
                  Case Management
                </h1>
                <p className="text-gray-600">
                  Create and manage programming cases and test cases
                </p>
              </div>
              <button
                onClick={() => openCaseModal()}
                className="btn btn-primary bg-red-600 hover:bg-red-700 border-red-600"
              >
                <span className="material-icons mr-2">add</span>
                Create Case
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Search cases..."
                  className="input input-bordered"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="form-control">
                <select
                  className="select select-bordered"
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                >
                  <option value="">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div className="form-control">
                <select
                  className="select select-bordered"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="Algorithms">Algorithms</option>
                  <option value="Data Structures">Data Structures</option>
                  <option value="Strings">Strings</option>
                </select>
              </div>
              <div className="form-control">
                <select
                  className="select select-bordered"
                  value={filterGlobal}
                  onChange={(e) => setFilterGlobal(e.target.value)}
                >
                  <option value="">All Cases</option>
                  <option value="true">Global Only</option>
                  <option value="false">Class Only</option>
                </select>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-600">
                  Total: {filteredCases.length} cases
                </span>
              </div>
            </div>
          </div>

          {/* Cases Table */}
          <div className="bg-white/90 shadow-2xl rounded-2xl border border-red-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead className="bg-red-50">
                  <tr>
                    <th className="text-red-700">Case ID</th>
                    <th className="text-red-700">Name</th>
                    <th className="text-red-700">Difficulty</th>
                    <th className="text-red-700">Category</th>
                    <th className="text-red-700">Test Cases</th>
                    <th className="text-red-700">Submissions</th>
                    <th className="text-red-700">Success Rate</th>
                    <th className="text-red-700">Created By</th>
                    <th className="text-red-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCases.map((caseItem) => (
                    <tr key={caseItem.id} className="hover:bg-red-50">
                      <td className="font-mono font-bold text-red-600">
                        {caseItem.id}
                      </td>
                      <td>
                        <div>
                          <div className="font-semibold">{caseItem.name}</div>
                          <div className="text-sm text-gray-500">
                            {caseItem.description}
                          </div>
                          <div className="text-xs text-gray-400">
                            {caseItem.isGlobal ? "Global Case" : "Class Case"}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge ${getDifficultyColor(
                            caseItem.difficulty
                          )}`}
                        >
                          {caseItem.difficulty}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${getCategoryColor(
                            caseItem.category
                          )}`}
                        >
                          {caseItem.category}
                        </span>
                      </td>
                      <td>
                        <div className="text-center">
                          <div className="font-semibold">
                            {caseItem.testCases}
                          </div>
                          <button
                            onClick={() => openTestCaseModal(caseItem)}
                            className="btn btn-xs btn-outline btn-primary"
                          >
                            Manage
                          </button>
                        </div>
                      </td>
                      <td>
                        <div className="text-center">
                          <div className="font-semibold">
                            {caseItem.submissions}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-center">
                          <div className="font-semibold">
                            {caseItem.successRate}%
                          </div>
                          <progress
                            className="progress progress-primary w-full"
                            value={caseItem.successRate}
                            max="100"
                          ></progress>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          <div className="font-semibold">
                            {caseItem.createdBy}
                          </div>
                          <div className="text-gray-500">
                            {caseItem.createdAt}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => openCaseModal(caseItem)}
                            className="btn btn-sm btn-outline btn-primary"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/admin/cases/${caseItem.id}`)
                            }
                            className="btn btn-sm btn-outline btn-info"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteCase(caseItem.id)}
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

        {/* Case Modal */}
        {showCaseModal && (
          <div className="modal modal-open">
            <div className="modal-box max-w-4xl">
              <h3 className="font-bold text-lg text-red-700 mb-4">
                {selectedCase
                  ? `Edit Case: ${selectedCase.name}`
                  : "Create New Case"}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Case Name</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Dynamic Programming Challenge"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Difficulty</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({ ...formData, difficulty: e.target.value })
                    }
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Category</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option value="Algorithms">Algorithms</option>
                    <option value="Data Structures">Data Structures</option>
                    <option value="Strings">Strings</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Language</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={formData.language}
                    onChange={(e) =>
                      setFormData({ ...formData, language: e.target.value })
                    }
                  >
                    <option value="C++">C++</option>
                    <option value="Java">Java</option>
                    <option value="Python">Python</option>
                    <option value="JavaScript">JavaScript</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Time Limit (ms)</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={formData.timeLimit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        timeLimit: parseInt(e.target.value),
                      })
                    }
                    min="500"
                    max="10000"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Memory Limit (MB)</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={formData.memoryLimit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        memoryLimit: parseInt(e.target.value),
                      })
                    }
                    min="16"
                    max="512"
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
                  placeholder="Case description..."
                  rows="2"
                />
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Problem Statement</span>
                </label>
                <textarea
                  className="textarea textarea-bordered"
                  value={formData.problemStatement}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      problemStatement: e.target.value,
                    })
                  }
                  placeholder="Detailed problem statement..."
                  rows="4"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Sample Input</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered"
                    value={formData.sampleInput}
                    onChange={(e) =>
                      setFormData({ ...formData, sampleInput: e.target.value })
                    }
                    placeholder="Sample input..."
                    rows="3"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Sample Output</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered"
                    value={formData.sampleOutput}
                    onChange={(e) =>
                      setFormData({ ...formData, sampleOutput: e.target.value })
                    }
                    placeholder="Sample output..."
                    rows="3"
                  />
                </div>
              </div>

              <div className="form-control mt-4">
                <label className="label cursor-pointer">
                  <span className="label-text">
                    Global Case (Available to all classes)
                  </span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={formData.isGlobal}
                    onChange={(e) =>
                      setFormData({ ...formData, isGlobal: e.target.checked })
                    }
                  />
                </label>
              </div>

              <div className="modal-action">
                <button
                  className="btn btn-outline"
                  onClick={() => setShowCaseModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary bg-red-600 hover:bg-red-700 border-red-600"
                  onClick={selectedCase ? handleUpdateCase : handleCreateCase}
                >
                  {selectedCase ? "Update Case" : "Create Case"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Test Case Modal */}
        {showTestCaseModal && selectedCase && (
          <div className="modal modal-open">
            <div className="modal-box max-w-4xl">
              <h3 className="font-bold text-lg text-red-700 mb-4">
                Manage Test Cases: {selectedCase.name}
              </h3>

              <div className="mb-6">
                <button
                  onClick={handleCreateTestCase}
                  className="btn btn-primary bg-red-600 hover:bg-red-700 border-red-600 mb-4"
                >
                  <span className="material-icons mr-2">add</span>
                  Add Test Case
                </button>

                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead className="bg-red-50">
                      <tr>
                        <th className="text-red-700">ID</th>
                        <th className="text-red-700">Input</th>
                        <th className="text-red-700">Expected Output</th>
                        <th className="text-red-700">Hidden</th>
                        <th className="text-red-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(testCases[selectedCase.id] || []).map((testCase) => (
                        <tr key={testCase.id}>
                          <td className="font-mono">{testCase.id}</td>
                          <td className="font-mono text-sm">
                            <pre className="whitespace-pre-wrap">
                              {testCase.input}
                            </pre>
                          </td>
                          <td className="font-mono text-sm">
                            <pre className="whitespace-pre-wrap">
                              {testCase.output}
                            </pre>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                testCase.isHidden
                                  ? "badge-warning"
                                  : "badge-success"
                              }`}
                            >
                              {testCase.isHidden ? "Hidden" : "Visible"}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() =>
                                handleDeleteTestCase(
                                  selectedCase.id,
                                  testCase.id
                                )
                              }
                              className="btn btn-xs btn-outline btn-error"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="modal-action">
                <button
                  className="btn btn-outline"
                  onClick={() => setShowTestCaseModal(false)}
                >
                  Close
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

export default AdminCases;
