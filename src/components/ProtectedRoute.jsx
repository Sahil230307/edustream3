import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ user, children, role }) {
  // If not logged in, redirect to landing
  if (!user || !user.isLoggedIn) return <Navigate to="/" />;

  // If a role is specified, enforce it.
  // Allow admins to access user pages (i.e., role 'user').
  if (role) {
    if (role === "user") {
      if (user.role !== "user" && user.role !== "admin") {
        return <Navigate to="/" />;
      }
    } else {
      if (user.role !== role) return <Navigate to="/" />;
    }
  }

  return children;
}