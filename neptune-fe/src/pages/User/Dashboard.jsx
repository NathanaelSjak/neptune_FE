import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { useAuthState } from "../../hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuthState();
  const [currentSemester, setCurrentSemester] = useState("2024/2025-1");

  // Filter classes for current semester only
  const currentSemesterClasses =
    user?.enrolledClasses?.filter((cls) => cls.semester === currentSemester) ||
    [];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
          <div className="text-center text-sm text-blue-600 mt-2">
            <div className="font-semibold">Student: {user.name}</div>
            <div>NIM: {user.nim}</div>
            <div>Semester: {currentSemester}</div>
          </div>
        </div>

        {/* Current Semester Classes */}
        <div className="w-full max-w-4xl mb-8">
          <div className="bg-white/95 shadow-2xl rounded-2xl p-0 border border-blue-100">
            <div className="flex items-center gap-3 px-8 py-6 border-b border-blue-100 rounded-t-2xl bg-gradient-to-r from-blue-50 to-blue-100">
              <span className="material-icons text-blue-500 text-3xl">
                school
              </span>
              <h2 className="text-2xl font-bold text-blue-700">
                Your Enrolled Classes ({currentSemester})
              </h2>
            </div>

            {currentSemesterClasses.length === 0 ? (
              <div className="px-8 py-12 text-center">
                <div className="text-gray-500 text-lg mb-2">
                  No classes enrolled for this semester
                </div>
                <div className="text-gray-400 text-sm">
                  Please contact your academic advisor if this is incorrect.
                </div>
              </div>
            ) : (
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentSemesterClasses.map((cls) => (
                    <div
                      key={cls.id}
                      className="card bg-white border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <span className="material-icons text-blue-500 text-3xl">
                          class
                        </span>
                        <span className="badge badge-primary badge-sm">
                          {cls.code}
                        </span>
                      </div>
                      <h3 className="card-title text-lg font-bold text-blue-700 mb-2">
                        {cls.name}
                      </h3>
                      <div className="text-sm text-gray-600 mb-4">
                        <div>Course Code: {cls.code}</div>
                        <div>Semester: {cls.semester}</div>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/submission?class=${cls.id}`}
                          className="btn btn-primary btn-sm flex-1"
                        >
                          Submit Code
                        </Link>
                        <Link
                          to={`/leaderboard?class=${cls.id}`}
                          className="btn btn-outline btn-primary btn-sm flex-1"
                        >
                          Leaderboard
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="w-full max-w-4xl">
          <h3 className="text-xl font-bold text-blue-700 mb-4 text-center">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/contests"
              className="card bg-white/80 border border-blue-100 shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-200 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer group"
            >
              <span className="material-icons text-blue-500 text-4xl mb-2 group-hover:text-blue-700 transition-colors">
                emoji_events
              </span>
              <h2 className="card-title text-xl font-bold text-blue-700 group-hover:text-blue-900">
                Contests
              </h2>
              <p className="text-gray-600 text-center text-base">
                View and participate in contests
              </p>
            </Link>

            <Link
              to="/submission"
              className="card bg-white/80 border border-blue-100 shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-200 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer group"
            >
              <span className="material-icons text-blue-500 text-4xl mb-2 group-hover:text-blue-700 transition-colors">
                upload
              </span>
              <h2 className="card-title text-xl font-bold text-blue-700 group-hover:text-blue-900">
                General Submission
              </h2>
              <p className="text-gray-600 text-center text-base">
                Submit code for practice problems
              </p>
            </Link>

            <Link
              to="/leaderboard"
              className="card bg-white/80 border border-blue-100 shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-200 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer group"
            >
              <span className="material-icons text-blue-500 text-4xl mb-2 group-hover:text-blue-700 transition-colors">
                leaderboard
              </span>
              <h2 className="card-title text-xl font-bold text-blue-700 group-hover:text-blue-900">
                Global Leaderboard
              </h2>
              <p className="text-gray-600 text-center text-base">
                View overall rankings
              </p>
            </Link>
          </div>
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
