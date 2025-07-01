import { useState, useCallback } from "react";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall, ...args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall(...args);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    clearError,
  };
};

// Specific hooks for different API operations
export const useAuth = () => {
  const { loading, error, execute, clearError } = useApi();

  const login = useCallback(
    async (credentials) => {
      const { authAPI } = await import("../services/api");
      return execute(authAPI.login, credentials);
    },
    [execute]
  );

  const register = useCallback(
    async (userData) => {
      const { authAPI } = await import("../services/api");
      return execute(authAPI.register, userData);
    },
    [execute]
  );

  const logout = useCallback(async () => {
    const { authAPI } = await import("../services/api");
    return execute(authAPI.logout);
  }, [execute]);

  return {
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };
};

export const useSubmissions = () => {
  const { loading, error, execute, clearError } = useApi();

  const getSubmissions = useCallback(
    async (params) => {
      const { submissionAPI } = await import("../services/api");
      return execute(submissionAPI.getSubmissions, params);
    },
    [execute]
  );

  const createSubmission = useCallback(
    async (submissionData) => {
      const { submissionAPI } = await import("../services/api");
      return execute(submissionAPI.createSubmission, submissionData);
    },
    [execute]
  );

  const getSubmissionHistory = useCallback(
    async (params) => {
      const { submissionAPI } = await import("../services/api");
      return execute(submissionAPI.getSubmissionHistory, params);
    },
    [execute]
  );

  return {
    loading,
    error,
    getSubmissions,
    createSubmission,
    getSubmissionHistory,
    clearError,
  };
};

export const useContests = () => {
  const { loading, error, execute, clearError } = useApi();

  const getContests = useCallback(
    async (params) => {
      const { contestAPI } = await import("../services/api");
      return execute(contestAPI.getContests, params);
    },
    [execute]
  );

  const getContest = useCallback(
    async (id) => {
      const { contestAPI } = await import("../services/api");
      return execute(contestAPI.getContest, id);
    },
    [execute]
  );

  const createContest = useCallback(
    async (contestData) => {
      const { contestAPI } = await import("../services/api");
      return execute(contestAPI.createContest, contestData);
    },
    [execute]
  );

  return {
    loading,
    error,
    getContests,
    getContest,
    createContest,
    clearError,
  };
};

export const useUsers = () => {
  const { loading, error, execute, clearError } = useApi();

  const getUsers = useCallback(
    async (params) => {
      const { userAPI } = await import("../services/api");
      return execute(userAPI.getUsers, params);
    },
    [execute]
  );

  const createUser = useCallback(
    async (userData) => {
      const { userAPI } = await import("../services/api");
      return execute(userAPI.createUser, userData);
    },
    [execute]
  );

  const updateUser = useCallback(
    async (id, userData) => {
      const { userAPI } = await import("../services/api");
      return execute(userAPI.updateUser, id, userData);
    },
    [execute]
  );

  const deleteUser = useCallback(
    async (id) => {
      const { userAPI } = await import("../services/api");
      return execute(userAPI.deleteUser, id);
    },
    [execute]
  );

  return {
    loading,
    error,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    clearError,
  };
};
