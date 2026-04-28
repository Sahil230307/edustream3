import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import RatingsReview from "../components/RatingsReview";
import Toast from "../components/Toast";
import { getWorkshopById, registerForWorkshop } from "../services/api";
import "./WorkshopDetails.css";

export default function WorkshopDetails({ user }) {
  const { id } = useParams();

  const [workshop, setWorkshop] = useState(null);
  const [toast, setToast] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);

  const fallbackImage =
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop";

  const fetchWorkshopDetails = async () => {
    try {
      const res = await getWorkshopById(id);
      const workshopData = res.data;
      setWorkshop({
        ...workshopData,
        id: workshopData.id ?? workshopData._id,
      });
    } catch (error) {
      console.error("Error fetching workshop details:", error);
      setToast({ message: "Failed to load workshop details", type: "error" });
    }
  };

  // Load workshop details
  useEffect(() => {
    fetchWorkshopDetails();
  }, [id]);

  // Load wishlist when user changes
  useEffect(() => {
    if (user?.id) {
      const stored =
        JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];
      setWishlist(stored);
    } else {
      setWishlist([]);
    }
  }, [user?.id]);

  // Check if already registered
  useEffect(() => {
    if (user?.id) {
      const storedRegistered =
        JSON.parse(localStorage.getItem(`registered_${user.id}`)) || [];
      setIsRegistered(storedRegistered.includes(Number(id)));
    }
  }, [user?.id, id]);

  if (!workshop) {
    return (
      <div className="workshop-details-container">
        <div className="error-message">
          <h2>Workshop not found</h2>
          <p>The workshop you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(Number(workshop.id));

  // Safe fallback values
  const category = workshop.category || "General";
  const difficulty = workshop.difficulty || "Beginner";
  const speakerEmail = workshop.speakerEmail || "Not provided";
  const maxCapacity = workshop.maxCapacity || 100;
  const registeredCount = workshop.registeredCount || 0;
  const ratings = workshop.ratings || 0;
  const reviews = workshop.reviews || [];
  const resources = workshop.resources || [];

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
      const res = await registerForWorkshop(user.id, workshop.id);

      if (res.data.message === "Registration successful") {
        setToast({ message: "Successfully registered! 🎉", type: "success" });

        const storedRegistered =
          JSON.parse(localStorage.getItem(`registered_${user.id}`)) || [];
        const updated = [...storedRegistered, Number(workshop.id)];
        localStorage.setItem(`registered_${user.id}`, JSON.stringify(updated));
        setIsRegistered(true);
        
        // Update the workshop state to show increased registered count
        setWorkshop((prev) => ({
          ...prev,
          registeredCount: (prev.registeredCount || 0) + 1,
        }));
        
        // Dispatch custom event to notify Dashboard of registration
        window.dispatchEvent(new Event("registration-updated"));
      } else {
        setToast({
          message: res.data.message || "Registration failed",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = "Failed to register";
      
      if (error.response?.status === 409) {
        errorMessage = "You are already registered for this workshop";
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || "Invalid registration";
      }
      
      setToast({ message: errorMessage, type: "error" });
    }
  };

  const handleWishlist = () => {
    if (!user?.id) {
      setToast({ message: "Please login to add to wishlist", type: "error" });
      return;
    }

    const updated = isWishlisted
      ? wishlist.filter((wid) => wid !== workshop.id)
      : [...wishlist, workshop.id];

    setWishlist(updated);
    localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updated));

    setToast({
      message: isWishlisted ? "Removed from wishlist" : "Added to wishlist! 🎉",
      type: "info",
    });
  };

  return (
    <div className="workshop-details-container">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="details-header">
        <div className="header-image">
          <img
            src={workshop.imageUrl?.trim() ? workshop.imageUrl : fallbackImage}
            alt={workshop.title || "Workshop"}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackImage;
            }}
          />

          <div className="header-overlay">
            <span className="category-label">{category}</span>
            <span className="difficulty-label">{difficulty}</span>
          </div>
        </div>

        <div className="header-content">
          <h1>{workshop.title}</h1>

          <div className="speaker-info">
            <span className="speaker-name">By {workshop.speaker}</span>
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

          <div className="workshop-meta">
            <div className="meta-item">
              <span className="meta-label">📅 Date</span>
              <span className="meta-value">{workshop.date}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">⏰ Time</span>
              <span className="meta-value">{workshop.time || "Not specified"}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">👥 Capacity</span>
              <span className="meta-value">
                {registeredCount}/{maxCapacity}
              </span>
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
                ? "✓ You are registered for this workshop"
                : "Register to join this workshop"}
            </div>
          )}
        </div>
      </div>

      <div className="details-content">
        <div className="main-content">
          <section className="description-section">
            <h2>About This Workshop</h2>
            <p>{workshop.description}</p>
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

          {workshop.recordingUrl && (
            <section className="recording-section">
              <h2>Recording</h2>
              <p>Access the workshop recording and materials</p>
              <a
                href={workshop.recordingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-recording"
              >
                ► Watch Recording
              </a>
            </section>
          )}

          {user && workshop && (
            <RatingsReview
              workshop={workshop}
              workshops={[workshop]}
              setWorkshops={() => {}}
              user={user}
            />
          )}
        </div>

        <div className="sidebar">
          <div className="info-card">
            <h3>Workshop Details</h3>
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
                style={{
                  color: registeredCount >= maxCapacity ? "#e74c3c" : "#27ae60",
                }}
              >
                {registeredCount >= maxCapacity ? "Full" : "Open"}
              </span>
            </div>
          </div>

          <div className="speaker-card">
            <h3>Speaker</h3>
            <p className="speaker-name">{workshop.speaker}</p>
            <p className="speaker-email">{speakerEmail}</p>
            <p>Expert instructor with extensive experience in {category}</p>
          </div>
        </div>
      </div>
    </div>
  );
}