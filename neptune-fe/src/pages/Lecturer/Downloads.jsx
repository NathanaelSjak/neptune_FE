import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LecturerNavbar from "../../components/Navbar/LecturerNavbar";

// Mock download data
const mockDownloadData = {
  classes: [
    { id: 1, name: "Programming Fundamentals", code: "COMP6047" },
    { id: 2, name: "Data Structures", code: "COMP6048" },
    { id: 3, name: "Algorithm Design", code: "COMP6049" },
  ],
  contests: [
    { id: 1, title: "Week 1 Programming Contest", classId: 1 },
    { id: 2, title: "Data Structures Quiz", classId: 2 },
    { id: 3, title: "Algorithm Design Final Exam", classId: 3 },
  ],
  downloadHistory: [
    {
      id: 1,
      fileName: "programming_fundamentals_week1_submissions.zip",
      fileSize: "2.5 MB",
      downloadedAt: "2024-06-25T14:30:00",
      contestTitle: "Week 1 Programming Contest",
      className: "Programming Fundamentals",
      submissionCount: 120,
      format: "ZIP",
    },
    {
      id: 2,
      fileName: "data_structures_quiz_results.csv",
      fileSize: "45 KB",
      downloadedAt: "2024-06-24T16:15:00",
      contestTitle: "Data Structures Quiz",
      className: "Data Structures",
      submissionCount: 38,
      format: "CSV",
    },
  ],
};

