import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

const ASSIGNMENTS_KEY = "edustream_assignments";
const SUBMISSIONS_KEY = "edustream_submissions";
const REGISTERED_KEY = "registered";

export default function AdminDashboard({ webinars, setWebinars }) {

  const [search, setSearch] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [due, setDue] = useState("");
  const [submissionsCount, setSubmissionsCount] = useState(0);
  const [registered, setRegistered] = useState([]);
  const [activeTab, setActiveTab] = useState("analytics");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ASSIGNMENTS_KEY);
      if (raw) setAssignments(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to load assignments:", e);
    }

    try {
      const subs = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || "[]");
      setSubmissionsCount(subs.length || 0);
    } catch (e) { console.error(e); }

    try {
      const reg = JSON.parse(localStorage.getItem(REGISTERED_KEY) || "[]");
      setRegistered(reg);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments));
  }, [assignments]);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this webinar?");
    if (confirmDelete) {
      const updated = webinars.filter((webinar) => webinar.id !== id);
      setWebinars(updated);
    }
  };

  const filteredWebinars = webinars.filter((webinar) =>
    webinar.title.toLowerCase().includes(search.toLowerCase())
  );

  // Analytics calculations
  const totalWebinars = webinars.length;
  const totalRegistrations = registered.length;
  const avgCapacityUsage = webinars.length > 0 
    ? Math.round((webinars.reduce((sum, w) => sum + (w.registeredCount / w.maxCapacity), 0) / webinars.length) * 100)
    : 0;
  
  const categoryCounts = {};
  webinars.forEach(w => {
    categoryCounts[w.category] = (categoryCounts[w.category] || 0) + 1;
  });

  const topWebinars = [...webinars]
    .sort((a, b) => b.registeredCount - a.registeredCount)
    .slice(0, 5);

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage webinars, content, and track analytics</p>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === "analytics" ? "active" : ""}`}
          onClick={() => setActiveTab("analytics")}
        >
          📊 Analytics
        </button>
        <button 
          className={`tab-btn ${activeTab === "webinars" ? "active" : ""}`}
          onClick={() => setActiveTab("webinars")}
        >
          🎓 Webinars
        </button>
        <button 
          className={`tab-btn ${activeTab === "assignments" ? "active" : ""}`}
          onClick={() => setActiveTab("assignments")}
        >
          📝 Assignments
        </button>
      </div>

      {/* ANALYTICS TAB */}
      {activeTab === "analytics" && (
        <div className="tab-content">
          <div className="analytics-grid">
            <div className="stat-card">
              <div className="stat-icon">🎓</div>
              <div className="stat-content">
                <div className="stat-value">{totalWebinars}</div>
                <div className="stat-label">Total Webinars</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <div className="stat-value">{totalRegistrations}</div>
                <div className="stat-label">Total Registrations</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <div className="stat-value">{avgCapacityUsage}%</div>
                <div className="stat-label">Avg Capacity Usage</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-value">{submissionsCount}</div>
                <div className="stat-label">Total Submissions</div>
              </div>
            </div>
          </div>

          <div className="analytics-content">
            <div className="analytics-section">
              <h2>Webinars by Category</h2>
              <div className="category-list">
                {Object.entries(categoryCounts).map(([category, count]) => (
                  <div key={category} className="category-item">
                    <span className="category-name">{category}</span>
                    <div className="category-bar">
                      <div 
                        className="category-fill"
                        style={{ width: `${(count / totalWebinars) * 100}%` }}
                      />
                    </div>
                    <span className="category-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="analytics-section">
              <h2>Top Webinars by Registration</h2>
              <div className="top-webinars-list">
                {topWebinars.map((webinar, index) => (
                  <div key={webinar.id} className="top-webinar-item">
                    <span className="rank">#{index + 1}</span>
                    <div className="webinar-info">
                      <h4>{webinar.title}</h4>
                      <p>{webinar.category}</p>
                    </div>
                    <span className="registration-count">
                      {webinar.registeredCount}/{webinar.maxCapacity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WEBINARS TAB */}
      {activeTab === "webinars" && (
        <div className="tab-content">
          <div className="webinar-management">
            <div className="management-header">
              <Link to="/admin/create">
                <button className="btn-primary">+ Create New Webinar</button>
              </Link>
              <input
                type="text"
                placeholder="Search webinar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="webinar-grid">
              {filteredWebinars.length > 0 ? (
                filteredWebinars.map((webinar) => (
                  <div key={webinar.id} className="webinar-card">
                    <div className="webinar-image">
                      <img src={webinar.imageUrl} alt={webinar.title} />
                      <span className="difficulty-badge">{webinar.difficulty}</span>
                    </div>
                    <div className="webinar-details">
                      <h3>{webinar.title}</h3>
                      <p className="speaker">By {webinar.speaker}</p>
                      <p className="date">📅 {webinar.date}</p>
                      <div className="capacity-info">
                        <span>Registered: {webinar.registeredCount}/{webinar.maxCapacity}</span>
                        <div className="capacity-bar">
                          <div 
                            className="capacity-fill"
                            style={{ width: `${(webinar.registeredCount / webinar.maxCapacity) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="card-actions">
                        <Link to={`/webinar/${webinar.id}`}>
                          <button className="btn-view">View</button>
                        </Link>
                        <Link to={`/admin/edit/${webinar.id}`}>
                          <button className="btn-edit">Edit</button>
                        </Link>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(webinar.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-results">No webinars found.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ASSIGNMENTS TAB */}
      {activeTab === "assignments" && (
        <div className="tab-content">
          <div className="assignments-section">
            <h2>Create Assignment</h2>
            <div className="assignment-form">
              <div className="form-row">
                <input 
                  placeholder="Assignment Title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className="form-input"
                />
                <input 
                  placeholder="Due Date" 
                  type="date" 
                  value={due} 
                  onChange={(e) => setDue(e.target.value)} 
                  className="form-input"
                />
              </div>
              <textarea 
                placeholder="Description" 
                value={desc} 
                onChange={(e) => setDesc(e.target.value)} 
                className="form-textarea"
                rows="4"
              />
              <button 
                onClick={() => {
                  if (!title) return alert("Please enter a title");
                  const a = { id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`, title, description: desc, due };
                  const updated = [a, ...assignments];
                  setAssignments(updated);
                  setTitle(""); setDesc(""); setDue("");
                }} 
                className="btn-primary"
              >
                + Add Assignment
              </button>
            </div>

            {assignments.length > 0 && (
              <div className="assignments-list">
                <h2>Existing Assignments</h2>
                {assignments.map((a) => (
                  <div key={a.id} className="assignment-item">
                    <div className="assignment-header">
                      <h4>{a.title}</h4>
                      {a.due && <span className="due-date">📅 Due: {a.due}</span>}
                    </div>
                    <p className="assignment-desc">{a.description}</p>
                    <button 
                      onClick={() => {
                        if (!confirm('Delete assignment?')) return;
                        setAssignments(assignments.filter(x => x.id !== a.id));
                      }} 
                      className="btn-delete-small"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="submissions-summary">
              <h2>Submissions</h2>
              <p>Total submissions: <strong>{submissionsCount}</strong></p>
              <Link to="/submission">
                <button className="btn-primary">View All Submissions</button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}