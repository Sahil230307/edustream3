import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import "./AuthLanding.css";

export default function AuthLanding({ setUser }) {
  const [view, setView] = useState("landing"); // 'landing' | 'login' | 'signup'

  useEffect(() => {
    document.title = "EduWebinar — Learn from Industry Experts";
  }, []);

  if (view === "login") {
    return (
      <div className="auth-container">
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8, width: 760 }}>
          <button className="btn ghost" onClick={() => setView("landing")}>Back</button>
        </div>
        <Login setUser={setUser} />
      </div>
    );
  }

  if (view === "signup") {
    return (
      <div className="auth-container">
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8, width: 760 }}>
          <button className="btn ghost" onClick={() => setView("landing")}>Back</button>
        </div>
        <Signup setUser={setUser} />
      </div>
    );
  }

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-wrapper">
          <div className="hero-content">
            <p className="hero-badge">✨ Transform Your Career Today ✨</p>
            <h1 className="hero-title">Learn from Industry<br />Experts Through<br />Interactive Webinars</h1>
            <p className="hero-description">
              Join thousands of learners worldwide. Access live sessions, expert instructors, and downloadable resources to master web development, design, and technology.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => setView("signup")}>Get Started Free</button>
              <button className="btn-secondary">▶ Watch Demo</button>
            </div>
          </div>
          <div className="hero-image-container">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=600&fit=crop"
              alt="Online Learning and Webinars"
              className="hero-image"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
