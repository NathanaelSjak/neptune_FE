import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Submission from "./Submission";
import Leaderboard from "./Leaderboard";
import Cases from "./Cases";
import CaseSubmission from "./CaseSubmission";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/submission" element={<Submission />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/cases" element={<Cases />} />
        <Route path="/submissions" element={<CaseSubmission />} />
      </Routes>
    </Router>
  );
}

export default App;
