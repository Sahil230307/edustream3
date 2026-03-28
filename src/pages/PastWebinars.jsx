import { useEffect, useState } from "react";

export default function PastWebinars() {

  const [pastWebinars, setPastWebinars] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const stored = JSON.parse(localStorage.getItem("webinars")) || [];
    const today = new Date().toISOString().split("T")[0];

    const filtered = stored.filter((w) => w.date < today);
    setPastWebinars(filtered);
  }, []);

  const featuredVideos = [
    {
      id: 1,
      title: "React Full Course Seminar",
      link: "https://www.youtube.com/embed/Ke90Tje7VS0"
    },
    {
      id: 2,
      title: "Web Development Bootcamp",
      link: "https://www.youtube.com/embed/dGcsHMXbSOA"
    },
    {
      id: 3,
      title: "Modern JavaScript Deep Dive",
      link: "https://www.youtube.com/embed/Zftx68K-1D4"
    }
  ];

  return (
    <div style={{ padding: "60px" }}>

      <h2 style={{ marginBottom: "30px" }}>
        Past Webinars & Recordings
      </h2>

      {/* Past Webinars Section */}
      {pastWebinars.length === 0 ? (
        <p>No past webinars available.</p>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "25px",
          marginBottom: "50px"
        }}>
          {pastWebinars.map((webinar) => (
            <div
              key={webinar.id}
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
              }}
            >
              <h3>{webinar.title}</h3>
              <p><strong>Date:</strong> {webinar.date}</p>
              <p style={{ margin: "10px 0 20px 0" }}>
                {webinar.description}
              </p>

              <iframe
                width="100%"
                height="250"
                src="https://www.youtube.com/embed/Ke90Tje7VS0"
                title="Webinar Recording"
                frameBorder="0"
                allowFullScreen
                style={{ borderRadius: "10px" }}
              ></iframe>
            </div>
          ))}
        </div>
      )}

      {/* Featured Recordings Section */}
      <h3 style={{ marginBottom: "20px" }}>
        Featured Seminar Recordings
      </h3>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
        gap: "25px"
      }}>
        {featuredVideos.map((video) => (
          <div
            key={video.id}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
            }}
          >
            <h4 style={{ marginBottom: "15px" }}>
              {video.title}
            </h4>

            <iframe
              width="100%"
              height="250"
              src={video.link}
              title={video.title}
              frameBorder="0"
              allowFullScreen
              style={{ borderRadius: "10px" }}
            ></iframe>
          </div>
        ))}
      </div>

    </div>
  );
}