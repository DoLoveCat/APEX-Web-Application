import { useEffect, useState } from "react";

import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Network from "./pages/Network";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function checkAuth() {
    const response = await fetch(
        "http://localhost:5000/api/auth/me",
        {
          credentials: "include"
        }
      );
    if (response.ok) {
      const data = await response.json();
      console.log("Auth check:", data);
      setUser(data.user);
    }
    setLoading(false);
  }

  async function logoutUser() {
    const response = await fetch(
        "http://localhost:5000/api/auth/logout",
        {
            method: "POST",
            credentials: "include"
        }
    );

      const data = await response.json();

      alert(data.message);

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
        <Route index element={<Home/>} />
        <Route path="browse" element={<Browse/>} />
        <Route path="network" element={<Network/>} />
      </Route>
    </Routes>
  );
}

export default App;