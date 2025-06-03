import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const navCards = [
  {
    to: "/submission",
    title: "Submission",
    desc: "Submit your code or files for problems.",
    icon: "upload",
  },
  {
    to: "/leaderboard",
    title: "Leaderboard",
    desc: "View class and global rankings.",
    icon: "leaderboard",
  },
  {
    to: "/cases",
    title: "Cases",
    desc: "Browse and manage programming cases.",
    icon: "folder_open",
  },
  {
    to: "/submissions",
    title: "Submissions Review",
    desc: "Review student submissions (staff/lecturer).",
    icon: "fact_check",
  },
];

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-2 py-8">
        <div className="bg-white/90 shadow-2xl rounded-2xl p-10 w-full max-w-2xl flex flex-col items-center mb-12 border border-blue-100">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-3 text-center drop-shadow">
            Welcome to NEPTUNE
          </h1>
          <p className="text-gray-600 mb-2 text-lg text-center max-w-xl">
            A platform for competitive programming practice and management.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          {navCards.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="card bg-white/80 border border-blue-100 shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-200 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer group"
            >
              <span className="material-icons text-blue-500 text-4xl mb-2 group-hover:text-blue-700 transition-colors">
                {card.icon}
              </span>
              <h2 className="card-title text-xl font-bold text-blue-700 group-hover:text-blue-900">
                {card.title}
              </h2>
              <p className="text-gray-600 text-center text-base">{card.desc}</p>
            </Link>
          ))}
        </div>
        {/* Material Icons font */}
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </div>
    </>
  );
};

export default Dashboard;
