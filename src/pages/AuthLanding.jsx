import React, { useState, useEffect } from "react";
import Login from "./Login";
import Signup from "./Signup";

export default function AuthLanding({ setUser }) {
  const [view, setView] = useState("choice"); // 'choice' | 'login' | 'signup'

  useEffect(() => {
    document.title = "Sign in — edustream";
  }, []);

  return (
    <div className="auth-container">
      <div style={{ width: 760 }}>
        {view === "choice" ? (
          <div className="card glass-panel-dark" style={{ padding: 40, textAlign: "center" }}>
            <div style={{maxWidth:640,margin:'0 auto'}}>
              <h2 style={{ margin: 0, fontSize: 28 }}>Welcome to EduStream</h2>
              <div className="muted" style={{ marginTop: 8 }}>Join or sign in to access webinars</div>

              <div className="landing-actions" style={{ marginTop: 20 }}>
                <button className="btn primary" onClick={() => setView("login")}>Login</button>
                <button className="btn ghost" onClick={() => setView("signup")}>Signup</button>
              </div>

              <div className="landing-empty" style={{ marginTop: 28 }}>
                <div className="landing-placeholder single" />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
              <button className="btn ghost" onClick={() => setView("choice")}>Back</button>
            </div>

            {view === "login" ? (
              <Login setUser={setUser} />
            ) : (
              <Signup setUser={setUser} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
