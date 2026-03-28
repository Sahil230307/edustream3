import { useEffect, useState } from "react";
import { getAllWebinars, getRegistrationsByUser } from "../services/api";
import WebinarCard from "../components/WebinarCard";
import Toast from "../components/Toast";

export default function Dashboard({ user }) {
  const [webinars, setWebinars] = useState([]);
  const [registeredIds, setRegisteredIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all webinars
      const webinarsRes = await getAllWebinars();

      // Fetch this user's registrations
      const regRes = await getRegistrationsByUser(user.id);

      setWebinars(webinarsRes.data);

      // Extract webinar IDs from registrations
      const ids = regRes.data.map((reg) => reg.webinar.id);
      setRegisteredIds(ids);

    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user?.id]);

  // Load wishlist from localStorage
  useEffect(() => {
    if (user?.id) {
      const stored = JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];
      setWishlist(stored);
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

  const myWebinars = webinars.filter((w) => registeredIds.includes(w.id));

  if (loading) {
    return (
      <div style={{ padding: "80px" }}>
        <h2>My Registered Webinars</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 20px" }}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h2 style={{ marginBottom: "30px" }}>My Registered Webinars</h2>

      {myWebinars.length === 0 ? (
        <p style={{ fontSize: "16px", color: "#666" }}>No registrations yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {myWebinars.map((webinar) => (
            <WebinarCard
              key={webinar.id}
              webinar={webinar}
              user={user}
              wishlist={wishlist}
              onWishlistToggle={handleWishlistToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}