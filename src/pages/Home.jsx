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

  const userRole = user?.role?.toUpperCase();

  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        const res = await getAllWebinars();
        setWebinars(res.data || []);
      } catch (error) {
        console.error("Error fetching webinars:", error);
        setToast({
          message: "Failed to load webinars",
          type: "error",
        });
      }
    };

    fetchWebinars();
  }, []);

  // Listen for registration updates to refresh webinars
  useEffect(() => {
    const handleRegistrationUpdate = () => {
      const fetchWebinars = async () => {
        try {
          const res = await getAllWebinars();
          setWebinars(res.data || []);
        } catch (error) {
          console.error("Error fetching webinars:", error);
        }
      };

      fetchWebinars();
    };

    window.addEventListener("registration-updated", handleRegistrationUpdate);
    return () => window.removeEventListener("registration-updated", handleRegistrationUpdate);
  }, []);

  useEffect(() => {
    if (user?.id) {
      const stored =
        JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];
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

  const filteredWebinars = webinars.filter((webinar) =>
    webinar.title?.toLowerCase().includes(search.toLowerCase())
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
            {!user?.isLoggedIn && (
              <>
                <h1>Learn From Industry Experts</h1>
                <p>Join live webinars and professional workshops</p>

                <div className="hero-actions">
                  <Link to="/webinars">
                    <button className="primary-btn">Explore Webinars</button>
                  </Link>
                  <Link to="/signup">
                    <button className="secondary-btn">Get Started</button>
                  </Link>
                </div>
              </>
            )}

            {user?.isLoggedIn && userRole === "USER" && (
              <>
                <h1>Welcome back, {user?.name || "Learner"} 👋</h1>
                <p>Continue your learning journey with live expert webinars</p>

                <div className="hero-actions">
                  <Link to="/dashboard">
                    <button className="primary-btn">Go to My Dashboard</button>
                  </Link>
                  <Link to="/webinars">
                    <button className="secondary-btn">Browse Webinars</button>
                  </Link>
                </div>
              </>
            )}

            {user?.isLoggedIn && userRole === "ADMIN" && (
              <>
                <h1>Welcome Admin 👨‍💼</h1>
                <p>Manage webinars, monitor registrations, and track platform activity</p>

                <div className="hero-actions">
                  <Link to="/admin">
                    <button className="primary-btn">Open Admin Panel</button>
                  </Link>
                  <Link to="/admin/create">
                    <button className="secondary-btn">Create Webinar</button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* QUICK INFO SECTION */}
      {user?.isLoggedIn && (
        <section className="features" style={{ marginTop: "10px" }}>
          {userRole === "USER" && (
            <>
              <div className="feature-card">
                <h3>My Dashboard</h3>
                <p>Track your registered webinars and learning progress</p>
              </div>

              <div className="feature-card">
                <h3>Wishlist</h3>
                <p>Save interesting webinars and revisit them anytime</p>
              </div>

              <div className="feature-card">
                <h3>My Profile</h3>
                <p>Manage your personal information and account details</p>
              </div>
            </>
          )}

          {userRole === "ADMIN" && (
            <>
              <div className="feature-card">
                <h3>Analytics</h3>
                <p>View webinar registrations, engagement, and usage stats</p>
              </div>

              <div className="feature-card">
                <h3>Webinar Management</h3>
                <p>Create, update, and delete webinar content easily</p>
              </div>

              <div className="feature-card">
                <h3>Assignments</h3>
                <p>Manage assignments and track user submissions</p>
              </div>
            </>
          )}
        </section>
      )}

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
        {filteredWebinars.length > 0 ? (
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
        ) : (
          <p className="no-data">No webinars found.</p>
        )}
      </section>

      {/* DEFAULT FEATURES FOR GUEST ONLY */}
      {!user?.isLoggedIn && (
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
      )}
    </div>
  );
}