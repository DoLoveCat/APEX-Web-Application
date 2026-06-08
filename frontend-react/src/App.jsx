import { useEffect, useState } from "react";

import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import MyCourses from "./pages/MyCourses";
import ChatRoom from "./pages/ChatRoom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Network from "./pages/Network";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import Messages from "./pages/Messages";

import AdminLayout from "./components/AdminLayout";
import AdminCourses from "./pages/AdminCourses";
import AdminUsers from "./pages/AdminUsers";

import apexLogo from "./assets/apex_logo.png";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function checkAuth() {
  const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    const response = await fetch(
      "http://localhost:5001/api/auth/me",
      {
        headers: { 'Authorization': 'Bearer ' + token }
      }
    );
    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
    }
    setLoading(false);
  }

  async function logoutUser() {
    localStorage.removeItem('token');
    setUser(null);
  }

  useEffect(() => {
      checkAuth();
  }, []);

  if (loading)
    return (
      <div className="app-loading">
        <img src={apexLogo} alt="APEX" className="app-loading-logo" />
        <div className="spinner" />
      </div>
    );

  return (
    <Routes>
      <Route path="/login" element={<Login setUser={setUser}/>} />
      <Route path="/register" element={<Register/>} />
 
      {/* ADMIN ROUTES */}
      <Route path="/admin" element={user?.role === 'admin'
        ? <AdminLayout user={user} logoutUser={logoutUser}/>
        : <Navigate to="/login"/>
      }>
        <Route index element={<AdminCourses/>} />
        <Route path="users" element={<AdminUsers/>} />
      </Route>

      {/* STUDENT ROUTES */}
      <Route path="/" element={user
        ? user.role === 'admin'
          ? <Navigate to="/admin" />
          : <Layout user={user} logoutUser={logoutUser} />
        : <Navigate to="/login" />
      }>
        <Route index element={<Home user={user}/>} />
        <Route path="browse" element={<Browse/>} />
        <Route path="my-courses" element={<MyCourses/>} />
        <Route path="chat/:roomId" element={<ChatRoom/>} />
        <Route path="messages" element={<Messages/>} />
        <Route path="network" element={<Network/>} />
        <Route path="profile" element={<Profile user={user} setUser={setUser}/>} />
        <Route path="profile/:id" element={<PublicProfile/>} />
      </Route>
    </Routes>
  );
}

export default App;