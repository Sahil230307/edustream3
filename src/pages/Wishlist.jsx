import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Toast from "../components/Toast";
import { getAllWebinars } from "../services/api";
import "./Wishlist.css";

export default function Wishlist({ user }) {
  const [wishlist, setWishlist] = useState([]);
  const [webinars, setWebinars] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadWishlistData();
  }, [user?.id]);

  const loadWishlistData = async () => {
    try {
      const storedWishlist =
        JSON.parse(localStorage.getItem(`wishlist_${user?.id}`)) || [];

      const res = await getAllWebinars();

      setWishlist(storedWishlist);
      setWebinars(res.data);
    } catch (error) {
      console.error("Error loading wishlist:", error);
      setToast({ message: "Failed to load wishlist", type: "error" });
    }
  };

  const wishlistWebinars = webinars.filter((w) => wishlist.includes(Number(w.id)));

  const handleRemoveFromWishlist = (webinarId) => {
    const updated = wishlist.filter((id) => id !== webinarId);
    setWishlist(updated);

    if (user?.id) {
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updated));
    }

    setToast({ message: "Removed from wishlist", type: "info" });
  };

  return (
    <div className="wishlist-container">
      <h1>My Wishlist</h1>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {wishlistWebinars.length === 0 ? (
        <div className="empty-state">
          <p>Your wishlist is empty</p>
          <Link to="/webinars">
            <button className="btn-primary">Browse Webinars</button>
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistWebinars.map((webinar) => (
            <div key={webinar.id} className="wishlist-card">
              <div className="card-image">
                <img
                  src={webinar.imageUrl || "https://via.placeholder.com/400x200?text=Webinar"}
                  alt={webinar.title}
                />
                <span className="category-badge">
                  {webinar.category || "General"}
                </span>
              </div>

              <div className="card-content">
                <h3>{webinar.title}</h3>
                <p className="speaker">By {webinar.speaker}</p>
                <p className="date">📅 {webinar.date}</p>
                <p className="description">
                  {webinar.description?.substring(0, 100)}...
                </p>

                <div className="card-footer">
                  <Link to={`/webinar/${webinar.id}`}>
                    <button className="btn-primary">View Details</button>
                  </Link>

                  <button
                    className="btn-remove"
                    onClick={() => handleRemoveFromWishlist(webinar.id)}
                  >
                    ❌ Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}