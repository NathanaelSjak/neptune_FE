import axios from "axios";
// DISCONNECTED MODE: Set to true to fully disconnect frontend from backend
const DISCONNECTED = true;

// Example mock data (expand as needed)
const mockUser = {
  id: 1,
  name: "Mock User",
  email: "mock@user.com",
  role: "student",
};

const mockClass = {
  id: 1,
  name: "Mock Class",
  code: "MOCK101",
  semester: "2024/2025-1",
};

const mockContest = {
  id: 1,
  name: "Mock Contest",
  status: "active",
};

const mockCase = {
  id: 1,
  title: "Mock Case",
};

const mockSubmission = {
  id: 1,
  status: "success",
};

const mockReport = {
  overview: "All systems nominal (mock)",
};

// Helper to simulate async
const mockAsync = (data) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), 200));

let authAPI,
  userAPI,
  classAPI,
  contestAPI,
  caseAPI,
  submissionAPI,
  reportAPI,
  fileAPI,
  api;

if (DISCONNECTED) {
  // Stub all API objects
  authAPI = {
    login: () => mockAsync({ user: mockUser, token: "mock-token" }),
    register: () => mockAsync({ user: mockUser }),
    logout: () => mockAsync({ success: true }),
    refreshToken: () => mockAsync({ token: "mock-token" }),
    getProfile: () => mockAsync(mockUser),
  };

  userAPI = {
    getUsers: () => mockAsync([mockUser]),
    getUser: () => mockAsync(mockUser),
    createUser: () => mockAsync(mockUser),
    updateUser: () => mockAsync(mockUser),
    deleteUser: () => mockAsync({ success: true }),
    bulkCreateUsers: () => mockAsync([mockUser]),
  };

  classAPI = {
    getClasses: () => mockAsync([mockClass]),
    getClass: () => mockAsync(mockClass),
    createClass: () => mockAsync(mockClass),
    updateClass: () => mockAsync(mockClass),
    deleteClass: () => mockAsync({ success: true }),
    getEnrolledClasses: () => mockAsync([mockClass]),
    getAssignedClasses: () => mockAsync([mockClass]),
  };

  contestAPI = {
    getContests: () => mockAsync([mockContest]),
    getContest: () => mockAsync(mockContest),
    createContest: () => mockAsync(mockContest),
    updateContest: () => mockAsync(mockContest),
    deleteContest: () => mockAsync({ success: true }),
    getActiveContests: () => mockAsync([mockContest]),
    getUpcomingContests: () => mockAsync([mockContest]),
    getContestLeaderboard: () => mockAsync([]),
  };

  caseAPI = {
    getCases: () => mockAsync([mockCase]),
    getCase: () => mockAsync(mockCase),
    createCase: () => mockAsync(mockCase),
    updateCase: () => mockAsync(mockCase),
    deleteCase: () => mockAsync({ success: true }),
    getTestCaseResults: () => mockAsync([]),
    uploadTestCase: () => mockAsync({ success: true }),
  };

  submissionAPI = {
    getSubmissions: () => mockAsync([mockSubmission]),
    getSubmission: () => mockAsync(mockSubmission),
    createSubmission: () => mockAsync(mockSubmission),
    getSubmissionHistory: () => mockAsync([mockSubmission]),
    getSubmissionStatus: () => mockAsync({ status: "success" }),
    downloadSubmissions: () => mockAsync({}),
  };

  reportAPI = {
    getSystemOverview: () => mockAsync(mockReport),
    getUserActivity: () => mockAsync([]),
    getPerformanceMetrics: () => mockAsync({}),
    getContestAnalytics: () => mockAsync({}),
    getRecentActivity: () => mockAsync([]),
  };

  fileAPI = {
    uploadFile: () => mockAsync({ url: "mock-file-url" }),
  };

  api = {};
} else {
  // Create axios instance with base configuration
  const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:8000/api";

  api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor to add auth token
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Unauthorized - redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
        window.location.href = "/";
      }
      return Promise.reject(error);
    }
  );

  // Auth API calls
  authAPI = {
    login: (credentials) => api.post("/auth/login", credentials),
    register: (userData) => api.post("/auth/register", userData),
    logout: () => api.post("/auth/logout"),
    refreshToken: () => api.post("/auth/refresh"),
    getProfile: () => api.get("/auth/profile"),
  };

  userAPI = {
    getUsers: (params) => api.get("/users", { params }),
    getUser: (id) => api.get(`/users/${id}`),
    createUser: (userData) => api.post("/users", userData),
    updateUser: (id, userData) => api.put(`/users/${id}`, userData),
    deleteUser: (id) => api.delete(`/users/${id}`),
    bulkCreateUsers: (usersData) => api.post("/users/bulk", usersData),
  };

  classAPI = {
    getClasses: (params) => api.get("/classes", { params }),
    getClass: (id) => api.get(`/classes/${id}`),
    createClass: (classData) => api.post("/classes", classData),
    updateClass: (id, classData) => api.put(`/classes/${id}`, classData),
    deleteClass: (id) => api.delete(`/classes/${id}`),
    getEnrolledClasses: () => api.get("/classes/enrolled"),
    getAssignedClasses: () => api.get("/classes/assigned"),
  };

  contestAPI = {
    getContests: (params) => api.get("/contests", { params }),
    getContest: (id) => api.get(`/contests/${id}`),
    createContest: (contestData) => api.post("/contests", contestData),
    updateContest: (id, contestData) => api.put(`/contests/${id}`, contestData),
    deleteContest: (id) => api.delete(`/contests/${id}`),
    getActiveContests: () => api.get("/contests/active"),
    getUpcomingContests: () => api.get("/contests/upcoming"),
    getContestLeaderboard: (id) => api.get(`/contests/${id}/leaderboard`),
  };

  caseAPI = {
    getCases: (params) => api.get("/cases", { params }),
    getCase: (id) => api.get(`/cases/${id}`),
    createCase: (caseData) => api.post("/cases", caseData),
    updateCase: (id, caseData) => api.put(`/cases/${id}`, caseData),
    deleteCase: (id) => api.delete(`/cases/${id}`),
    getTestCaseResults: (id) => api.get(`/cases/${id}/test-results`),
    uploadTestCase: (id, testCaseData) =>
      api.post(`/cases/${id}/test-cases`, testCaseData),
  };

  submissionAPI = {
    getSubmissions: (params) => api.get("/submissions", { params }),
    getSubmission: (id) => api.get(`/submissions/${id}`),
    createSubmission: (submissionData) =>
      api.post("/submissions", submissionData),
    getSubmissionHistory: (params) =>
      api.get("/submissions/history", { params }),
    getSubmissionStatus: (id) => api.get(`/submissions/${id}/status`),
    downloadSubmissions: (params) =>
      api.get("/submissions/download", { params, responseType: "blob" }),
  };

  reportAPI = {
    getSystemOverview: () => api.get("/reports/system-overview"),
    getUserActivity: (params) => api.get("/reports/user-activity", { params }),
    getPerformanceMetrics: () => api.get("/reports/performance"),
    getContestAnalytics: (params) =>
      api.get("/reports/contest-analytics", { params }),
    getRecentActivity: () => api.get("/reports/recent-activity"),
  };

  fileAPI = {
    uploadFile: (file, onProgress) => {
      const formData = new FormData();
      formData.append("file", file);
      return api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: onProgress,
      });
    },
  };
}

export {
  authAPI,
  userAPI,
  classAPI,
  contestAPI,
  caseAPI,
  submissionAPI,
  reportAPI,
  fileAPI,
};
export default api;
