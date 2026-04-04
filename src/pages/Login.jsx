import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import Toast from "../components/Toast";
import { loginUser } from "../services/api";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.isLoggedIn) {
      setUser(storedUser);
      if (storedUser.role?.toUpperCase() === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
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
      const res = await loginUser({
        email,
        password,
        role,
      });

      if (res.data && res.data.id) {
        const backendRole = res.data.role?.toUpperCase();
        const selectedRole = role.toUpperCase();

        if (backendRole !== selectedRole) {
          setToast({
            message: `This account is registered as ${backendRole}, not ${selectedRole}`,
            type: "error",
          });
          return;
        }

        const session = {
          ...res.data,
          role: backendRole,
          isLoggedIn: true,
        };

        localStorage.setItem("user", JSON.stringify(session));
        setUser(session);

        setToast({ message: "Login successful!", type: "success" });

        setTimeout(() => {
          if (session.role === "ADMIN") {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
        }, 800);
      } else {
        setToast({
          message: res.data.message || "Invalid email or password",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Login Error:", error);
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
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
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
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}