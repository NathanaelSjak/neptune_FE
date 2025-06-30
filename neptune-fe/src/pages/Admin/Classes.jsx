import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

// Mock data
const mockClasses = [
  {
    id: "COMP6050",
    name: "Advanced Algorithms",
    lecturer: "Dr. Sarah Johnson",
    lecturerId: "L001",
    students: 35,
    semester: "2024/2025",
    credits: 3,
    department: "Computer Science",
    status: "active",
    createdAt: "2024-06-20",
    description:
      "Advanced algorithmic techniques and problem-solving strategies",
  },
  {
    id: "COMP6040",
    name: "Programming Fundamentals",
    lecturer: "Dr. Michael Chen",
    lecturerId: "L002",
    students: 45,
    semester: "2024/2025",
    credits: 4,
    department: "Computer Science",
    status: "active",
    createdAt: "2024-06-15",
    description: "Introduction to programming concepts and basic algorithms",
  },
  {
    id: "COMP6030",
    name: "Data Structures",
    lecturer: "Dr. Emily Davis",
    lecturerId: "L003",
    students: 40,
    semester: "2024/2025",
    credits: 3,
    department: "Computer Science",
    status: "active",
    createdAt: "2024-06-10",
    description: "Fundamental data structures and their implementations",
  },
];

const mockLecturers = [
  {
    id: "L001",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@binus.ac.id",
    department: "Computer Science",
  },
  {
    id: "L002",
    name: "Dr. Michael Chen",
    email: "michael.chen@binus.ac.id",
    department: "Computer Science",
  },
  {
    id: "L003",
    name: "Dr. Emily Davis",
    email: "emily.davis@binus.ac.id",
    department: "Computer Science",
  },
  {
    id: "L004",
    name: "Dr. Robert Wilson",
    email: "robert.wilson@binus.ac.id",
    department: "Computer Science",
  },
  {
    id: "L005",
    name: "Dr. Lisa Anderson",
    email: "lisa.anderson@binus.ac.id",
    department: "Computer Science",
  },
];

