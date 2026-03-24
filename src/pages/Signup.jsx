import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import Toast from "../components/Toast";
import { authAPI, setToken } from "../services/api";

export default function Signup({ setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      setToast({ message: "Please fill all fields", type: "error" });
      return;
    }

    try {
      setLoading(true);
      await authAPI.signup({ name, email, password, role });

      // After signup, auto-login
      const loginResponse = await authAPI.login({ email, password });
      setToken(loginResponse.token);
      
      const userData = { ...loginResponse.user, isLoggedIn: true };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      setToast({ message: "Account created successfully!", type: "success" });
      
      if (userData.role === "admin") {
        setTimeout(() => navigate("/admin"), 500);
      } else {
        setTimeout(() => navigate("/dashboard"), 500);
      }
    } catch (error) {
      setToast({ message: error.message || "Signup failed. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Signup</h2>
          <div className="auth-sub">Create an account to get started</div>
        </div>

        <form className="auth-form" onSubmit={handleSignup}>
          <input
            className="auth-input"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            className="auth-input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
            <button 
              className="auth-button auth-primary" 
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Signup"}
            </button>
            <div className="muted">Already have an account? Login</div>
          </div>
        </form>
        <div className="toast-container">
          <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
        </div>
      </div>
    </div>
  );
}