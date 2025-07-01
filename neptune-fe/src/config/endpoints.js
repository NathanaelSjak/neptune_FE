// API Endpoints Configuration
// Replace these placeholder endpoints with your actual backend endpoints

export const ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh",
    PROFILE: "/auth/profile",
  },

  // User management endpoints
  USERS: {
    LIST: "/users",
    DETAIL: (id) => `/users/${id}`,
    CREATE: "/users",
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
    BULK_CREATE: "/users/bulk",
  },

  // Class management endpoints
  CLASSES: {
    LIST: "/classes",
    DETAIL: (id) => `/classes/${id}`,
    CREATE: "/classes",
    UPDATE: (id) => `/classes/${id}`,
    DELETE: (id) => `/classes/${id}`,
    ENROLLED: "/classes/enrolled",
    ASSIGNED: "/classes/assigned",
  },

  // Contest management endpoints
  CONTESTS: {
    LIST: "/contests",
    DETAIL: (id) => `/contests/${id}`,
    CREATE: "/contests",
    UPDATE: (id) => `/contests/${id}`,
    DELETE: (id) => `/contests/${id}`,
    ACTIVE: "/contests/active",
    UPCOMING: "/contests/upcoming",
    LEADERBOARD: (id) => `/contests/${id}/leaderboard`,
  },

  // Case management endpoints
  CASES: {
    LIST: "/cases",
    DETAIL: (id) => `/cases/${id}`,
    CREATE: "/cases",
    UPDATE: (id) => `/cases/${id}`,
    DELETE: (id) => `/cases/${id}`,
    TEST_RESULTS: (id) => `/cases/${id}/test-results`,
    UPLOAD_TEST_CASE: (id) => `/cases/${id}/test-cases`,
  },

  // Submission management endpoints
  SUBMISSIONS: {
    LIST: "/submissions",
    DETAIL: (id) => `/submissions/${id}`,
    CREATE: "/submissions",
    HISTORY: "/submissions/history",
    STATUS: (id) => `/submissions/${id}/status`,
    DOWNLOAD: "/submissions/download",
  },

  // Report endpoints
  REPORTS: {
    SYSTEM_OVERVIEW: "/reports/system-overview",
    USER_ACTIVITY: "/reports/user-activity",
    PERFORMANCE: "/reports/performance",
    CONTEST_ANALYTICS: "/reports/contest-analytics",
    RECENT_ACTIVITY: "/reports/recent-activity",
  },

  // File upload endpoints
  FILES: {
    UPLOAD: "/upload",
  },
};

// Example of how to use these endpoints:
// import { ENDPOINTS } from '../config/endpoints';
//
// // In your API service:
// login: (credentials) => api.post(ENDPOINTS.AUTH.LOGIN, credentials),
// getUser: (id) => api.get(ENDPOINTS.USERS.DETAIL(id)),
// getContest: (id) => api.get(ENDPOINTS.CONTESTS.DETAIL(id)),
