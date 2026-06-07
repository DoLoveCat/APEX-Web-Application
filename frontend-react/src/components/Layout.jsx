import React from "react";

import { NavLink, Outlet } from "react-router-dom";

import { SavedCoursesProvider } from "../context/SavedCoursesContext";

import apexLogo from "../assets/apex_logo.png";

export default function Layout({ user, logoutUser }) {
  const linkClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

  return (
    <SavedCoursesProvider>
      <nav className="navbar">
        <div className="nav-left">
          <NavLink to="/" className="brand">
            <img src={apexLogo} alt="APEX" className="brand-logo" />
          </NavLink>

          <div className="nav-links">
            <NavLink to="/" end className={linkClass}>Home</NavLink>
            <NavLink to="/browse" className={linkClass}>Browse</NavLink>
            <NavLink to="/my-courses" className={linkClass}>My Courses</NavLink>
            <NavLink to="/chat" className={linkClass}>Chat</NavLink>
            <NavLink to="/network" className={linkClass}>Network</NavLink>
          </div>
        </div>

        <div className="nav-user">
          <span>Welcome {user?.name}</span>
          <button className="logout-btn" onClick={logoutUser}>Logout</button>
        </div>
      </nav>

      <main className="page">
        <Outlet />
      </main>
    </SavedCoursesProvider>
  );
}
