import React, { useState } from "react";
import Navbar from "./Navbar";

const classes = [
  { id: 1, name: "Class A" },
  { id: 2, name: "Class B" },
  { id: 3, name: "Class C" },
];

const leaderboardData = {
  1: [
    { rank: 1, name: "Alice", score: 100, time: "2024-06-01 10:00" },
    { rank: 2, name: "Bob", score: 90, time: "2024-06-01 10:05" },
    { rank: 3, name: "Charlie", score: 80, time: "2024-06-01 10:10" },
  ],
  2: [
    { rank: 1, name: "David", score: 95, time: "2024-06-01 09:50" },
    { rank: 2, name: "Eve", score: 85, time: "2024-06-01 10:15" },
  ],
  3: [{ rank: 1, name: "Frank", score: 88, time: "2024-06-01 10:20" }],
};

const Leaderboard = () => {
  const [selectedClass, setSelectedClass] = useState(classes[0].id);
  const data = leaderboardData[selectedClass] || [];

  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] flex flex-col items-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-2 py-8">
        <div className="bg-white/95 shadow-2xl rounded-2xl p-0 w-full max-w-3xl flex flex-col gap-0 border border-blue-100">
          {/* Card Header */}
          <div className="flex items-center gap-3 px-8 py-6 border-b border-blue-100 rounded-t-2xl bg-gradient-to-r from-blue-50 to-blue-100">
            <span className="material-icons text-blue-500 text-3xl">
              leaderboard
            </span>
            <h2 className="text-2xl font-bold text-blue-700">Leaderboard</h2>
          </div>
          <div className="px-8 py-6 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="font-semibold text-gray-700">
                  Select Class:
                </label>
                <select
                  className="select select-bordered"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(Number(e.target.value))}
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="overflow-x-auto rounded-xl border border-blue-100 bg-white/90">
              <table className="table w-full">
                <thead>
                  <tr className="bg-blue-50 text-blue-700">
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Score</th>
                    <th>Submission Time</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center text-gray-400 py-8"
                      >
                        No data available.
                      </td>
                    </tr>
                  ) : (
                    data.map((row) => (
                      <tr key={row.rank} className="hover:bg-blue-50">
                        <td className="font-bold text-lg text-blue-700">
                          {row.rank}
                        </td>
                        <td>{row.name}</td>
                        <td>{row.score}</td>
                        <td className="font-mono text-xs">{row.time}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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

export default Leaderboard;
