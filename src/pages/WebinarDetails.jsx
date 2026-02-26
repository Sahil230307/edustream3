import { useParams } from "react-router-dom";

export default function WebinarDetails({ webinars, registered, setRegistered }) {

  const { id } = useParams();
  const webinar = webinars.find(w => w.id === parseInt(id));

  const handleRegister = () => {
    if (!registered.includes(webinar.id)) {
      setRegistered([...registered, webinar.id]);
    }
  };

  return (
    <div style={{ padding: "80px" }}>
      <h2>{webinar.title}</h2>
      <p>{webinar.description}</p>
      <p>Speaker: {webinar.speaker}</p>
      <p>Date: {webinar.date}</p>

      {registered.includes(webinar.id) ? (
        <p style={{ color: "green" }}>Already Registered</p>
      ) : (
        <button onClick={handleRegister}>
          Register Now
        </button>
      )}
    </div>
  );
}