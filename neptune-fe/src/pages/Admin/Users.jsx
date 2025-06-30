import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/Navbar/AdminNavbar";

// Mock data
const mockUsers = [
  {
    id: "S001",
    nim: "2440001234",
    name: "John Smith",
    email: "john.smith@binus.ac.id",
    role: "student",
    department: "Computer Science",
    major: "Software Engineering",
    semester: 4,
    classes: ["COMP6040", "COMP6050"],
    status: "active",
    joinDate: "2024-01-15",
    lastLogin: "2024-06-25T10:30:00",
    submissions: 45,
    averageScore: 85.5,
  },
  {
    id: "S002",
    nim: "2440001235",
    name: "Sarah Johnson",
    email: "sarah.johnson@binus.ac.id",
    role: "student",
    department: "Computer Science",
    major: "Computer Science",
    semester: 6,
    classes: ["COMP6040", "COMP6050", "COMP6060"],
    status: "active",
    joinDate: "2024-01-15",
    lastLogin: "2024-06-25T09:15:00",
    submissions: 78,
    averageScore: 92.3,
  },
  {
    id: "L001",
    nim: "L001",
    name: "Dr. Michael Chen",
    email: "michael.chen@binus.ac.id",
    role: "lecturer",
    department: "Computer Science",
    major: "Software Laboratory Center",
    semester: null,
    classes: ["COMP6040", "COMP6050"],
    status: "active",
    joinDate: "2023-08-01",
    lastLogin: "2024-06-25T08:45:00",
    submissions: null,
    averageScore: null,
  },
  {
    id: "L002",
    nim: "L002",
    name: "Dr. Emily Davis",
    email: "emily.davis@binus.ac.id",
    role: "lecturer",
    department: "Computer Science",
    major: "Software Laboratory Center",
    semester: null,
    classes: ["COMP6030", "COMP6060"],
    status: "active",
    joinDate: "2023-09-15",
    lastLogin: "2024-06-24T16:30:00",
    submissions: null,
    averageScore: null,
  },
  {
    id: "A001",
    nim: "A001",
    name: "Dr. Robert Wilson",
    email: "robert.wilson@binus.ac.id",
    role: "admin",
    department: "Software Laboratory Center",
    major: "System Administration",
    semester: null,
    classes: [],
    status: "active",
    joinDate: "2023-01-01",
    lastLogin: "2024-06-25T11:00:00",
    submissions: null,
    averageScore: null,
  },
];

const mockClasses = [
  { id: "COMP6040", name: "Programming Fundamentals" },
  { id: "COMP6050", name: "Advanced Algorithms" },
  { id: "COMP6030", name: "Data Structures" },
  { id: "COMP6060", name: "Software Engineering" },
];

