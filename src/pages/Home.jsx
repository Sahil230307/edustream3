import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllWebinars } from "../services/api";
import WebinarCard from "../components/WebinarCard";
import Toast from "../components/Toast";
import "./Home.css";

export default function Home({ user }) {
  const [webinars, setWebinars] = useState([]);
  const [search, setSearch] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState(null);

  // Load webinars on component mount
  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        const res = await getAllWebinars();
        setWebinars(res.data);
      } catch (error) {
        console.error("Error fetching webinars:", error);
      }
    };
    fetchWebinars();
  }, []);

  // Load wishlist from localStorage
  useEffect(() => {
    if (user?.id) {
      const stored = JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];
      setWishlist(stored);
    } else {
      setWishlist([]);
    }
  }, [user?.id]);

  const handleWishlistToggle = (webinarId) => {
    const updated = wishlist.includes(webinarId)
      ? wishlist.filter((id) => id !== webinarId)
      : [...wishlist, webinarId];

    setWishlist(updated);
    if (user?.id) {
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updated));
    }

    const isAdded = !wishlist.includes(webinarId);
    setToast({
      message: isAdded ? "Added to wishlist! 🎉" : "Removed from wishlist",
      type: "info",
    });
  };

  const filteredWebinars = webinars?.filter((webinar) =>
    webinar.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

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
          <>
            <div className="webinar-grid">
              {filteredWebinars.slice(0, 6).map((webinar) => (
                <WebinarCard
                  key={webinar.id}
                  webinar={webinar}
                  user={user}
                  wishlist={wishlist}
                  onWishlistToggle={handleWishlistToggle}
                />
              ))}
            </div>
          </>
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