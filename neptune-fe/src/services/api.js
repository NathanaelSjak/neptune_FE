import axios from "axios";

// Create axios instance with base configuration
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const api = axios.create({
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
export const authAPI = {
  // TODO: Replace with your actual login endpoint
  login: (credentials) => api.post("/auth/login", credentials),
  // TODO: Replace with your actual register endpoint
  register: (userData) => api.post("/auth/register", userData),
  // TODO: Replace with your actual logout endpoint
  logout: () => api.post("/auth/logout"),
  // TODO: Replace with your actual refresh token endpoint
  refreshToken: () => api.post("/auth/refresh"),
  // TODO: Replace with your actual profile endpoint
  getProfile: () => api.get("/auth/profile"),
};

// User API calls
export const userAPI = {
  // TODO: Replace with your actual users endpoint
  getUsers: (params) => api.get("/users", { params }),
  // TODO: Replace with your actual user detail endpoint
  getUser: (id) => api.get(`/users/${id}`),
  // TODO: Replace with your actual create user endpoint
  createUser: (userData) => api.post("/users", userData),
  // TODO: Replace with your actual update user endpoint
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  // TODO: Replace with your actual delete user endpoint
  deleteUser: (id) => api.delete(`/users/${id}`),
  // TODO: Replace with your actual bulk create users endpoint
  bulkCreateUsers: (usersData) => api.post("/users/bulk", usersData),
};

// Class API calls
export const classAPI = {
  // TODO: Replace with your actual classes endpoint
  getClasses: (params) => api.get("/classes", { params }),
  // TODO: Replace with your actual class detail endpoint
  getClass: (id) => api.get(`/classes/${id}`),
  // TODO: Replace with your actual create class endpoint
  createClass: (classData) => api.post("/classes", classData),
  // TODO: Replace with your actual update class endpoint
  updateClass: (id, classData) => api.put(`/classes/${id}`, classData),
  // TODO: Replace with your actual delete class endpoint
  deleteClass: (id) => api.delete(`/classes/${id}`),
  // TODO: Replace with your actual enrolled classes endpoint
  getEnrolledClasses: () => api.get("/classes/enrolled"),
  // TODO: Replace with your actual assigned classes endpoint
  getAssignedClasses: () => api.get("/classes/assigned"),
};

// Contest API calls
export const contestAPI = {
  // TODO: Replace with your actual contests endpoint
  getContests: (params) => api.get("/contests", { params }),
  // TODO: Replace with your actual contest detail endpoint
  getContest: (id) => api.get(`/contests/${id}`),
  // TODO: Replace with your actual create contest endpoint
  createContest: (contestData) => api.post("/contests", contestData),
  // TODO: Replace with your actual update contest endpoint
  updateContest: (id, contestData) => api.put(`/contests/${id}`, contestData),
  // TODO: Replace with your actual delete contest endpoint
  deleteContest: (id) => api.delete(`/contests/${id}`),
  // TODO: Replace with your actual active contests endpoint
  getActiveContests: () => api.get("/contests/active"),
  // TODO: Replace with your actual upcoming contests endpoint
  getUpcomingContests: () => api.get("/contests/upcoming"),
  // TODO: Replace with your actual contest leaderboard endpoint
  getContestLeaderboard: (id) => api.get(`/contests/${id}/leaderboard`),
};

// Case API calls
export const caseAPI = {
  // TODO: Replace with your actual cases endpoint
  getCases: (params) => api.get("/cases", { params }),
  // TODO: Replace with your actual case detail endpoint
  getCase: (id) => api.get(`/cases/${id}`),
  // TODO: Replace with your actual create case endpoint
  createCase: (caseData) => api.post("/cases", caseData),
  // TODO: Replace with your actual update case endpoint
  updateCase: (id, caseData) => api.put(`/cases/${id}`, caseData),
  // TODO: Replace with your actual delete case endpoint
  deleteCase: (id) => api.delete(`/cases/${id}`),
  // TODO: Replace with your actual test case results endpoint
  getTestCaseResults: (id) => api.get(`/cases/${id}/test-results`),
  // TODO: Replace with your actual upload test case endpoint
  uploadTestCase: (id, testCaseData) =>
    api.post(`/cases/${id}/test-cases`, testCaseData),
};

// Submission API calls
export const submissionAPI = {
  // TODO: Replace with your actual submissions endpoint
  getSubmissions: (params) => api.get("/submissions", { params }),
  // TODO: Replace with your actual submission detail endpoint
  getSubmission: (id) => api.get(`/submissions/${id}`),
  // TODO: Replace with your actual create submission endpoint
  createSubmission: (submissionData) =>
    api.post("/submissions", submissionData),
  // TODO: Replace with your actual submission history endpoint
  getSubmissionHistory: (params) => api.get("/submissions/history", { params }),
  // TODO: Replace with your actual submission status endpoint
  getSubmissionStatus: (id) => api.get(`/submissions/${id}/status`),
  // TODO: Replace with your actual download submissions endpoint
  downloadSubmissions: (params) =>
    api.get("/submissions/download", {
      params,
      responseType: "blob",
    }),
};

// Report API calls
export const reportAPI = {
  // TODO: Replace with your actual system overview endpoint
  getSystemOverview: () => api.get("/reports/system-overview"),
  // TODO: Replace with your actual user activity endpoint
  getUserActivity: (params) => api.get("/reports/user-activity", { params }),
  // TODO: Replace with your actual performance metrics endpoint
  getPerformanceMetrics: () => api.get("/reports/performance"),
  // TODO: Replace with your actual contest analytics endpoint
  getContestAnalytics: (params) =>
    api.get("/reports/contest-analytics", { params }),
  // TODO: Replace with your actual recent activity endpoint
  getRecentActivity: () => api.get("/reports/recent-activity"),
};

// File upload API calls
export const fileAPI = {
  // TODO: Replace with your actual file upload endpoint
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

export default api;