const AdminUsers = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const navigate = useNavigate();

  // Form state for user management
  const [formData, setFormData] = useState({
    nim: "",
    name: "",
    email: "",
    role: "student",
    department: "Computer Science",
    major: "Software Engineering",
    semester: 1,
    classes: [],
    status: "active",
  });

  // Form state for bulk upload
  const [bulkData, setBulkData] = useState({
    csvData: "",
    role: "student",
    defaultDepartment: "Computer Science",
    defaultMajor: "Software Engineering",
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
      setUsers(mockUsers);
      setClasses(mockClasses);
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

  const handleCreateUser = () => {
    const newUser = {
      ...formData,
      id:
        formData.role === "student"
          ? `S${String(
              users.filter((u) => u.role === "student").length + 1
            ).padStart(3, "0")}`
          : formData.role === "lecturer"
          ? `L${String(
              users.filter((u) => u.role === "lecturer").length + 1
            ).padStart(3, "0")}`
          : `A${String(
              users.filter((u) => u.role === "admin").length + 1
            ).padStart(3, "0")}`,
      joinDate: new Date().toISOString().split("T")[0],
      lastLogin: null,
      submissions: formData.role === "student" ? 0 : null,
      averageScore: formData.role === "student" ? 0 : null,
    };

    setUsers([...users, newUser]);
    setShowUserModal(false);
    setFormData({
      nim: "",
      name: "",
      email: "",
      role: "student",
      department: "Computer Science",
      major: "Software Engineering",
      semester: 1,
      classes: [],
      status: "active",
    });
  };

  const handleUpdateUser = () => {
    const updatedUsers = users.map((userItem) =>
      userItem.id === selectedUser.id ? { ...userItem, ...formData } : userItem
    );

    setUsers(updatedUsers);
    setShowUserModal(false);
    setSelectedUser(null);
    setFormData({
      nim: "",
      name: "",
      email: "",
      role: "student",
      department: "Computer Science",
      major: "Software Engineering",
      semester: 1,
      classes: [],
      status: "active",
    });
  };

  const handleDeleteUser = (userId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      setUsers(users.filter((userItem) => userItem.id !== userId));
    }
  };

  const handlePromoteUser = (userId) => {
    const userToPromote = users.find((u) => u.id === userId);
    if (userToPromote && userToPromote.role === "student") {
      const updatedUsers = users.map((userItem) =>
        userItem.id === userId
          ? {
              ...userItem,
              role: "lecturer",
              major: "Software Laboratory Center",
              semester: null,
            }
          : userItem
      );
      setUsers(updatedUsers);
    }
  };

  const handleDemoteUser = (userId) => {
    const userToDemote = users.find((u) => u.id === userId);
    if (userToDemote && userToDemote.role === "lecturer") {
      const updatedUsers = users.map((userItem) =>
        userItem.id === userId
          ? {
              ...userItem,
              role: "student",
              major: "Software Engineering",
              semester: 1,
            }
          : userItem
      );
      setUsers(updatedUsers);
    }
  };

  const handleBulkUpload = () => {
    // Parse CSV data and create users
    const lines = bulkData.csvData.trim().split("\n");
    const newUsers = [];

    lines.forEach((line, index) => {
      if (index === 0) return; // Skip header
      const [nim, name, email] = line.split(",");
      if (nim && name && email) {
        const newUser = {
          id: `S${String(
            users.filter((u) => u.role === "student").length +
              newUsers.length +
              1
          ).padStart(3, "0")}`,
          nim: nim.trim(),
          name: name.trim(),
          email: email.trim(),
          role: bulkData.role,
          department: bulkData.defaultDepartment,
          major: bulkData.defaultMajor,
          semester: bulkData.role === "student" ? 1 : null,
          classes: [],
          status: "active",
          joinDate: new Date().toISOString().split("T")[0],
          lastLogin: null,
          submissions: bulkData.role === "student" ? 0 : null,
          averageScore: bulkData.role === "student" ? 0 : null,
        };
        newUsers.push(newUser);
      }
    });

    setUsers([...users, ...newUsers]);
    setShowBulkModal(false);
    setBulkData({
      csvData: "",
      role: "student",
      defaultDepartment: "Computer Science",
      defaultMajor: "Software Engineering",
    });
  };

  const openUserModal = (userData = null) => {
    if (userData) {
      setSelectedUser(userData);
      setFormData({
        nim: userData.nim,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        department: userData.department,
        major: userData.major,
        semester: userData.semester || 1,
        classes: userData.classes,
        status: userData.status,
      });
    } else {
      setSelectedUser(null);
      setFormData({
        nim: "",
        name: "",
        email: "",
        role: "student",
        department: "Computer Science",
        major: "Software Engineering",
        semester: 1,
        classes: [],
        status: "active",
      });
    }
    setShowUserModal(true);
  };

  // Filter users
  const filteredUsers = users.filter((userItem) => {
    const matchesSearch =
      userItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userItem.nim.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userItem.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || userItem.role === filterRole;
    const matchesStatus = !filterStatus || userItem.status === filterStatus;
    const matchesDepartment =
      !filterDepartment || userItem.department === filterDepartment;

    return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
  });

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "badge-error";
      case "lecturer":
        return "badge-warning";
      case "student":
        return "badge-success";
      default:
        return "badge-neutral";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "badge-success";
      case "inactive":
        return "badge-warning";
      case "suspended":
        return "badge-error";
      default:
        return "badge-neutral";
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "Never";
    return new Date(dateTime).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
                  User Management
                </h1>
                <p className="text-gray-600">
                  Manage all users, roles, and permissions in the system
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowBulkModal(true)}
                  className="btn btn-outline btn-primary"
                >
                  <span className="material-icons mr-2">upload_file</span>
                  Bulk Upload
                </button>
                <button
                  onClick={() => openUserModal()}
                  className="btn btn-primary bg-red-600 hover:bg-red-700 border-red-600"
                >
                  <span className="material-icons mr-2">person_add</span>
                  Add User
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="input input-bordered"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="form-control">
                <select
                  className="select select-bordered"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                >
                  <option value="">All Roles</option>
                  <option value="student">Student</option>
                  <option value="lecturer">Lecturer</option>
                  <option value="admin">Admin</option>
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
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div className="form-control">
                <select
                  className="select select-bordered"
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                >
                  <option value="">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Software Laboratory Center">
                    Software Laboratory Center
                  </option>
                </select>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-600">
                  Total: {filteredUsers.length} users
                </span>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white/90 shadow-2xl rounded-2xl border border-red-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead className="bg-red-50">
                  <tr>
                    <th className="text-red-700">ID</th>
                    <th className="text-red-700">NIM/ID</th>
                    <th className="text-red-700">Name</th>
                    <th className="text-red-700">Role</th>
                    <th className="text-red-700">Department</th>
                    <th className="text-red-700">Classes</th>
                    <th className="text-red-700">Status</th>
                    <th className="text-red-700">Last Login</th>
                    <th className="text-red-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((userItem) => (
                    <tr key={userItem.id} className="hover:bg-red-50">
                      <td className="font-mono font-bold text-red-600">
                        {userItem.id}
                      </td>
                      <td className="font-mono">{userItem.nim}</td>
                      <td>
                        <div>
                          <div className="font-semibold">{userItem.name}</div>
                          <div className="text-sm text-gray-500">
                            {userItem.email}
                          </div>
                          {userItem.role === "student" && (
                            <div className="text-xs text-gray-400">
                              Semester {userItem.semester} • {userItem.major}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge ${getRoleColor(userItem.role)}`}
                        >
                          {userItem.role}
                        </span>
                      </td>
                      <td>
                        <div className="text-sm">
                          <div className="font-semibold">
                            {userItem.department}
                          </div>
                          <div className="text-gray-500">{userItem.major}</div>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          <div className="font-semibold">
                            {userItem.classes.length} classes
                          </div>
                          <div className="text-gray-500">
                            {userItem.classes.slice(0, 2).join(", ")}
                            {userItem.classes.length > 2 && "..."}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge ${getStatusColor(userItem.status)}`}
                        >
                          {userItem.status}
                        </span>
                      </td>
                      <td>
                        <div className="text-sm text-gray-600">
                          {formatDateTime(userItem.lastLogin)}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => openUserModal(userItem)}
                            className="btn btn-xs btn-outline btn-primary"
                          >
                            Edit
                          </button>
                          {userItem.role === "student" && (
                            <button
                              onClick={() => handlePromoteUser(userItem.id)}
                              className="btn btn-xs btn-outline btn-warning"
                            >
                              Promote
                            </button>
                          )}
                          {userItem.role === "lecturer" && (
                            <button
                              onClick={() => handleDemoteUser(userItem.id)}
                              className="btn btn-xs btn-outline btn-warning"
                            >
                              Demote
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(userItem.id)}
                            className="btn btn-xs btn-outline btn-error"
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

        {/* User Modal */}
        {showUserModal && (
          <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
              <h3 className="font-bold text-lg text-red-700 mb-4">
                {selectedUser
                  ? `Edit User: ${selectedUser.name}`
                  : "Create New User"}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">NIM/ID</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={formData.nim}
                    onChange={(e) =>
                      setFormData({ ...formData, nim: e.target.value })
                    }
                    placeholder="e.g., 2440001234"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Full name"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    className="input input-bordered"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="email@binus.ac.id"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Role</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  >
                    <option value="student">Student</option>
                    <option value="lecturer">Lecturer</option>
                    <option value="admin">Admin</option>
                  </select>
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
                    <option value="Software Laboratory Center">
                      Software Laboratory Center
                    </option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Major</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={formData.major}
                    onChange={(e) =>
                      setFormData({ ...formData, major: e.target.value })
                    }
                  >
                    <option value="Software Engineering">
                      Software Engineering
                    </option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Software Laboratory Center">
                      Software Laboratory Center
                    </option>
                    <option value="System Administration">
                      System Administration
                    </option>
                  </select>
                </div>
                {formData.role === "student" && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Semester</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered"
                      value={formData.semester}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          semester: parseInt(e.target.value),
                        })
                      }
                      min="1"
                      max="14"
                    />
                  </div>
                )}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Status</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Assigned Classes</span>
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {classes.map((classItem) => (
                    <label key={classItem.id} className="label cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={formData.classes.includes(classItem.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              classes: [...formData.classes, classItem.id],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              classes: formData.classes.filter(
                                (id) => id !== classItem.id
                              ),
                            });
                          }
                        }}
                      />
                      <span className="text-sm">
                        {classItem.id} - {classItem.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="modal-action">
                <button
                  className="btn btn-outline"
                  onClick={() => setShowUserModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary bg-red-600 hover:bg-red-700 border-red-600"
                  onClick={selectedUser ? handleUpdateUser : handleCreateUser}
                >
                  {selectedUser ? "Update User" : "Create User"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Upload Modal */}
        {showBulkModal && (
          <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
              <h3 className="font-bold text-lg text-red-700 mb-4">
                Bulk Upload Users
              </h3>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">
                      CSV Data (NIM, Name, Email)
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered"
                    value={bulkData.csvData}
                    onChange={(e) =>
                      setBulkData({ ...bulkData, csvData: e.target.value })
                    }
                    placeholder="NIM,Name,Email&#10;2440001234,John Smith,john.smith@binus.ac.id&#10;2440001235,Sarah Johnson,sarah.johnson@binus.ac.id"
                    rows="8"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Role</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={bulkData.role}
                      onChange={(e) =>
                        setBulkData({ ...bulkData, role: e.target.value })
                      }
                    >
                      <option value="student">Student</option>
                      <option value="lecturer">Lecturer</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Department</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={bulkData.defaultDepartment}
                      onChange={(e) =>
                        setBulkData({
                          ...bulkData,
                          defaultDepartment: e.target.value,
                        })
                      }
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Software Laboratory Center">
                        Software Laboratory Center
                      </option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Major</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={bulkData.defaultMajor}
                      onChange={(e) =>
                        setBulkData({
                          ...bulkData,
                          defaultMajor: e.target.value,
                        })
                      }
                    >
                      <option value="Software Engineering">
                        Software Engineering
                      </option>
                      <option value="Computer Science">Computer Science</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-action">
                <button
                  className="btn btn-outline"
                  onClick={() => setShowBulkModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary bg-red-600 hover:bg-red-700 border-red-600"
                  onClick={handleBulkUpload}
                >
                  Upload Users
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

export default AdminUsers;
