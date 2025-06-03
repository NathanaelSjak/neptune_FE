import React from "react";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-400 to-blue-600 relative overflow-hidden">
      {/* Animated background lines (optional, can be added later) */}
      <div className="z-10 w-full flex flex-col items-center">
        <div className="bg-white shadow-xl rounded-lg p-8 w-80 flex flex-col items-center">
          {/* Logo Placeholder */}
          <div className="mb-6">
            <div className="w-24 h-12 mx-auto mb-2 flex items-center justify-center">
              {/* Replace with <img src="/path/to/logo.png" alt="Logo" /> */}
              <span className="font-bold text-blue-700 text-lg">LOGO</span>
            </div>
            <div className="text-center text-xs text-gray-500 font-semibold leading-tight">
              BINUS
              <br />
              UNIVERSITY
              <br />
              Software Laboratory Center
            </div>
          </div>
          {/* Login Form */}
          <form className="w-full flex flex-col gap-4">
            <label className="input input-bordered flex items-center gap-2">
              <span className="material-icons text-blue-500">person</span>
              <input type="text" className="grow" placeholder="Username" />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span className="material-icons text-blue-500">lock</span>
              <input type="password" className="grow" placeholder="Password" />
            </label>
            <button type="submit" className="btn btn-primary w-full mt-2">
              Login
            </button>
          </form>
        </div>
      </div>
      {/* Footer */}
      <footer className="absolute bottom-8 left-0 right-0 text-center text-white text-sm z-20">
        LF & XY
        <br />
        Software Laboratory Center
        <br />
        <a href="mailto:academic.slc@binus.edu" className="underline">
          academic.slc@binus.edu
        </a>
      </footer>
      {/* Google Fonts for Material Icons */}
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />
    </div>
  );
};

export default Login;
