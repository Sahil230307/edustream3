import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import Toast from "../components/Toast";
import { registerUser } from "../services/api";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      setToast({ message: "Please fill all fields", type: "error" });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setToast({ message: "Please enter a valid email", type: "error" });
      return;
    }

    // Password length validation
    if (password.length < 6) {
      setToast({ message: "Password must be at least 6 characters", type: "error" });
      return;
    }

    try {
      const res = await registerUser({
        name,
        email,
        password,
        role,
      });

      if (res.data.message === "User registered successfully") {
        setToast({
          message: `Account created successfully as ${role}. Please login.`,
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
      let errorMessage = "Server error. Please try again.";
      
      if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || "Invalid input provided";
      } else if (error.response?.status === 409) {
        errorMessage = "Email already registered";
      } else if (error.message === "Network Error") {
        errorMessage = "Cannot connect to server";
      }
      
      setToast({ message: errorMessage, type: "error" });
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
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>

          <div className="auth-actions">
            <button className="auth-button auth-primary" type="submit">
              Signup
            </button>
            <div className="muted">Already have an account? Login</div>
          </div>
        </form>

        <div className="toast-container">
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}