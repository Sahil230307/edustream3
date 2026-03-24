import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import Toast from "../components/Toast";
import { authAPI, setToken } from "../services/api";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  // Auto-login if already stored
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      setUser(storedUser);
      if (storedUser.role === "admin") navigate("/admin");
      else navigate("/dashboard");
    }
  }, [navigate, setUser]);

  const handleLogin = async () => {
    if (!email.trim()) {
      setToast({ message: "Please enter your email", type: "error" });
      return;
    }
    if (!password.trim()) {
      setToast({ message: "Please enter your password", type: "error" });
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.login({ email, password });
      
      // Store token and user info
      setToken(response.token);
      const userData = { ...response.user, isLoggedIn: true };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      if (userData.role === "admin") navigate("/admin");
      else navigate("/dashboard");
    } catch (error) {
      setToast({ message: error.message || "Login failed. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
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

          <div className="auth-actions">
            <button 
              className="auth-button auth-primary" 
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
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