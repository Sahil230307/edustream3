import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import RatingsReview from "../components/RatingsReview";
import Toast from "../components/Toast";
import { getWebinarById, registerForWebinar } from "../services/api";
import "./WebinarDetails.css";

export default function WebinarDetails({ user }) {
  const { id } = useParams();

  const [webinar, setWebinar] = useState(null);
  const [toast, setToast] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const fetchWebinarDetails = async () => {
    try {
      const res = await getWebinarById(id);
      setWebinar(res.data);
    } catch (error) {
      console.error("Error fetching webinar details:", error);
      setToast({ message: "Failed to load webinar details", type: "error" });
    }
  };

  // Load webinar details
  useEffect(() => {
    fetchWebinarDetails();
  }, [id]);

  // Load wishlist when user changes
  useEffect(() => {
    if (user?.id) {
      const stored = JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];
      setWishlist(stored);
    } else {
      setWishlist([]);
    }
  }, [user?.id]);

  // Check if already registered (frontend-side quick check)
  useEffect(() => {
    if (user?.id) {
      const storedRegistered = JSON.parse(localStorage.getItem(`registered_${user.id}`)) || [];
      setIsRegistered(storedRegistered.includes(Number(id)));
    }
  }, [user?.id, id]);

  if (!webinar) {
    return (
      <div className="webinar-details-container">
        <div className="error-message">
          <h2>Webinar not found</h2>
          <p>The webinar you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(Number(webinar.id));

  // Safe fallback values (until backend stores these properly)
  const category = webinar.category || "General";
  const difficulty = webinar.difficulty || "Beginner";
  const speakerEmail = webinar.speakerEmail || "Not provided";
  const maxCapacity = webinar.maxCapacity || 100;
  const registeredCount = webinar.registeredCount || 0;
  const ratings = webinar.ratings || 0;
  const reviews = webinar.reviews || [];
  const resources = webinar.resources || [];

  const capacityPercentage = (registeredCount / maxCapacity) * 100;

  const handleRegister = async () => {
    if (!user) {
      setToast({ message: "Please login to register", type: "error" });
      return;
    }

    if (isRegistered) {
      setToast({ message: "You are already registered", type: "info" });
      return;
    }

    try {
      const res = await registerForWebinar(user.id, webinar.id);

      if (res.data.message === "Registration successful") {
        setToast({ message: "Successfully registered! 🎉", type: "success" });

        // local tracking for frontend button state
        const storedRegistered = JSON.parse(localStorage.getItem(`registered_${user.id}`)) || [];
        const updated = [...storedRegistered, Number(webinar.id)];
        localStorage.setItem(`registered_${user.id}`, JSON.stringify(updated));
        setIsRegistered(true);
      } else {
        setToast({
          message: res.data.message || "Registration failed",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setToast({ message: "Failed to register", type: "error" });
    }
  };

  const handleWishlist = () => {
    if (!user?.id) {
      setToast({ message: "Please login to add to wishlist", type: "error" });
      return;
    }

    const updated = isWishlisted
      ? wishlist.filter((wid) => wid !== webinar.id)
      : [...wishlist, webinar.id];

    setWishlist(updated);
    localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updated));

    setToast({
      message: isWishlisted ? "Removed from wishlist" : "Added to wishlist! 🎉",
      type: "info",
    });
  };

  return (
    <div className="webinar-details-container">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="details-header">
        <div className="header-image">
          {!imageError ? (
            <img
              src={webinar.imageUrl || "https://via.placeholder.com/800x400?text=Webinar"}
              alt={webinar.title}
              onError={() => setImageError(true)}
            />
          ) : (
            <div
              className="image-fallback"
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f0f0f0",
                fontSize: "24px",
                fontWeight: "bold",
                color: "#666",
              }}
            >
              {webinar.title}
            </div>
          )}
          <div className="header-overlay">
            <span className="category-label">{category}</span>
            <span className="difficulty-label">{difficulty}</span>
          </div>
        </div>

        <div className="header-content">
          <h1>{webinar.title}</h1>

          <div className="speaker-info">
            <span className="speaker-name">By {webinar.speaker}</span>
            <span className="speaker-email">📧 {speakerEmail}</span>
          </div>

          <div className="rating-section">
            <div className="stars">
              {ratings > 0 ? "⭐".repeat(Math.round(ratings)) : "No ratings yet"}
            </div>
            <span className="rating-text">
              {ratings}/5 ({reviews.length} reviews)
            </span>
          </div>

          <div className="webinar-meta">
            <div className="meta-item">
              <span className="meta-label">📅 Date</span>
              <span className="meta-value">{webinar.date}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">⏰ Time</span>
              <span className="meta-value">{webinar.time || "Not specified"}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">👥 Capacity</span>
              <span className="meta-value">{registeredCount}/{maxCapacity}</span>
            </div>
          </div>

          <div className="capacity-bar">
            <div
              className="capacity-fill"
              style={{ width: `${capacityPercentage}%` }}
            />
          </div>

          <div className="action-buttons">
            <button
              className={`btn btn-register ${isRegistered ? "registered" : ""}`}
              onClick={handleRegister}
              disabled={isRegistered}
            >
              {isRegistered ? "✓ Registered" : "Register Now"}
            </button>

            <button
              className={`btn btn-wishlist ${isWishlisted ? "active" : ""}`}
              onClick={handleWishlist}
            >
              {isWishlisted ? "❤️ Remove from Wishlist" : "🤍 Add to Wishlist"}
            </button>
          </div>

          {user && (
            <div className="registration-note">
              {isRegistered
                ? "✓ You are registered for this webinar"
                : "Register to join this webinar"}
            </div>
          )}
        </div>
      </div>

      <div className="details-content">
        <div className="main-content">
          <section className="description-section">
            <h2>About This Webinar</h2>
            <p>{webinar.description}</p>
          </section>

          {resources.length > 0 && (
            <section className="resources-section">
              <h2>Resources</h2>
              <div className="resources-list">
                {resources.map((resource, idx) => (
                  <a
                    key={idx}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-item"
                  >
                    <span className="resource-icon">📄</span>
                    <span className="resource-name">{resource.name}</span>
                    <span className="resource-arrow">↗</span>
                  </a>
                ))}
              </div>
            </section>
          )}

          {webinar.recordingUrl && (
            <section className="recording-section">
              <h2>Recording</h2>
              <p>Access the webinar recording and materials</p>
              <a
                href={webinar.recordingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-recording"
              >
                ► Watch Recording
              </a>
            </section>
          )}

          {user && webinar && (
            <RatingsReview
              webinar={webinar}
              webinars={[webinar]}
              setWebinars={() => {}}
              user={user}
            />
          )}
        </div>

        <div className="sidebar">
          <div className="info-card">
            <h3>Webinar Details</h3>
            <div className="info-item">
              <span className="label">Category</span>
              <span className="value">{category}</span>
            </div>
            <div className="info-item">
              <span className="label">Difficulty</span>
              <span className="value">{difficulty}</span>
            </div>
            <div className="info-item">
              <span className="label">Seats Available</span>
              <span className="value">{maxCapacity - registeredCount}</span>
            </div>
            <div className="info-item">
              <span className="label">Status</span>
              <span
                className="value"
                style={{ color: registeredCount >= maxCapacity ? "#e74c3c" : "#27ae60" }}
              >
                {registeredCount >= maxCapacity ? "Full" : "Open"}
              </span>
            </div>
          </div>

          <div className="speaker-card">
            <h3>Speaker</h3>
            <p className="speaker-name">{webinar.speaker}</p>
            <p className="speaker-email">{speakerEmail}</p>
            <p>Expert instructor with extensive experience in {category}</p>
          </div>
        </div>
      </div>
    </div>
  );
}