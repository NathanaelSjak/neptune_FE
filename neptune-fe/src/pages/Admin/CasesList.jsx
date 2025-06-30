import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link } from "react-router-dom";

const classCases = [
  { id: 1, name: "Array Manipulation", class: "Class A", submissions: 12 },
  { id: 2, name: "String Parsing", class: "Class A", submissions: 8 },
  { id: 3, name: "Graph Traversal", class: "Class A", submissions: 5 },
];

const Cases = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] flex flex-col items-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-2 py-8">
        <div className="bg-white/95 shadow-2xl rounded-2xl p-0 w-full max-w-3xl flex flex-col gap-0 border border-blue-100">
          {/* Card Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-blue-100 rounded-t-2xl bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center gap-3">
              <span className="material-icons text-blue-500 text-3xl">
                folder_open
              </span>
              <h2 className="text-2xl font-bold text-blue-700">
                Class-Specific Cases
              </h2>
            </div>
            <button className="btn btn-primary btn-sm">+ Add Case</button>
          </div>
          <div className="px-8 py-6 flex flex-col gap-6">
            <div className="overflow-x-auto rounded-xl border border-blue-100 bg-white/90">
              <table className="table w-full">
                <thead>
                  <tr className="bg-blue-50 text-blue-700">
                    <th>Case Name</th>
                    <th>Class</th>
                    <th>Submissions</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classCases.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center text-gray-400 py-8"
                      >
                        No cases available.
                      </td>
                    </tr>
                  ) : (
                    classCases.map((c) => (
                      <tr key={c.id} className="hover:bg-blue-50">
                        <td className="font-semibold text-blue-700">
                          {c.name}
                        </td>
                        <td>{c.class}</td>
                        <td>{c.submissions}</td>
                        <td>
                          <Link
                            to="/case-submission"
                            className="btn btn-xs btn-outline btn-info mr-2"
                          >
                            View
                          </Link>
                          <button className="btn btn-xs btn-outline btn-warning">
                            Edit
                          </button>
                        </td>
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

export default Cases;