const LecturerDownloads = () => {
  const [user, setUser] = useState(null);
  const [downloadData, setDownloadData] = useState(null);
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedContest, setSelectedContest] = useState("all");
  const [selectedFormat, setSelectedFormat] = useState("zip");
  const [includeCode, setIncludeCode] = useState(true);
  const [includeResults, setIncludeResults] = useState(true);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated and is a lecturer
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const userData = localStorage.getItem("user");

    if (!isAuthenticated || !userData) {
      navigate("/");
      return;
    }

    try {
      const userObj = JSON.parse(userData);

      // Check if user is a lecturer
      if (userObj.role !== "lecturer") {
        navigate("/dashboard");
        return;
      }

      setUser(userObj);
      setDownloadData(mockDownloadData);
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

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownload = (type) => {
    // Simulate download process
    const fileName =
      type === "submissions"
        ? `submissions_${selectedClass}_${selectedContest}_${
            new Date().toISOString().split("T")[0]
          }.${selectedFormat}`
        : `results_${selectedClass}_${selectedContest}_${
            new Date().toISOString().split("T")[0]
          }.csv`;

    // Create a mock download
    const link = document.createElement("a");
    link.href = "#";
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show success message
    alert(`Downloading ${fileName}...`);

    // Add to download history
    const newDownload = {
      id: Date.now(),
      fileName: fileName,
      fileSize: "1.2 MB",
      downloadedAt: new Date().toISOString(),
      contestTitle:
        downloadData.contests.find((c) => c.id === parseInt(selectedContest))
          ?.title || "All Contests",
      className:
        downloadData.classes.find((c) => c.id === parseInt(selectedClass))
          ?.name || "All Classes",
      submissionCount: Math.floor(Math.random() * 100) + 20,
      format: selectedFormat.toUpperCase(),
    };

    setDownloadData((prev) => ({
      ...prev,
      downloadHistory: [newDownload, ...prev.downloadHistory],
    }));
  };

  if (!user || !downloadData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      <LecturerNavbar user={user} onLogout={handleLogout} />
      <div className="min-h-[80vh] flex flex-col items-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-2 py-8">
        <div className="bg-white/95 shadow-2xl rounded-2xl p-0 w-full max-w-6xl flex flex-col gap-0 border border-blue-100">
          {/* Header */}
          <div className="flex items-center gap-3 px-8 py-6 border-b border-blue-100 rounded-t-2xl bg-gradient-to-r from-blue-50 to-blue-100">
            <span className="material-icons text-blue-500 text-3xl">
              download
            </span>
            <h2 className="text-2xl font-bold text-blue-700">
              Download Submissions & Reports
            </h2>
          </div>

          {/* Download Options */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Download Submissions */}
              <div className="card bg-white border border-blue-100 shadow-lg rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-icons text-blue-500 text-2xl">
                    assignment
                  </span>
                  <h3 className="text-lg font-bold text-blue-700">
                    Download Submissions
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">
                        Select Class
                      </span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                    >
                      <option value="all">All Classes</option>
                      {downloadData.classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name} ({cls.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">
                        Select Contest
                      </span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={selectedContest}
                      onChange={(e) => setSelectedContest(e.target.value)}
                    >
                      <option value="all">All Contests</option>
                      {downloadData.contests.map((contest) => (
                        <option key={contest.id} value={contest.id}>
                          {contest.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">
                        File Format
                      </span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={selectedFormat}
                      onChange={(e) => setSelectedFormat(e.target.value)}
                    >
                      <option value="zip">ZIP Archive</option>
                      <option value="tar">TAR Archive</option>
                      <option value="rar">RAR Archive</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="label">
                      <span className="label-text font-semibold">Include</span>
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          checked={includeCode}
                          onChange={(e) => setIncludeCode(e.target.checked)}
                        />
                        <span className="text-sm">Source Code Files</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          checked={includeResults}
                          onChange={(e) => setIncludeResults(e.target.checked)}
                        />
                        <span className="text-sm">Test Results</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          checked={includeMetadata}
                          onChange={(e) => setIncludeMetadata(e.target.checked)}
                        />
                        <span className="text-sm">Submission Metadata</span>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownload("submissions")}
                    className="btn btn-primary w-full"
                  >
                    <span className="material-icons text-sm mr-2">
                      download
                    </span>
                    Download Submissions
                  </button>
                </div>
              </div>

              {/* Download Reports */}
              <div className="card bg-white border border-blue-100 shadow-lg rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-icons text-blue-500 text-2xl">
                    assessment
                  </span>
                  <h3 className="text-lg font-bold text-blue-700">
                    Download Reports
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">
                        Report Type
                      </span>
                    </label>
                    <select className="select select-bordered w-full">
                      <option value="summary">Summary Report</option>
                      <option value="detailed">Detailed Report</option>
                      <option value="analytics">Analytics Report</option>
                      <option value="grades">Grades Report</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">
                        Select Class
                      </span>
                    </label>
                    <select className="select select-bordered w-full">
                      <option value="all">All Classes</option>
                      {downloadData.classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name} ({cls.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">
                        Date Range
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        className="input input-bordered"
                        defaultValue="2024-06-01"
                      />
                      <input
                        type="date"
                        className="input input-bordered"
                        defaultValue="2024-06-30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">Format</span>
                    </label>
                    <select className="select select-bordered w-full">
                      <option value="csv">CSV</option>
                      <option value="excel">Excel</option>
                      <option value="pdf">PDF</option>
                    </select>
                  </div>

                  <button
                    onClick={() => handleDownload("reports")}
                    className="btn btn-outline btn-primary w-full"
                  >
                    <span className="material-icons text-sm mr-2">
                      assessment
                    </span>
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Download History */}
          <div className="px-8 py-6 border-t border-blue-100">
            <h3 className="text-lg font-bold text-blue-700 mb-4">
              Download History
            </h3>

            {downloadData.downloadHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No downloads yet
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-blue-100 bg-white/90">
                <table className="table w-full">
                  <thead>
                    <tr className="bg-blue-50 text-blue-700">
                      <th>File Name</th>
                      <th>Class</th>
                      <th>Contest</th>
                      <th>Size</th>
                      <th>Submissions</th>
                      <th>Downloaded</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {downloadData.downloadHistory.map((download) => (
                      <tr key={download.id} className="hover:bg-blue-50">
                        <td className="font-mono text-sm">
                          {download.fileName}
                        </td>
                        <td>{download.className}</td>
                        <td>{download.contestTitle}</td>
                        <td>{download.fileSize}</td>
                        <td>{download.submissionCount}</td>
                        <td className="text-sm">
                          {formatDateTime(download.downloadedAt)}
                        </td>
                        <td>
                          <button className="btn btn-xs btn-outline btn-primary">
                            Download Again
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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

export default LecturerDownloads;
