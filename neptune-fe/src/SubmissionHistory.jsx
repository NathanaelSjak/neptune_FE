import React, { useState, useEffect } from "react";
import {
  Link,
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Navbar from "./Navbar";

// Mock submission history data
const mockSubmissionHistory = [
  {
    id: 1,
    caseId: 1,
    caseTitle: "Sum of Two Numbers",
    contestId: 1,
    contestTitle: "Week 1 Programming Contest",
    submittedAt: "2024-06-25T10:30:00",
    language: "Python",
    status: "Accepted",
    score: 100,
    maxScore: 100,
    testCasesPassed: 5,
    totalTestCases: 5,
    executionTime: "0.15s",
    memoryUsed: "12.5 MB",
    code: `def solve():
    T = int(input())
    for _ in range(T):
        A, B = map(int, input().split())
        print(A + B)

if __name__ == "__main__":
    solve()`,
    testCaseResults: [
      {
        id: 1,
        status: "Passed",
        input: "1\n1 2",
        expectedOutput: "3",
        actualOutput: "3",
        executionTime: "0.05s",
      },
      {
        id: 2,
        status: "Passed",
        input: "1\n5 7",
        expectedOutput: "12",
        actualOutput: "12",
        executionTime: "0.03s",
      },
      {
        id: 3,
        status: "Passed",
        input: "1\n10 20",
        expectedOutput: "30",
        actualOutput: "30",
        executionTime: "0.04s",
      },
      {
        id: 4,
        status: "Passed",
        input: "1\n100 200",
        expectedOutput: "300",
        actualOutput: "300",
        executionTime: "0.06s",
      },
      {
        id: 5,
        status: "Passed",
        input: "1\n999999999 1",
        expectedOutput: "1000000000",
        actualOutput: "1000000000",
        executionTime: "0.08s",
      },
    ],
  },
  {
    id: 2,
    caseId: 2,
    caseTitle: "Palindrome Checker",
    contestId: 1,
    contestTitle: "Week 1 Programming Contest",
    submittedAt: "2024-06-25T11:15:00",
    language: "C",
    status: "Wrong Answer",
    score: 60,
    maxScore: 200,
    testCasesPassed: 3,
    totalTestCases: 5,
    executionTime: "0.25s",
    memoryUsed: "8.2 MB",
    code: `#include <stdio.h>
#include <string.h>

int isPalindrome(char str[]) {
    int len = strlen(str);
    for(int i = 0; i < len/2; i++) {
        if(str[i] != str[len-1-i]) return 0;
    }
    return 1;
}

int main() {
    char str[100];
    scanf("%s", str);
    printf("%s", isPalindrome(str) ? "YES" : "NO");
    return 0;
}`,
    testCaseResults: [
      {
        id: 1,
        status: "Passed",
        input: "racecar",
        expectedOutput: "YES",
        actualOutput: "YES",
        executionTime: "0.02s",
      },
      {
        id: 2,
        status: "Passed",
        input: "hello",
        expectedOutput: "NO",
        actualOutput: "NO",
        executionTime: "0.01s",
      },
      {
        id: 3,
        status: "Passed",
        input: "anna",
        expectedOutput: "YES",
        actualOutput: "YES",
        executionTime: "0.01s",
      },
      {
        id: 4,
        status: "Failed",
        input: "A man a plan a canal Panama",
        expectedOutput: "YES",
        actualOutput: "NO",
        executionTime: "0.03s",
      },
      {
        id: 5,
        status: "Failed",
        input: "Was it a car or a cat I saw?",
        expectedOutput: "YES",
        actualOutput: "NO",
        executionTime: "0.02s",
      },
    ],
  },
  {
    id: 3,
    caseId: 1,
    caseTitle: "Sum of Two Numbers",
    contestId: 1,
    contestTitle: "Week 1 Programming Contest",
    submittedAt: "2024-06-25T09:45:00",
    language: "Python",
    status: "Compilation Error",
    score: 0,
    maxScore: 100,
    testCasesPassed: 0,
    totalTestCases: 5,
    executionTime: "0s",
    memoryUsed: "0 MB",
    code: `def solve():
    T = int(input())
    for _ in range(T):
        A, B = map(int, input().split())
        print(A + B)

solve()`, // Missing if __name__ == "__main__":
    compilationError: "IndentationError: expected an indented block",
    testCaseResults: [],
  },
];

const SubmissionHistory = () => {
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const caseId = searchParams.get("caseId");
  const contestId = searchParams.get("contestId");

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

      // Filter submissions based on context
      let filteredSubmissions = mockSubmissionHistory;
      if (caseId) {
        filteredSubmissions = mockSubmissionHistory.filter(
          (sub) => sub.caseId === parseInt(caseId)
        );
      } else if (contestId) {
        filteredSubmissions = mockSubmissionHistory.filter(
          (sub) => sub.contestId === parseInt(contestId)
        );
      }

      setSubmissions(filteredSubmissions);
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/");
    }
  }, [navigate, caseId, contestId]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "badge-success";
      case "Wrong Answer":
        return "badge-error";
      case "Time Limit Exceeded":
        return "badge-warning";
      case "Memory Limit Exceeded":
        return "badge-warning";
      case "Compilation Error":
        return "badge-error";
      case "Runtime Error":
        return "badge-error";
      case "Queued":
        return "badge-neutral";
      case "Running":
        return "badge-info";
      default:
        return "badge-neutral";
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

  const getTestCaseStatusColor = (status) => {
    switch (status) {
      case "Passed":
        return "text-green-600";
      case "Failed":
        return "text-red-600";
      case "Time Limit":
        return "text-yellow-600";
      case "Memory Limit":
        return "text-yellow-600";
      default:
        return "text-gray-600";
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
      <Navbar user={user} onLogout={handleLogout} />
      <div className="min-h-[80vh] flex flex-col items-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-2 py-8">
        <div className="bg-white/95 shadow-2xl rounded-2xl p-0 w-full max-w-6xl flex flex-col gap-0 border border-blue-100">
          {/* Header */}
          <div className="flex items-center gap-3 px-8 py-6 border-b border-blue-100 rounded-t-2xl bg-gradient-to-r from-blue-50 to-blue-100">
            <span className="material-icons text-blue-500 text-3xl">
              history
            </span>
            <h2 className="text-2xl font-bold text-blue-700">
              Submission History
            </h2>
          </div>

          {/* Student Info */}
          <div className="px-8 pt-4 pb-2 bg-blue-50">
            <div className="text-sm text-blue-700">
              <span className="font-semibold">Student:</span> {user.name} (
              {user.nim})
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Submissions List */}
            <div className="lg:w-1/3 border-r border-blue-100">
              <div className="p-6">
                <h3 className="text-lg font-bold text-blue-700 mb-4">
                  Submissions ({submissions.length})
                </h3>

                {submissions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No submissions found
                  </div>
                ) : (
                  <div className="space-y-3">
                    {submissions.map((submission) => (
                      <div
                        key={submission.id}
                        className={`card bg-white border cursor-pointer transition-all duration-200 rounded-lg p-4 ${
                          selectedSubmission?.id === submission.id
                            ? "border-blue-500 shadow-lg"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                        onClick={() => setSelectedSubmission(submission)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-blue-700 text-sm">
                              {submission.caseTitle}
                            </h4>
                            <p className="text-xs text-gray-600">
                              {submission.contestTitle}
                            </p>
                          </div>
                          <div
                            className={`badge ${getStatusColor(
                              submission.status
                            )} badge-sm`}
                          >
                            {submission.status}
                          </div>
                        </div>

                        <div className="text-xs text-gray-600 space-y-1">
                          <div>
                            Score: {submission.score}/{submission.maxScore}
                          </div>
                          <div>
                            Tests: {submission.testCasesPassed}/
                            {submission.totalTestCases}
                          </div>
                          <div>Time: {submission.executionTime}</div>
                          <div>Language: {submission.language}</div>
                          <div>{formatDateTime(submission.submittedAt)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submission Details */}
            <div className="lg:w-2/3">
              {selectedSubmission ? (
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-blue-700">
                        {selectedSubmission.caseTitle}
                      </h3>
                      <p className="text-gray-600">
                        {selectedSubmission.contestTitle}
                      </p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`badge ${getStatusColor(
                          selectedSubmission.status
                        )} badge-lg`}
                      >
                        {selectedSubmission.status}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Score: {selectedSubmission.score}/
                        {selectedSubmission.maxScore}
                      </div>
                    </div>
                  </div>

                  {/* Submission Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm font-semibold text-gray-700">
                        Execution Time
                      </div>
                      <div className="text-lg text-blue-700">
                        {selectedSubmission.executionTime}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm font-semibold text-gray-700">
                        Memory Used
                      </div>
                      <div className="text-lg text-blue-700">
                        {selectedSubmission.memoryUsed}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm font-semibold text-gray-700">
                        Test Cases
                      </div>
                      <div className="text-lg text-blue-700">
                        {selectedSubmission.testCasesPassed}/
                        {selectedSubmission.totalTestCases}
                      </div>
                    </div>
                  </div>

                  {/* Compilation Error */}
                  {selectedSubmission.compilationError && (
                    <div className="mb-6">
                      <h4 className="font-bold text-red-700 mb-2">
                        Compilation Error
                      </h4>
                      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                        <pre className="text-red-700 text-sm font-mono">
                          {selectedSubmission.compilationError}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Test Case Results */}
                  {selectedSubmission.testCaseResults.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-bold text-blue-700 mb-4">
                        Test Case Results
                      </h4>
                      <div className="space-y-3">
                        {selectedSubmission.testCaseResults.map((testCase) => (
                          <div
                            key={testCase.id}
                            className="border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="font-semibold text-gray-700">
                                Test Case {testCase.id}
                              </h5>
                              <span
                                className={`font-semibold ${getTestCaseStatusColor(
                                  testCase.status
                                )}`}
                              >
                                {testCase.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <div className="font-semibold text-gray-700 mb-1">
                                  Input
                                </div>
                                <pre className="bg-gray-100 p-2 rounded text-xs font-mono whitespace-pre-wrap">
                                  {testCase.input}
                                </pre>
                              </div>
                              <div>
                                <div className="font-semibold text-gray-700 mb-1">
                                  Expected Output
                                </div>
                                <pre className="bg-green-100 p-2 rounded text-xs font-mono whitespace-pre-wrap">
                                  {testCase.expectedOutput}
                                </pre>
                              </div>
                              <div>
                                <div className="font-semibold text-gray-700 mb-1">
                                  Actual Output
                                </div>
                                <pre
                                  className={`p-2 rounded text-xs font-mono whitespace-pre-wrap ${
                                    testCase.status === "Passed"
                                      ? "bg-green-100"
                                      : "bg-red-100"
                                  }`}
                                >
                                  {testCase.actualOutput}
                                </pre>
                              </div>
                            </div>

                            <div className="text-xs text-gray-600 mt-2">
                              Execution Time: {testCase.executionTime}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Code */}
                  <div>
                    <h4 className="font-bold text-blue-700 mb-4">
                      Submitted Code
                    </h4>
                    <div className="bg-gray-900 p-4 rounded-lg">
                      <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap overflow-x-auto">
                        {selectedSubmission.code}
                      </pre>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <span className="material-icons text-4xl mb-2">
                      description
                    </span>
                    <p>Select a submission to view details</p>
                  </div>
                </div>
              )}
            </div>
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

export default SubmissionHistory;
