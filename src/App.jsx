import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import WebinarList from "./pages/WebinarList";
import WebinarDetails from "./pages/WebinarDetails";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
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

  // Load user from localStorage on refresh
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.isLoggedIn) {
      setUser({
        ...storedUser,
        role: storedUser.role?.toUpperCase(),
      });
    }
  }, []);

  // Save dark mode preference
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
              <Home user={user} />
            ) : (
              <AuthLanding setUser={setUser} />
            )
          }
        />

        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />

        <Route path="/webinars" element={<WebinarList user={user} />} />
        <Route path="/webinar/:id" element={<WebinarDetails user={user} />} />
        <Route path="/past-webinars" element={<PastWebinars user={user} />} />

        {/* USER ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user} role="USER">
              <Dashboard user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user} role="USER">
              <UserProfile user={user} setUser={setUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute user={user} role="USER">
              <Wishlist user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/submission"
          element={
            <ProtectedRoute user={user} role="USER">
              <Submission />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user} role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/create"
          element={
            <ProtectedRoute user={user} role="ADMIN">
              <CreateWebinar />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/edit/:id"
          element={
            <ProtectedRoute user={user} role="ADMIN">
              <CreateWebinar />
            </ProtectedRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;