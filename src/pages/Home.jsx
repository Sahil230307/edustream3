import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllWebinars } from "../services/api";
import "./Home.css";

export default function Home() {
  const [webinars, setWebinars] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchWebinars();
  }, []);

  const fetchWebinars = async () => {
    try {
      const res = await getAllWebinars();
      setWebinars(res.data);
    } catch (error) {
      console.error("Error fetching webinars:", error);
    }
  };

  const filteredWebinars = webinars?.filter((webinar) =>
    webinar.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-panel">
            <h1>Learn From Industry Experts</h1>
            <p>Join live webinars and professional workshops</p>

            <div className="hero-actions">
              <Link to="/webinars">
                <button className="primary-btn">
                  Explore Webinars
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH SECTION */}
      <section className="search-section">
        <h2>Find Upcoming Webinars</h2>

        <input
          type="text"
          placeholder="Search webinar by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </section>

      {/* WEBINAR PREVIEW SECTION */}
      <section className="webinar-preview">
        {filteredWebinars && filteredWebinars.length > 0 ? (
          filteredWebinars.slice(0, 6).map((webinar) => (
            <div key={webinar.id} className="webinar-card">
              <h3>{webinar.title}</h3>
              <p><strong>Date:</strong> {webinar.date}</p>
              <p>{webinar.description?.substring(0, 80)}...</p>

              <Link to={`/webinar/${webinar.id}`}>
                <button className="secondary-btn">
                  View Details
                </button>
              </Link>
            </div>
          ))
        ) : (
          <p className="no-data">
            No webinars found.
          </p>
        )}
      </section>

      {/* FEATURES SECTION */}
      <section className="features">
        <div className="feature-card">
          <h3>Live Sessions</h3>
          <p>Interactive real-time sessions with Q&A</p>
        </div>

        <div className="feature-card">
          <h3>Expert Speakers</h3>
          <p>Learn directly from industry professionals</p>
        </div>

        <div className="feature-card">
          <h3>Access Recordings</h3>
          <p>Rewatch and revisit sessions anytime</p>
        </div>
      </section>
    </div>
  );
}