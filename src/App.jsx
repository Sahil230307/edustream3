
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import WebinarList from "./pages/WebinarList";
import WebinarDetails from "./pages/WebinarDetails";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthLanding from "./pages/AuthLanding";
import CreateWebinar from "./pages/CreateWebinar";
import PastWebinars from "./pages/PastWebinars";
import Submission from "./pages/Submission";

import defaultWebinars from "./data/webinars";

function App() {

  const [user, setUser] = useState(null);
  const [webinars, setWebinars] = useState([]);
  const [registered, setRegistered] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedWebinars = JSON.parse(localStorage.getItem("webinars"));
    const storedRegistered = JSON.parse(localStorage.getItem("registered"));

    if (storedUser) setUser(storedUser);
    if (storedWebinars) setWebinars(storedWebinars);
    else setWebinars(defaultWebinars);
    if (storedRegistered) setRegistered(storedRegistered);
  }, []);

  // Save webinars
  useEffect(() => {
    localStorage.setItem("webinars", JSON.stringify(webinars));
  }, [webinars]);

  // Save registered
  useEffect(() => {
    localStorage.setItem("registered", JSON.stringify(registered));
  }, [registered]);

  return (
    <BrowserRouter>

      <Navbar user={user} setUser={setUser} />

      <Routes>

        {/* Public Routes */}
        <Route
          path="/"
          element={
            user && user.isLoggedIn ? (
              <Home webinars={webinars} />
            ) : (
              <AuthLanding setUser={setUser} />
            )
          }
        />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />

        <Route 
          path="/webinars" 
          element={<WebinarList webinars={webinars} />} 
        />

        <Route 
          path="/webinar/:id" 
          element={
            <WebinarDetails 
              webinars={webinars}
              registered={registered}
              setRegistered={setRegistered}
              user={user}
            />
          } 
        />

        {/* User Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute user={user} role="user">
              <Dashboard 
                webinars={webinars} 
                registered={registered} 
              />
            </ProtectedRoute>
          } 
        />

        {/* Submission Page (user only) */}
        <Route
          path="/submission"
          element={
            <ProtectedRoute user={user} role="user">
              <Submission />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route 
          path="/admin"
          element={
            <ProtectedRoute user={user} role="admin">
              <AdminDashboard 
                webinars={webinars}
                setWebinars={setWebinars}
              />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/admin/create"
          element={
            <ProtectedRoute user={user} role="admin">
              <CreateWebinar 
                webinars={webinars}
                setWebinars={setWebinars}
              />
            </ProtectedRoute>
          }
        />

        {/* Past Webinars Page */}
        <Route 
          path="/past-webinars"
          element={<PastWebinars />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;