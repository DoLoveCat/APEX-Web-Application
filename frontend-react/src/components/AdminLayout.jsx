import React from "react";

import { NavLink, Outlet } from "react-router-dom";

import apexLogo from "../assets/apex_logo.png";

export default function Layout({ user, logoutUser }) {
  const linkClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

  return (
    <div>
      <nav className="navbar">
        <div className="nav-left">
          <NavLink to="/admin" className="brand">
            <img src={apexLogo} alt="APEX" className="brand-logo" />
          </NavLink>

          <div className="nav-links">
            <NavLink to="/admin" end className={linkClass}>Courses</NavLink>
            <NavLink to="/admin/users" className={linkClass}>Users</NavLink>
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
      </div>
    </div>
  );
}
