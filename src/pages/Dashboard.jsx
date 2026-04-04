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

      const webinarsRes = await getAllWebinars();
      const regRes = await getRegistrationsByUser(user.id);

      setWebinars(webinarsRes.data || []);

      const ids = (regRes.data || []).map((reg) => reg.webinar?.id);
      setRegisteredIds(ids);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      setToast({
        message: "Failed to load dashboard data",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      const stored =
        JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];
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
  const upcomingWebinars = myWebinars.filter((w) => new Date(w.date) >= new Date());
  const completedWebinars = myWebinars.filter((w) => new Date(w.date) < new Date());

  if (loading) {
    return (
      <div style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "12px" }}>My Dashboard</h2>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* HEADER */}
      <div
        style={{
          marginBottom: "30px",
          padding: "28px",
          borderRadius: "18px",
          background: "linear-gradient(135deg, #3498db, #6dd5fa)",
          color: "white",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "700" }}>
          Welcome back, {user?.name || "Learner"} 👋
        </h1>
        <p style={{ marginTop: "10px", fontSize: "16px", opacity: 0.95 }}>
          Track your registered webinars, wishlist, and learning progress here.
        </p>
      </div>

      {/* STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "35px",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "22px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
          }}
        >
          <h3 style={{ margin: "0 0 10px", fontSize: "16px", color: "#555" }}>
            Registered Webinars
          </h3>
          <div style={{ fontSize: "30px", fontWeight: "700", color: "#3498db" }}>
            {myWebinars.length}
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "22px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
          }}
        >
          <h3 style={{ margin: "0 0 10px", fontSize: "16px", color: "#555" }}>
            Upcoming
          </h3>
          <div style={{ fontSize: "30px", fontWeight: "700", color: "#27ae60" }}>
            {upcomingWebinars.length}
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "22px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
          }}
        >
          <h3 style={{ margin: "0 0 10px", fontSize: "16px", color: "#555" }}>
            Completed
          </h3>
          <div style={{ fontSize: "30px", fontWeight: "700", color: "#9b59b6" }}>
            {completedWebinars.length}
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "22px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
          }}
        >
          <h3 style={{ margin: "0 0 10px", fontSize: "16px", color: "#555" }}>
            Wishlist
          </h3>
          <div style={{ fontSize: "30px", fontWeight: "700", color: "#e74c3c" }}>
            {wishlist.length}
          </div>
        </div>
      </div>

      {/* REGISTERED WEBINARS */}
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ marginBottom: "18px", fontSize: "26px" }}>
          My Registered Webinars
        </h2>

        {myWebinars.length === 0 ? (
          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "16px",
              textAlign: "center",
              boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
            }}
          >
            <p style={{ fontSize: "17px", color: "#666", marginBottom: "8px" }}>
              You have not registered for any webinars yet.
            </p>
            <p style={{ color: "#999" }}>
              Explore webinars and start learning 🚀
            </p>
          </div>
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
    </div>
  );
}