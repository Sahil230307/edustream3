import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ user, setUser, darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const userRole = user?.role?.toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo-section">
        <h1
          className="logo"
          onClick={() => navigate(userRole === "ADMIN" ? "/admin" : "/")}
          style={{ cursor: "pointer" }}
        >
          🎓 EduStream
        </h1>
      </div>

      <div className="nav-links">
        {user?.isLoggedIn ? (
          <div className="nav-left">
            {/* USER NAVBAR */}
            {userRole === "USER" && (
              <>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " active" : "")
                  }
                >
                  Home
                </NavLink>

                <NavLink
                  to="/webinars"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " active" : "")
                  }
                >
                  Webinars
                </NavLink>

                <NavLink
                  to="/past-webinars"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " active" : "")
                  }
                >
                  Past Webinars
                </NavLink>

                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " active" : "")
                  }
                >
                  My Dashboard
                </NavLink>

                <NavLink
                  to="/wishlist"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " active" : "")
                  }
                >
                  ❤️ Wishlist
                </NavLink>

                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " active" : "")
                  }
                >
                  👤 Profile
                </NavLink>
              </>
            )}

            {/* ADMIN NAVBAR */}
            {userRole === "ADMIN" && (
              <>
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " active" : "")
                  }
                >
                  Admin Dashboard
                </NavLink>

                <NavLink
                  to="/admin/create"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " active" : "")
                  }
                >
                  + Create Webinar
                </NavLink>

                <NavLink
                  to="/webinars"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " active" : "")
                  }
                >
                  View Webinars
                </NavLink>
              </>
            )}
          </div>
        ) : (
          <div className="nav-left">
            <button
              className="dark-mode-btn"
              title="Toggle Dark Mode"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            <NavLink to="/login" className="auth-btn login-btn">
              Login
            </NavLink>

            <NavLink to="/signup" className="auth-btn signup-btn">
              Sign Up
            </NavLink>
          </div>
        )}
      </div>

      {user?.isLoggedIn && (
        <div className="user-section">
          <button
            className="dark-mode-btn"
            title="Toggle Dark Mode"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <div className="user-menu">
            <div className="user-email">{user.email}</div>
            <div className="user-role">{userRole}</div>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}