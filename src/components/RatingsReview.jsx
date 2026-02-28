import React, { useState } from "react";
import Toast from "../components/Toast";
import "./RatingsReview.css";

export default function RatingsReview({ webinar, webinars, setWebinars, user }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [toast, setToast] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleSubmitReview = () => {
    if (rating === 0) {
      setToast({ message: "Please select a rating", type: "error" });
      return;
    }

    if (!comment.trim()) {
      setToast({ message: "Please write a comment", type: "error" });
      return;
    }

    const updatedWebinars = webinars.map(w => {
      if (w.id === webinar.id) {
        const newReview = {
          userId: user?.id,
          userName: user?.name || "Anonymous",
          rating,
          comment,
          date: new Date().toLocaleDateString()
        };

        const updatedReviews = [...(w.reviews || []), newReview];
        const avgRating = (
          updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length
        ).toFixed(1);

        return { ...w, reviews: updatedReviews, ratings: parseFloat(avgRating) };
      }
      return w;
    });

    setWebinars(updatedWebinars);
    localStorage.setItem("webinars", JSON.stringify(updatedWebinars));
    
    setRating(0);
    setComment("");
    setShowReviewForm(false);
    setToast({ message: "Review submitted successfully!", type: "success" });
  };

  const reviews = webinar.reviews || [];
  const avgRating = webinar.ratings || 0;

  return (
    <div className="ratings-review-container">
      <div className="ratings-summary">
        <div className="average-rating">
          <div className="rating-value">{avgRating}</div>
          <div className="stars">
            {"⭐".repeat(Math.round(avgRating))}
          </div>
          <div className="review-count">({reviews.length} reviews)</div>
        </div>

        {user && (
          <button 
            className="btn-write-review"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            {showReviewForm ? "Cancel" : "Write a Review"}
          </button>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {showReviewForm && (
        <div className="review-form">
          <h4>Share Your Experience</h4>
          
          <div className="rating-selector">
            <label>Rating</label>
            <div className="stars-selector">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  className={`star-btn ${rating >= star ? "active" : ""}`}
                  onClick={() => setRating(star)}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          <div className="comment-field">
            <label htmlFor="comment">Your Comment</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this webinar..."
              rows="4"
            />
          </div>

          <button className="btn-submit-review" onClick={handleSubmitReview}>
            Submit Review
          </button>
        </div>
      )}

      <div className="reviews-list">
        <h4>Reviews</h4>
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="review-item">
              <div className="review-header">
                <div>
                  <h5>{review.userName}</h5>
                  <div className="review-rating">
                    {"⭐".repeat(review.rating)}<span className="rating-text">({review.rating}/5)</span>
                  </div>
                </div>
                <span className="review-date">{review.date}</span>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
