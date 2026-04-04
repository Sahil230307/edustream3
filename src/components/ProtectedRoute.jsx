import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ user, children, role }) {
  if (!user || !user.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user?.role?.toUpperCase();
  const requiredRole = role?.toUpperCase();

  // Strict role checking
  if (requiredRole && userRole !== requiredRole) {
    // Redirect based on actual logged-in role
    if (userRole === "ADMIN") {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}