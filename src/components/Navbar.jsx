import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ user, setUser, darkMode, setDarkMode }) {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="logo-section">
        <h1 className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          🎓 EduStream
        </h1>
      </div>

      <div className="nav-links">
        {user ? (
          <>
            <div className="nav-left">
              <NavLink to="/" className={({isActive}) => "nav-link" + (isActive? " active" : "")}>Home</NavLink>
              <NavLink to="/webinars" className={({isActive}) => "nav-link" + (isActive? " active" : "")}>Webinars</NavLink>
              <NavLink to="/past-webinars" className={({isActive}) => "nav-link" + (isActive? " active" : "")}>Past Webinars</NavLink>
              {user.role === "user" && <NavLink to="/dashboard" className={({isActive}) => "nav-link" + (isActive? " active" : "")}>My Dashboard</NavLink>}
              {user.role === "user" && <NavLink to="/wishlist" className={({isActive}) => "nav-link" + (isActive? " active" : "")}>❤️ Wishlist</NavLink>}
              <NavLink to="/submission" className={({isActive}) => "nav-link" + (isActive? " active" : "")}>Submission</NavLink>
              {user.role === "admin" && <NavLink to="/admin" className={({isActive}) => "nav-link" + (isActive? " active" : "")}>Admin Panel</NavLink>}
            </div>

            <div className="user-section">
              <button 
                className="dark-mode-btn"
                title="Toggle Dark Mode"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <div className="user-menu">
                <div className="user-email">{user.email}</div>
                <div className="user-role">{user.role}</div>
                <NavLink to="/profile" className="profile-link">👤 Profile</NavLink>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            </div>
          </>
        ) : (
          <div className="nav-left">
            <button 
              className="dark-mode-btn"
              title="Toggle Dark Mode"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <NavLink to="/login" className="auth-btn login-btn">Login</NavLink>
            <NavLink to="/signup" className="auth-btn signup-btn">Sign Up</NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}