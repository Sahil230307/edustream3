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
import UserProfile from "./pages/UserProfile";
import Wishlist from "./pages/Wishlist";

function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem("darkMode")) || false;
  });

  // Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  // Save dark mode
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));

    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Navbar
        user={user}
        setUser={setUser}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            user && user.isLoggedIn ? (
              <Home />
            ) : (
              <AuthLanding setUser={setUser} />
            )
          }
        />

        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />

        <Route
          path="/webinars"
          element={<WebinarList user={user} />}
        />

        <Route
          path="/webinar/:id"
          element={<WebinarDetails user={user} />}
        />

        {/* User Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user} role="user">
              <Dashboard user={user} />
            </ProtectedRoute>
          }
        />

        {/* User Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user} role="user">
              <UserProfile user={user} setUser={setUser} />
            </ProtectedRoute>
          }
        />

        {/* Wishlist */}
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute user={user} role="user">
              <Wishlist user={user} />
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
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/create"
          element={
            <ProtectedRoute user={user} role="admin">
              <CreateWebinar />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/edit/:id"
          element={
            <ProtectedRoute user={user} role="admin">
              <CreateWebinar />
            </ProtectedRoute>
          }
        />

        {/* Past Webinars Page */}
        <Route path="/past-webinars" element={<PastWebinars />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;