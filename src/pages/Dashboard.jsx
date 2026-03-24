import { useState, useEffect } from "react";
import { registrationAPI } from "../services/api";

export default function Dashboard({ user }) {

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const data = await registrationAPI.getMyRegistrations();
        setRegistrations(data);
      } catch (error) {
        console.error("Failed to load registrations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchRegistrations();
    }
  }, [user?.id]);

  if (loading) {
    return <div style={{ padding: "80px", textAlign: "center" }}>Loading your registrations...</div>;
  }

  return (
    <div style={{ padding: "80px" }}>
      <h2>My Registered Webinars</h2>

      {registrations.length === 0 && <p>No registrations yet.</p>}

      {registrations.map(webinar => (
        <div key={webinar.id} style={{
          background: "white",
          padding: "20px",
          margin: "20px 0",
          borderRadius: "10px"
        }}>
          <h3>{webinar.title}</h3>
          <p>{webinar.date} - {webinar.time}</p>
          <p>Speaker: {webinar.speaker}</p>
        </div>
      ))}
    </div>
  );
}