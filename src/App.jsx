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

import { webinarAPI } from "./services/api";

function App() {

  const [user, setUser] = useState(null);
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem("darkMode")) || false;
  });

  // Load user and webinars
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);

    // Fetch webinars from backend
    const fetchWebinars = async () => {
      try {
        const data = await webinarAPI.getAll();
        setWebinars(data);
      } catch (error) {
        console.error("Failed to load webinars:", error);
        // If API fails, use empty array (can load demo data as fallback)
        setWebinars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWebinars();
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

      <Navbar user={user} setUser={setUser} darkMode={darkMode} setDarkMode={setDarkMode} />

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
          element={<WebinarList webinars={webinars} user={user} />} 
        />

        <Route 
          path="/webinar/:id" 
          element={
            <WebinarDetails 
              webinars={webinars}
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
                user={user}
              />
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

        <Route 
          path="/admin/edit/:id"
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