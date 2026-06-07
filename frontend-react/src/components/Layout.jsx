import React from "react";

import { NavLink, Outlet } from "react-router-dom";

import { SavedCoursesProvider } from "../context/SavedCoursesContext";
import ProfileCard from "./ProfileCard";

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
            <NavLink to="/network" className={linkClass}>Network</NavLink>
            <NavLink to="/messages" className={linkClass}>Messages</NavLink>
          </div>
        </div>

        <div className="nav-user">
          <button className="logout-btn" onClick={logoutUser}>Logout</button>
        </div>
      </nav>

      <div className="app-shell">
        <main className="page">
          <Outlet />
        </main>

        <aside className="sidebar">
          <ProfileCard user={user} />
        </aside>
      </div>
    </SavedCoursesProvider>
  );
}
