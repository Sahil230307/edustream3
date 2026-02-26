import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import Toast from "../components/Toast";

export default function Signup({ setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      setToast({ message: "Please fill all fields", type: "error" });
      return;
    }

    // Ensure users list exists in localStorage
    const stored = JSON.parse(localStorage.getItem("users")) || [];

    // Prevent duplicate emails
    if (stored.find((u) => u.email === email)) {
      setToast({ message: "An account with this email already exists. Please login.", type: "error" });
      navigate("/login");
      return;
    }

    const newUser = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      email,
      role,
      // Note: storing plaintext passwords is only for demo purposes
      password,
    };

    stored.push(newUser);
    localStorage.setItem("users", JSON.stringify(stored));

    // Redirect to login so user can authenticate
    setToast({ message: "Account created — please login.", type: "success" });
    setTimeout(() => navigate("/login"), 900);
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
            <button className="auth-button auth-primary" type="submit">
              Signup
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