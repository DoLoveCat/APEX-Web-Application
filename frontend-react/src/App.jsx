import { useEffect, useState } from "react";

import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import MyCourses from "./pages/MyCourses";
import ChatRooms from "./pages/ChatRooms";
import ChatRoom from "./pages/ChatRoom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Network from "./pages/Network";

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

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/login" element={<Login setUser={setUser}/>} />
      <Route path="/register" element={<Register/>} />

      <Route path="/" element={user ? <Layout user={user} logoutUser={logoutUser} /> : <Navigate to="/login" />}>
        <Route index element={<Home user={user}/>} />
        <Route path="browse" element={<Browse/>} />
        <Route path="my-courses" element={<MyCourses/>} />
        <Route path="chat" element={<ChatRooms/>} />
        <Route path="chat/:roomId" element={<ChatRoom/>} />
        <Route path="network" element={<Network/>} />
      </Route>
    </Routes>
  );
}

export default App;