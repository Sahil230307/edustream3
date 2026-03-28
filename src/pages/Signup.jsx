import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import Toast from "../components/Toast";
import { registerUser } from "../services/api";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      setToast({ message: "Please fill all fields", type: "error" });
      return;
    }

    try {
      const res = await registerUser({
        name,
        email,
        password,
        role: role.toUpperCase(), // backend expects USER / ADMIN
      });

      if (res.data.message === "User registered successfully") {
        setToast({
          message: "Account created successfully — please login.",
          type: "success",
        });

        setTimeout(() => navigate("/login"), 1000);
      } else {
        setToast({
          message: res.data.message || "Signup failed",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Signup Error:", error);

      setToast({
        message: "Server error. Please try again.",
        type: "error",
      });
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
            <button className="auth-button auth-primary" type="submit">
              Signup
            </button>
            <div className="muted">Already have an account? Login</div>
          </div>
        </form>

        <div className="toast-container">
          <Toast
            message={toast?.message}
            type={toast?.type}
            onClose={() => setToast(null)}
          />
        </div>
      </div>
    </div>
  );
}