import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import RatingsReview from "../components/RatingsReview";
import Toast from "../components/Toast";
import "./WebinarDetails.css";

export default function WebinarDetails({ webinars, setWebinars, registered, setRegistered, user }) {
  const { id } = useParams();
  const webinar = webinars.find(w => w.id === parseInt(id));
  const [toast, setToast] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [imageError, setImageError] = useState(false);

  // Load wishlist when user changes
  useEffect(() => {
    if (user?.id) {
      const stored = JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];
      setWishlist(stored);
    } else {
      setWishlist([]);
    }
  }, [user?.id]);

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

  const isRegistered = registered.includes(webinar.id);
  const isWishlisted = wishlist.includes(webinar.id);
  const capacityPercentage = (webinar.registeredCount / webinar.maxCapacity) * 100;

  const handleRegister = () => {
    if (!user) {
      setToast({ message: "Please login to register", type: "error" });
      return;
    }

    if (webinar.registeredCount >= webinar.maxCapacity) {
      setToast({ message: "This webinar is at full capacity", type: "error" });
      return;
    }

    if (!isRegistered) {
      setRegistered([...registered, webinar.id]);
      const updated = webinars.map(w =>
        w.id === webinar.id ? { ...w, registeredCount: w.registeredCount + 1 } : w
      );
      setWebinars(updated);
      setToast({ message: "Successfully registered! 🎉", type: "success" });
    }
  };

  const handleWishlist = () => {
    if (!user?.id) {
      setToast({ message: "Please login to add to wishlist", type: "error" });
      return;
    }

    const updated = isWishlisted
      ? wishlist.filter(id => id !== webinar.id)
      : [...wishlist, webinar.id];
    
    setWishlist(updated);
    localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updated));
    setToast({
      message: isWishlisted ? "Removed from wishlist" : "Added to wishlist! 🎉",
      type: "info"
    });
  };

  return (
    <div className="webinar-details-container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="details-header">
        <div className="header-image">
          {!imageError ? (
            <img 
              src={webinar.imageUrl} 
              alt={webinar.title}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="image-fallback" style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f0f0f0',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#666'
            }}>
              {webinar.title}
            </div>
          )}
          <div className="header-overlay">
            <span className="category-label">{webinar.category}</span>
            <span className="difficulty-label">{webinar.difficulty}</span>
          </div>
        </div>

        <div className="header-content">
          <h1>{webinar.title}</h1>
          
          <div className="speaker-info">
            <span className="speaker-name">By {webinar.speaker}</span>
            <span className="speaker-email">📧 {webinar.speakerEmail}</span>
          </div>

          <div className="rating-section">
            <div className="stars">{'⭐'.repeat(Math.round(webinar.ratings))}</div>
            <span className="rating-text">{webinar.ratings}/5 ({webinar.reviews?.length || 0} reviews)</span>
          </div>

          <div className="webinar-meta">
            <div className="meta-item">
              <span className="meta-label">📅 Date</span>
              <span className="meta-value">{webinar.date}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">⏰ Time</span>
              <span className="meta-value">{webinar.time}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">👥 Capacity</span>
              <span className="meta-value">{webinar.registeredCount}/{webinar.maxCapacity}</span>
            </div>
          </div>

          <div className="capacity-bar">
            <div className="capacity-fill" style={{ width: `${capacityPercentage}%` }} />
          </div>

          <div className="action-buttons">
            <button 
              className={`btn btn-register ${isRegistered ? 'registered' : ''}`}
              onClick={handleRegister}
              disabled={isRegistered || webinar.registeredCount >= webinar.maxCapacity}
            >
              {isRegistered ? '✓ Registered' : webinar.registeredCount >= webinar.maxCapacity ? 'Full Capacity' : 'Register Now'}
            </button>
            
            <button 
              className={`btn btn-wishlist ${isWishlisted ? 'active' : ''}`}
              onClick={handleWishlist}
            >
              {isWishlisted ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist'}
            </button>
          </div>

          {user && (
            <div className="registration-note">
              {isRegistered ? '✓ You are registered for this webinar' : 'Register to join this webinar'}
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

          {webinar.resources && webinar.resources.length > 0 && (
            <section className="resources-section">
              <h2>Resources</h2>
              <div className="resources-list">
                {webinar.resources.map((resource, idx) => (
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
              <a href={webinar.recordingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-recording">
                ► Watch Recording
              </a>
            </section>
          )}

          {user && (
            <RatingsReview 
              webinar={webinar} 
              webinars={webinars}
              setWebinars={setWebinars}
              user={user}
            />
          )}
        </div>

        <div className="sidebar">
          <div className="info-card">
            <h3>Webinar Details</h3>
            <div className="info-item">
              <span className="label">Category</span>
              <span className="value">{webinar.category}</span>
            </div>
            <div className="info-item">
              <span className="label">Difficulty</span>
              <span className="value">{webinar.difficulty}</span>
            </div>
            <div className="info-item">
              <span className="label">Seats Available</span>
              <span className="value">{webinar.maxCapacity - webinar.registeredCount}</span>
            </div>
            <div className="info-item">
              <span className="label">Status</span>
              <span className="value" style={{ color: webinar.registeredCount >= webinar.maxCapacity ? '#e74c3c' : '#27ae60' }}>
                {webinar.registeredCount >= webinar.maxCapacity ? 'Full' : 'Open'}
              </span>
            </div>
          </div>

          <div className="speaker-card">
            <h3>Speaker</h3>
            <p className="speaker-name">{webinar.speaker}</p>
            <p className="speaker-email">{webinar.speakerEmail}</p>
            <p>Expert instructor with extensive experience in {webinar.category}</p>
          </div>
        </div>
      </div>
    </div>
  );
}