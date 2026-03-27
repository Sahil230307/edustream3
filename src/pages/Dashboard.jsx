export default function Dashboard({ webinars, registered }) {

  const myWebinars = webinars.filter(w =>
    registered.includes(w.id)
  );

  return (
    <div style={{ padding: "80px" }}>
      <h2>My Registered Webinars</h2>

      {myWebinars.length === 0 && <p>No registrations yet.</p>}

      {myWebinars.map(webinar => (
        <div key={webinar.id} style={{
          background: "white",
          padding: "20px",
          margin: "20px 0",
          borderRadius: "10px"
        }}>
          <h3>{webinar.title}</h3>
          <p>{webinar.date}</p>
        </div>
      ))}
    </div>
  );
}