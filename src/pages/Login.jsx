import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import Toast from "../components/Toast";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  // Auto-login if already stored
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.isLoggedIn) {
      setUser(storedUser);
      if (storedUser.role === "admin") navigate("/admin");
      else navigate("/dashboard");
    }
  }, [navigate, setUser]);

  const handleLogin = () => {
    if (!email.trim()) {
      setToast({ message: "Please enter your email", type: "error" });
      return;
    }
    if (!password.trim()) {
      setToast({ message: "Please enter your password", type: "error" });
      return;
    }
    // Look up user in the `users` list stored in localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const found = users.find((u) => u.email === email);

    if (!found) {
      setToast({ message: "No account found for this email. Please signup.", type: "error" });
      return;
    }

    if (found.password !== password) {
      setToast({ message: "Incorrect password. Please try again.", type: "error" });
      return;
    }

    // Successful login: create active session under `user`
    const session = { ...found, isLoggedIn: true };
    localStorage.setItem("user", JSON.stringify(session));
    setUser(session);

    if (session.role === "admin") navigate("/admin");
    else navigate("/dashboard");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Login</h2>
          <div className="auth-sub">Sign in to continue to your dashboard</div>
        </div>

        <div className="auth-form">
          <input
            className="auth-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <PasswordInput
            inputClassName="auth-input"
            toggleClassName="auth-toggle"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <select
            className="auth-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <div className="auth-actions">
            <button className="auth-button auth-primary" onClick={handleLogin}>
              Login
            </button>
            <div className="muted">Forgot password?</div>
          </div>
        </div>
      </div>
      <div className="toast-container">
        <Toast
          message={toast?.message}
          type={toast?.type}
          onClose={() => setToast(null)}
        />
      </div>
    </div>
  );
}