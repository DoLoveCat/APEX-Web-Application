import React from "react";

import { Link, Outlet } from "react-router-dom";

export default function Layout({ user, logoutUser }) {
  return (
    <div className="nav">
        <Link to="/"> Home </Link> | 
        <Link to="/browse"> Browse </Link>
        <Link to="/network"> Network </Link>
        <span>Welcome {user?.name}</span>
        <button onClick={logoutUser}>Logout</button>
      <Outlet />
    </div>
  );
}
