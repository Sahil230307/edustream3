import { Link } from "react-router-dom";
import "./WebinarCard.css";

export default function WebinarCard({
  webinar,
  user,
  wishlist = [],
  onWishlistToggle,
}) {
  const isInWishlist = wishlist.includes(webinar.id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user?.id) {
      alert("Please login to add to wishlist");
      return;
    }

    if (onWishlistToggle) {
      onWishlistToggle(webinar.id);
    }
  };

  const fallbackImage =
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop";

  return (
    <div className="webinar-card">
      <div className="card-image">
        <img
          src={webinar.imageUrl?.trim() ? webinar.imageUrl : fallbackImage}
          alt={webinar.title || "Webinar"}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImage;
          }}
        />

        <div className="card-badges">
          <span className="category-badge">
            {webinar.category || "Other"}
          </span>

          {webinar.difficulty && (
            <span className="difficulty-badge">
              {webinar.difficulty}
            </span>
          )}
        </div>

        {user?.isLoggedIn && (
          <button
            className={`wishlist-btn ${isInWishlist ? "active" : ""}`}
            onClick={handleWishlistClick}
            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isInWishlist ? "❤️" : "🤍"}
          </button>
        )}
      </div>

      <div className="card-content">
        <h3 className="card-title">{webinar.title}</h3>
        <p className="card-speaker">By {webinar.speaker}</p>

        <div className="card-meta">
          <span className="meta-item">📅 {webinar.date}</span>
          {webinar.time && (
            <span className="meta-item">⏰ {webinar.time}</span>
          )}
        </div>

        {webinar.description && (
          <p className="card-description">
            {webinar.description.length > 100
              ? webinar.description.substring(0, 100) + "..."
              : webinar.description}
          </p>
        )}

        {webinar.ratings && (
          <div className="card-rating">
            <span className="stars">
              {"⭐".repeat(Math.round(webinar.ratings || 0))}
            </span>
            <span className="rating-value">
              {webinar.ratings || 0}/5
            </span>
          </div>
        )}

        <Link to={`/webinar/${webinar.id}`} className="card-link">
          <button className="btn-view">View Details →</button>
        </Link>
      </div>
    </div>
  );
}