import { useState } from "react";
import { Link } from "react-router-dom";

export default function WebinarList({ webinars }) {

  const [search, setSearch] = useState("");

  const filtered = webinars.filter(w =>
    w.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "80px" }}>

      <h2>Available Webinars</h2>

      <input
        placeholder="Search Webinar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          marginBottom: "30px"
        }}
      />

      {filtered.map(webinar => (
        <div key={webinar.id} style={{
          background: "white",
          padding: "20px",
          marginBottom: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
        }}>
          <h3>{webinar.title}</h3>
          <p>{webinar.date}</p>

          <Link to={`/webinar/${webinar.id}`}>
            <button style={{ marginRight: "10px" }}>
              View
            </button>
          </Link>

          <Link to={`/admin/create?id=${webinar.id}`}>
            <button style={{ marginRight: "10px" }}>
              Edit
            </button>
          </Link>
        </div>
      ))}

    </div>
  );
}