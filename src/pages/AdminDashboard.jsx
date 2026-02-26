import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ASSIGNMENTS_KEY = "edustream_assignments";
const SUBMISSIONS_KEY = "edustream_submissions";

export default function AdminDashboard({ webinars, setWebinars }) {

  const [search, setSearch] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [due, setDue] = useState("");
  const [submissionsCount, setSubmissionsCount] = useState(0);

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

  return (
    <div style={{ padding: "60px" }}>

      <h2 style={{ marginBottom: "30px" }}>
        Admin Dashboard
      </h2>

      {/* Create Section */}
      <div style={{
        background: "white",
        padding: "25px",
        borderRadius: "10px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        marginBottom: "40px",
        maxWidth: "500px"
      }}>
        <h3>Create New Webinar</h3>
        <p style={{ margin: "10px 0 20px 0" }}>
          Add new webinars to the platform.
        </p>

        <Link to="/admin/create">
          <button style={{
            background: "#4f46e5",
            color: "white",
            padding: "10px 18px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer"
          }}>
            + Create Webinar
          </button>
        </Link>
      </div>
      
      {/* Assignments Section */}
      <div style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
        marginBottom: "30px",
        maxWidth: "700px"
      }}>
        <h3>Assignments</h3>
        <p style={{ marginTop: 6 }}>Create assignments for users to submit files.</p>

        <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "flex-start" }}>
          <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} style={{padding: 8, flex: 1}} />
          <input placeholder="Due date" type="date" value={due} onChange={(e) => setDue(e.target.value)} style={{padding: 8}} />
        </div>
        <textarea placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} style={{ width: "100%", marginTop: 8, padding: 8 }} />
        <div style={{ marginTop: 10 }}>
          <button onClick={() => {
            if (!title) return alert("Please enter a title");
            const a = { id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`, title, description: desc, due };
            const updated = [a, ...assignments];
            setAssignments(updated);
            setTitle(""); setDesc(""); setDue("");
          }} style={{ background: "#2563eb", color: "white", padding: "8px 12px", borderRadius: 6, border: "none" }}>
            + Add Assignment
          </button>
        </div>

        {assignments.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <h4>Existing Assignments</h4>
            <ul style={{ paddingLeft: 16 }}>
              {assignments.map((a) => (
                <li key={a.id} style={{ marginBottom: 8 }}>
                  <strong>{a.title}</strong> {a.due && <span>• due {a.due}</span>}<div style={{ fontSize: 13, color: '#444' }}>{a.description}</div>
                  <div style={{ marginTop: 6 }}>
                    <button onClick={() => {
                      if (!confirm('Delete assignment?')) return;
                      setAssignments(assignments.filter(x => x.id !== a.id));
                    }} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 10px', borderRadius: 6 }}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Submissions Summary for Admin */}
      <div style={{
        background: "white",
        padding: "18px",
        borderRadius: "10px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
        marginBottom: "30px",
        maxWidth: "500px"
      }}>
        <h3>Submissions</h3>
        <p style={{ marginTop: 6 }}>Total submissions: <strong>{submissionsCount}</strong></p>
        <Link to="/submission">
          <button style={{ background: '#0ea5a0', color: 'white', padding: '8px 12px', borderRadius: 6, border: 'none' }}>View Submissions</button>
        </Link>
      </div>

      {/* Search */}
      <div style={{ marginBottom: "25px" }}>
        <input
          type="text"
          placeholder="Search webinar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />
      </div>

      {/* Webinar List */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "20px"
      }}>

        {filteredWebinars.length > 0 ? (
          filteredWebinars.map((webinar) => (
            <div key={webinar.id} style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.05)"
            }}>
              <h3>{webinar.title}</h3>
              <p><strong>Date:</strong> {webinar.date}</p>
              <p style={{ margin: "10px 0" }}>
                {webinar.description.substring(0, 80)}...
              </p>

              <div style={{
                display: "flex",
                gap: "10px",
                marginTop: "10px"
              }}>

                <Link to={`/webinar/${webinar.id}`}>
                  <button style={{
                    background: "#10b981",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer"
                  }}>
                    View
                  </button>
                </Link>

                <Link to={`/admin/edit/${webinar.id}`}>
                  <button style={{
                    background: "#f59e0b",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer"
                  }}>
                    Edit
                  </button>
                </Link>

                <button
                  onClick={() => handleDelete(webinar.id)}
                  style={{
                    background: "#ef4444",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>

              </div>
            </div>
          ))
        ) : (
          <p>No webinars found.</p>
        )}

      </div>

    </div>
  );
}