const AdminClasses = () => {
  const [user, setUser] = useState(null);
  const [classes, setClasses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const navigate = useNavigate();

  // Form state for create/edit
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    lecturerId: "",
    credits: 3,
    department: "Computer Science",
    description: "",
    semester: "2024/2025",
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
      setClasses(mockClasses);
      setLecturers(mockLecturers);
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

  const handleCreateClass = () => {
    const newClass = {
      ...formData,
      id: formData.id.toUpperCase(),
      lecturer:
        lecturers.find((l) => l.id === formData.lecturerId)?.name ||
        "Unassigned",
      students: 0,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setClasses([...classes, newClass]);
    setShowCreateModal(false);
    setFormData({
      id: "",
      name: "",
      lecturerId: "",
      credits: 3,
      department: "Computer Science",
      description: "",
      semester: "2024/2025",
    });
  };

  const handleEditClass = () => {
    const updatedClasses = classes.map((cls) =>
      cls.id === selectedClass.id
        ? {
            ...cls,
            ...formData,
            lecturer:
              lecturers.find((l) => l.id === formData.lecturerId)?.name ||
              "Unassigned",
          }
        : cls
    );

    setClasses(updatedClasses);
    setShowEditModal(false);
    setSelectedClass(null);
    setFormData({
      id: "",
      name: "",
      lecturerId: "",
      credits: 3,
      department: "Computer Science",
      description: "",
      semester: "2024/2025",
    });
  };

  const handleDeleteClass = (classId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this class? This action cannot be undone."
      )
    ) {
      setClasses(classes.filter((cls) => cls.id !== classId));
    }
  };

  const openEditModal = (cls) => {
    setSelectedClass(cls);
    setFormData({
      id: cls.id,
      name: cls.name,
      lecturerId: cls.lecturerId,
      credits: cls.credits,
      department: cls.department,
      description: cls.description,
      semester: cls.semester,
    });
    setShowEditModal(true);
  };

  // Filter classes
  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      !filterDepartment || cls.department === filterDepartment;
    const matchesStatus = !filterStatus || cls.status === filterStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const departments = [...new Set(classes.map((cls) => cls.department))];

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
                  Class Management
                </h1>
                <p className="text-gray-600">
                  Create, edit, and manage all classes in the system
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary bg-red-600 hover:bg-red-700 border-red-600"
              >
                <span className="material-icons mr-2">add</span>
                Create New Class
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Search classes..."
                  className="input input-bordered"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="form-control">
                <select
                  className="select select-bordered"
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <select
                  className="select select-bordered"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-600">
                  Total: {filteredClasses.length} classes
                </span>
              </div>
            </div>
          </div>

          {/* Classes Table */}
          <div className="bg-white/90 shadow-2xl rounded-2xl border border-red-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead className="bg-red-50">
                  <tr>
                    <th className="text-red-700">Class ID</th>
                    <th className="text-red-700">Name</th>
                    <th className="text-red-700">Lecturer</th>
                    <th className="text-red-700">Students</th>
                    <th className="text-red-700">Department</th>
                    <th className="text-red-700">Credits</th>
                    <th className="text-red-700">Status</th>
                    <th className="text-red-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClasses.map((cls) => (
                    <tr key={cls.id} className="hover:bg-red-50">
                      <td className="font-mono font-bold text-red-600">
                        {cls.id}
                      </td>
                      <td>
                        <div>
                          <div className="font-semibold">{cls.name}</div>
                          <div className="text-sm text-gray-500">
                            {cls.description}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-semibold">{cls.lecturer}</div>
                          <div className="text-sm text-gray-500">
                            {cls.semester}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-primary">
                          {cls.students}
                        </span>
                      </td>
                      <td>{cls.department}</td>
                      <td>{cls.credits} credits</td>
                      <td>
                        <span
                          className={`badge ${
                            cls.status === "active"
                              ? "badge-success"
                              : "badge-warning"
                          }`}
                        >
                          {cls.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(cls)}
                            className="btn btn-sm btn-outline btn-primary"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClass(cls.id)}
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

        {/* Create Class Modal */}
        {showCreateModal && (
          <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
              <h3 className="font-bold text-lg text-red-700 mb-4">
                Create New Class
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Class ID</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={formData.id}
                    onChange={(e) =>
                      setFormData({ ...formData, id: e.target.value })
                    }
                    placeholder="e.g., COMP6050"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Class Name</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Advanced Algorithms"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Lecturer</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={formData.lecturerId}
                    onChange={(e) =>
                      setFormData({ ...formData, lecturerId: e.target.value })
                    }
                  >
                    <option value="">Select Lecturer</option>
                    {lecturers.map((lecturer) => (
                      <option key={lecturer.id} value={lecturer.id}>
                        {lecturer.name} - {lecturer.department}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Credits</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={formData.credits}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        credits: parseInt(e.target.value),
                      })
                    }
                    min="1"
                    max="6"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Department</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Systems">
                      Information Systems
                    </option>
                    <option value="Software Engineering">
                      Software Engineering
                    </option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Semester</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={formData.semester}
                    onChange={(e) =>
                      setFormData({ ...formData, semester: e.target.value })
                    }
                    placeholder="e.g., 2024/2025"
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
                  placeholder="Class description..."
                  rows="3"
                />
              </div>
              <div className="modal-action">
                <button
                  className="btn btn-outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary bg-red-600 hover:bg-red-700 border-red-600"
                  onClick={handleCreateClass}
                >
                  Create Class
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Class Modal */}
        {showEditModal && selectedClass && (
          <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
              <h3 className="font-bold text-lg text-red-700 mb-4">
                Edit Class: {selectedClass.name}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Class ID</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={formData.id}
                    onChange={(e) =>
                      setFormData({ ...formData, id: e.target.value })
                    }
                    placeholder="e.g., COMP6050"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Class Name</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Advanced Algorithms"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Lecturer</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={formData.lecturerId}
                    onChange={(e) =>
                      setFormData({ ...formData, lecturerId: e.target.value })
                    }
                  >
                    <option value="">Select Lecturer</option>
                    {lecturers.map((lecturer) => (
                      <option key={lecturer.id} value={lecturer.id}>
                        {lecturer.name} - {lecturer.department}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Credits</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={formData.credits}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        credits: parseInt(e.target.value),
                      })
                    }
                    min="1"
                    max="6"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Department</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Systems">
                      Information Systems
                    </option>
                    <option value="Software Engineering">
                      Software Engineering
                    </option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Semester</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={formData.semester}
                    onChange={(e) =>
                      setFormData({ ...formData, semester: e.target.value })
                    }
                    placeholder="e.g., 2024/2025"
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
                  placeholder="Class description..."
                  rows="3"
                />
              </div>
              <div className="modal-action">
                <button
                  className="btn btn-outline"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary bg-red-600 hover:bg-red-700 border-red-600"
                  onClick={handleEditClass}
                >
                  Update Class
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

export default AdminClasses;
