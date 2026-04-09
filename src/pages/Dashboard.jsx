import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllWebinars, getRegistrationsByUser } from "../services/api";
import WebinarCard from "../components/WebinarCard";
import Toast from "../components/Toast";

const ASSIGNMENTS_KEY = "edustream_assignments";

export default function Dashboard({ user }) {
  const navigate = useNavigate();
  const [webinars, setWebinars] = useState([]);
  const [registeredIds, setRegisteredIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [isViewingAssignments, setIsViewingAssignments] = useState(false);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const webinarsRes = await getAllWebinars();
      const regRes = await getRegistrationsByUser(user.id);

      setWebinars(webinarsRes.data || []);

      // Get backend registrations
      let ids = (regRes.data || []).map((reg) => reg.webinar?.id);
      
      // Also check localStorage for pending registrations
      const localStorageRegistrations = 
        JSON.parse(localStorage.getItem(`registered_${user.id}`)) || [];
      
      // Merge both sources (backend + localStorage)
      ids = [...new Set([...ids, ...localStorageRegistrations])];
      
      setRegisteredIds(ids);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      
      // If backend fails, fall back to localStorage only
      if (user?.id) {
        const localStorageRegistrations = 
          JSON.parse(localStorage.getItem(`registered_${user.id}`)) || [];
        setRegisteredIds(localStorageRegistrations);
      }
      
      let errorMessage = "Failed to load dashboard data";
      
      if (error.response?.status === 401) {
        errorMessage = "Your session has expired. Please login again.";
      } else if (error.response?.status === 403) {
        errorMessage = "You don't have permission to access this resource";
      } else if (error.message === "Network Error") {
        errorMessage = "Cannot connect to server";
      }
      
      setToast({
        message: errorMessage,
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

  // Listen for registration updates from WebinarDetails
  useEffect(() => {
    const handleRegistrationUpdate = () => {
      loadDashboardData();
    };

    window.addEventListener("registration-updated", handleRegistrationUpdate);
    return () => window.removeEventListener("registration-updated", handleRegistrationUpdate);
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      const stored =
        JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];
      setWishlist(stored);
    }
  }, [user?.id]);

  // Load assignments from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(ASSIGNMENTS_KEY);
      if (raw) setAssignments(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to load assignments:", e);
    }
  }, []);

  // Save assignments to localStorage
  useEffect(() => {
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments));
  }, [assignments]);

  // Listen for assignment updates from AdminDashboard
  useEffect(() => {
    const handleAssignmentUpdate = () => {
      try {
        const raw = localStorage.getItem(ASSIGNMENTS_KEY);
        if (raw) setAssignments(JSON.parse(raw));
      } catch (e) {
        console.error("Failed to load assignments:", e);
      }
    };

    window.addEventListener("assignment-updated", handleAssignmentUpdate);
    
    // Also listen for storage changes (when admin creates assignment)
    const handleStorageChange = (e) => {
      if (e.key === ASSIGNMENTS_KEY) {
        try {
          if (e.newValue) setAssignments(JSON.parse(e.newValue));
        } catch (e) {
          console.error("Failed to parse assignments:", e);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("assignment-updated", handleAssignmentUpdate);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

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
  
  // Compare dates without time component
  const getTodayAtMidnight = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };
  
  const upcomingWebinars = myWebinars.filter((w) => {
    const webinarDate = new Date(w.date);
    const webinarDateAtMidnight = new Date(webinarDate.getFullYear(), webinarDate.getMonth(), webinarDate.getDate());
    return webinarDateAtMidnight >= getTodayAtMidnight();
  });
  
  const completedWebinars = myWebinars.filter((w) => {
    const webinarDate = new Date(w.date);
    const webinarDateAtMidnight = new Date(webinarDate.getFullYear(), webinarDate.getMonth(), webinarDate.getDate());
    return webinarDateAtMidnight < getTodayAtMidnight();
  });

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

      {/* ASSIGNMENTS SECTION */}
      <div style={{ marginTop: "40px", paddingTop: "30px", borderTop: "2px solid #eee" }}>
        <button
          onClick={() => setIsViewingAssignments(!isViewingAssignments)}
          style={{
            marginBottom: "20px",
            padding: "12px 24px",
            background: "#f39c12",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600",
            transition: "all 0.3s",
          }}
          onMouseover={(e) => e.target.style.background = "#e67e22"}
          onMouseout={(e) => e.target.style.background = "#f39c12"}
        >
          {isViewingAssignments ? "Hide Assignments" : "📝 View Assignments"}
        </button>

        {isViewingAssignments && (
          <div style={{ background: "#fff", padding: "25px", borderRadius: "16px", boxShadow: "0 6px 18px rgba(0,0,0,0.06)" }}>
            <h2 style={{ marginBottom: "20px" }}>Assignments</h2>

            {assignments.length === 0 ? (
              <p style={{ color: "#999", fontSize: "16px" }}>
                No assignments yet. Check back soon! 📚
              </p>
            ) : (
              <div style={{ display: "grid", gap: "15px" }}>
                {assignments.map((a) => (
                  <div
                    key={a.id}
                    style={{
                      background: "#f8f9fa",
                      padding: "18px",
                      borderRadius: "12px",
                      borderLeft: "4px solid #f39c12",
                    }}
                  >
                    <div style={{ marginBottom: "10px" }}>
                      <h4 style={{ margin: "0 0 8px", fontSize: "18px", color: "#2c3e50" }}>
                        {a.title}
                      </h4>
                      {a.due && (
                        <span style={{ fontSize: "14px", color: "#e74c3c", fontWeight: "600" }}>
                          📅 Due: {new Date(a.due).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p style={{ margin: "10px 0", color: "#666", lineHeight: "1.5" }}>
                      {a.description}
                    </p>
                    <button
                      onClick={() => navigate("/submission")}
                      style={{
                        padding: "8px 16px",
                        background: "#3498db",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      Submit Assignment
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}