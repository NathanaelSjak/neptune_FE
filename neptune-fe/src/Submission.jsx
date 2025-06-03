import React, { useState } from "react";
import Navbar from "./Navbar";

const problems = [
  { id: 1, name: "Sum of Two Numbers" },
  { id: 2, name: "Palindrome Checker" },
  { id: 3, name: "Binary Search" },
];

const languages = [
  { value: "c", label: "C" },
  { value: "python", label: "Python" },
];

const Submission = () => {
  const [selectedProblem, setSelectedProblem] = useState(problems[0].id);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0].value);
  const [code, setCode] = useState("");
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [tab, setTab] = useState("editor");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setCode("");
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
    setFile(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFeedback("Submission received! (This is a placeholder.)");
  };

  return (
    <>
      <Navbar />
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
                    disabled={!!file}
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
                    accept=".c,.py,.txt"
                    onChange={handleFileChange}
                  />
                  {file && (
                    <span className="text-xs text-green-600 mt-1 block">
                      Selected: {file.name}
                    </span>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    Accepted formats:{" "}
                    <span className="font-mono text-blue-700">.c</span>,{" "}
                    <span className="font-mono text-blue-700">.py</span>,{" "}
                    <span className="font-mono text-blue-700">.txt</span>
                  </div>
                </div>
              )}
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full mt-2 text-lg"
            >
              Submit
            </button>
            {feedback && (
              <div className="alert alert-success mt-2 flex items-center gap-2">
                <span className="material-icons text-green-600">
                  check_circle
                </span>
                <span className="font-semibold">{feedback}</span>
              </div>
            )}
          </form>
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
