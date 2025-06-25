import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

const problems = [
  { id: 1, name: "Sum of Two Numbers" },
  { id: 2, name: "Palindrome Checker" },
  { id: 3, name: "Binary Search" },
];

const languages = [
  { value: "c", label: "C" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
];

const Submission = () => {
  const [user, setUser] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(problems[0].id);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0].value);
  const [code, setCode] = useState("");
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [tab, setTab] = useState("editor");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get caseId from URL if coming from case detail
  const caseId = searchParams.get("caseId");

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

      // If caseId is provided, set the problem accordingly
      if (caseId) {
        setSelectedProblem(parseInt(caseId));
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/");
    }
  }, [navigate, caseId]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = [".c", ".py", ".java", ".cpp", ".txt"];
      const fileExtension = selectedFile.name
        .substring(selectedFile.name.lastIndexOf("."))
        .toLowerCase();

      if (!allowedTypes.includes(fileExtension)) {
        setFeedback(
          "Error: Please select a valid file type (.c, .py, .java, .cpp, .txt)"
        );
        return;
      }

      // Validate file size (max 1MB)
      if (selectedFile.size > 1024 * 1024) {
        setFeedback("Error: File size must be less than 1MB");
        return;
      }

      setFile(selectedFile);
      setCode("");
      setFeedback("");
    }
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
    setFile(null);
    setFeedback("");
  };

  const simulateSubmissionProcess = async (submissionData) => {
    // Simulate the submission process with status updates
    const statuses = ["Queued", "Running", "Accepted"];
    const delays = [1000, 2000, 1000]; // 1s queued, 2s running, 1s result

    for (let i = 0; i < statuses.length; i++) {
      setSubmissionStatus({
        status: statuses[i],
        message:
          i === 0
            ? "Your submission is in queue..."
            : i === 1
            ? "Running test cases..."
            : "All test cases passed!",
        progress: ((i + 1) / statuses.length) * 100,
      });

      await new Promise((resolve) => setTimeout(resolve, delays[i]));
    }

    return {
      success: true,
      submissionId: Math.floor(Math.random() * 10000),
      status: "Accepted",
      score: 100,
      testCasesPassed: 5,
      totalTestCases: 5,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code.trim() && !file) {
      setFeedback("Error: Please provide code or upload a file");
      return;
    }

    setIsSubmitting(true);
    setFeedback("");
    setSubmissionStatus(null);

    try {
      const submissionData = {
        problemId: selectedProblem,
        language: selectedLanguage,
        code: code,
        fileName: file?.name,
        userId: user.nim,
        submittedAt: new Date().toISOString(),
      };

      // Simulate submission process
      const result = await simulateSubmissionProcess(submissionData);

      if (result.success) {
        setFeedback(
          `Submission successful! Submission ID: ${result.submissionId}`
        );

        // Store submission in localStorage for demo purposes
        const submissions = JSON.parse(
          localStorage.getItem("submissions") || "[]"
        );
        submissions.push({
          id: result.submissionId,
          ...submissionData,
          status: result.status,
          score: result.score,
          testCasesPassed: result.testCasesPassed,
          totalTestCases: result.totalTestCases,
        });
        localStorage.setItem("submissions", JSON.stringify(submissions));

        // Clear form after successful submission
        setTimeout(() => {
          setCode("");
          setFile(null);
          setSubmissionStatus(null);
          setFeedback("");
        }, 3000);
      } else {
        setFeedback("Submission failed. Please try again.");
      }
    } catch (error) {
      setFeedback("An error occurred during submission. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    navigate("/");
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
        <div className="bg-white/95 shadow-2xl rounded-2xl p-0 w-full max-w-2xl flex flex-col gap-0 border border-blue-100">
          {/* Card Header */}
          <div className="flex items-center gap-3 px-8 py-6 border-b border-blue-100 rounded-t-2xl bg-gradient-to-r from-blue-50 to-blue-100">
            <span className="material-icons text-blue-500 text-3xl">
              upload_file
            </span>
            <h2 className="text-2xl font-bold text-blue-700">
              Submit Your Solution
            </h2>
          </div>

          {/* Student Info */}
          <div className="px-8 pt-4 pb-2 bg-blue-50">
            <div className="text-sm text-blue-700">
              <span className="font-semibold">Student:</span> {user.name} (
              {user.nim})
            </div>
          </div>

          <form
            className="flex flex-col gap-6 px-8 py-8"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="font-semibold text-gray-700">
                  Select Problem
                </label>
                <select
                  className="select select-bordered w-full mt-1"
                  value={selectedProblem}
                  onChange={(e) => setSelectedProblem(Number(e.target.value))}
                  disabled={isSubmitting}
                >
                  {problems.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="font-semibold text-gray-700">Language</label>
                <select
                  className="select select-bordered w-full mt-1"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  disabled={isSubmitting}
                >
                  {languages.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tabs for File Upload / Editor */}
            <div>
              <div className="flex w-full mb-4 gap-2">
                <button
                  type="button"
                  className={`flex-1 tab tab-lg tab-bordered text-lg font-semibold rounded-t-lg transition-colors duration-200 ${
                    tab === "editor"
                      ? "tab-active bg-blue-100 text-blue-700 border-b-2 border-blue-500"
                      : "bg-white text-gray-600 hover:bg-blue-50"
                  }`}
                  onClick={() => setTab("editor")}
                  disabled={isSubmitting}
                >
                  Embedded IDE
                </button>
                <button
                  type="button"
                  className={`flex-1 tab tab-lg tab-bordered text-lg font-semibold rounded-t-lg transition-colors duration-200 ${
                    tab === "file"
                      ? "tab-active bg-blue-100 text-blue-700 border-b-2 border-blue-500"
                      : "bg-white text-gray-600 hover:bg-blue-50"
                  }`}
                  onClick={() => setTab("file")}
                  disabled={isSubmitting}
                >
                  File Upload
                </button>
              </div>

              {tab === "editor" ? (
                <div>
                  <label className="font-semibold text-gray-700">
                    Type your code below
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full h-40 mt-1 font-mono text-base"
                    placeholder="Type your code here..."
                    value={code}
                    onChange={handleCodeChange}
                    disabled={!!file || isSubmitting}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    You can only use the editor or file upload, not both.
                  </div>
                </div>
              ) : (
                <div>
                  <label className="font-semibold text-gray-700">
                    Upload your code file
                  </label>
                  <input
                    type="file"
                    className="file-input file-input-bordered w-full mt-1"
                    accept=".c,.py,.java,.cpp,.txt"
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                  />
                  {file && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                      <span className="text-xs text-green-600">
                        Selected: {file.name} ({(file.size / 1024).toFixed(1)}{" "}
                        KB)
                      </span>
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    Accepted formats: .c, .py, .java, .cpp, .txt (max 1MB)
                  </div>
                </div>
              )}
            </div>

            {/* Submission Status */}
            {submissionStatus && (
              <div className="alert alert-info">
                <div className="flex items-center gap-3 w-full">
                  <span className="material-icons text-blue-600">
                    {submissionStatus.status === "Queued"
                      ? "schedule"
                      : submissionStatus.status === "Running"
                      ? "sync"
                      : "check_circle"}
                  </span>
                  <div className="flex-1">
                    <div className="font-semibold">
                      {submissionStatus.status}
                    </div>
                    <div className="text-sm">{submissionStatus.message}</div>
                  </div>
                  <div className="w-16">
                    <progress
                      className="progress progress-primary w-full"
                      value={submissionStatus.progress}
                      max="100"
                    ></progress>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className={`btn btn-primary w-full mt-2 text-lg ${
                isSubmitting ? "loading" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Solution"}
            </button>

            {feedback && (
              <div
                className={`alert ${
                  feedback.includes("Error") ? "alert-error" : "alert-success"
                } mt-2 flex items-center gap-2`}
              >
                <span className="material-icons">
                  {feedback.includes("Error") ? "error" : "check_circle"}
                </span>
                <span className="font-semibold">{feedback}</span>
              </div>
            )}
          </form>

          {/* View History Link */}
          <div className="px-8 pb-6 border-t border-blue-100 bg-gray-50">
            <div className="flex justify-between items-center pt-4">
              <div className="text-sm text-gray-600">
                Need to check your previous submissions?
              </div>
              <Link
                to={`/submission-history?caseId=${selectedProblem}`}
                className="btn btn-outline btn-primary btn-sm"
              >
                View History
              </Link>
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

export default Submission;
