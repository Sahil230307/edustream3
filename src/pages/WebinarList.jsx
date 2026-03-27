import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import Toast from "../components/Toast";
import { getAllWebinars } from "../services/api";
import "./WebinarList.css";

const ITEMS_PER_PAGE = 6;

export default function WebinarList({ user }) {
  const [webinars, setWebinars] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    loadWebinars();
  }, []);

  // Load wishlist when user changes
  useEffect(() => {
    if (user?.id) {
      const stored = JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];
      setWishlist(stored);
    } else {
      setWishlist([]);
    }
  }, [user?.id]);

  const loadWebinars = async () => {
    try {
      const res = await getAllWebinars();
      setWebinars(res.data);
    } catch (error) {
      console.error("Failed to load webinars:", error);
      setToast({ message: "Failed to load webinars", type: "error" });
    }
  };

  // Get unique categories and difficulties
  const categories = ["All", ...new Set(webinars.map((w) => w.category || "Other"))];
  const difficulties = ["All", ...new Set(webinars.map((w) => w.difficulty || "Beginner"))];

  // Filter webinars
  const filtered = useMemo(() => {
    return webinars.filter((w) => {
      const matchSearch =
        w.title?.toLowerCase().includes(search.toLowerCase()) ||
        w.speaker?.toLowerCase().includes(search.toLowerCase());

      const matchCategory =
        selectedCategory === "All" || (w.category || "Other") === selectedCategory;

      const matchDifficulty =
        selectedDifficulty === "All" ||
        (w.difficulty || "Beginner") === selectedDifficulty;

      return matchSearch && matchCategory && matchDifficulty;
    });
  }, [webinars, search, selectedCategory, selectedDifficulty]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedWebinars = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handleAddToWishlist = (webinarId) => {
    if (!user?.id) {
      setToast({ message: "Please login to add to wishlist", type: "error" });
      return;
    }

    const updated = wishlist.includes(webinarId)
      ? wishlist.filter((id) => id !== webinarId)
      : [...wishlist, webinarId];

    setWishlist(updated);
    localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updated));

    const isAdded = !wishlist.includes(webinarId);
    setToast({
      message: isAdded ? "Added to wishlist! 🎉" : "Removed from wishlist",
      type: "info",
    });
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedDifficulty("All");
    setCurrentPage(1);
  };

  return (
    <div className="webinar-list-container">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="webinar-list-header">
        <h1>Available Webinars</h1>
        <p>Explore our collection of expert-led webinars</p>
      </div>

      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by webinar name or speaker..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <label>Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => {
                setSelectedDifficulty(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff}
                </option>
              ))}
            </select>
          </div>

          {(search || selectedCategory !== "All" || selectedDifficulty !== "All") && (
            <button className="btn-reset" onClick={resetFilters}>
              ✕ Reset Filters
            </button>
          )}
        </div>

        <div className="filter-info">
          <p>{filtered.length} webinar{filtered.length !== 1 ? "s" : ""} found</p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h2>No webinars found</h2>
          <p>Try adjusting your search or filters</p>
          <button className="btn-primary" onClick={resetFilters}>
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="webinar-grid">
            {paginatedWebinars.map((webinar) => (
              <div key={webinar.id} className="webinar-card">
                <div className="card-image">
                  <img
                    src={
                      webinar.imageUrl ||
                      "https://via.placeholder.com/400x200?text=Webinar"
                    }
                    alt={webinar.title}
                  />

                  <div className="card-badges">
                    <span className="category-badge">
                      {webinar.category || "Other"}
                    </span>
                    <span className="difficulty-badge">
                      {webinar.difficulty || "Beginner"}
                    </span>
                  </div>

                  <button
                    className={`wishlist-btn ${
                      wishlist.includes(webinar.id) ? "active" : ""
                    }`}
                    onClick={() => handleAddToWishlist(webinar.id)}
                    title={
                      wishlist.includes(webinar.id)
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                  >
                    {wishlist.includes(webinar.id) ? "❤️" : "🤍"}
                  </button>
                </div>

                <div className="card-content">
                  <h3 className="card-title">{webinar.title}</h3>
                  <p className="card-speaker">By {webinar.speaker}</p>

                  <div className="card-meta">
                    <span className="meta-item">📅 {webinar.date}</span>
                    <span className="meta-item">⏰ {webinar.time}</span>
                  </div>

                  <p className="card-description">{webinar.description}</p>

                  <div className="card-capacity">
                    <span className="capacity-text">
                      {webinar.registeredCount || 0}/{webinar.maxCapacity || 0} Registered
                    </span>
                    <div className="capacity-bar">
                      <div
                        className="capacity-fill"
                        style={{
                          width: `${
                            ((webinar.registeredCount || 0) /
                              (webinar.maxCapacity || 1)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="card-rating">
                    <span className="stars">
                      {"⭐".repeat(Math.round(webinar.ratings || 0))}
                    </span>
                    <span className="rating-value">
                      {webinar.ratings || 0}/5
                    </span>
                  </div>

                  <Link to={`/webinar/${webinar.id}`} className="card-link">
                    <button className="btn-view">View Details →</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>

              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`page-num ${currentPage === page ? "active" : ""}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                className="page-btn"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}