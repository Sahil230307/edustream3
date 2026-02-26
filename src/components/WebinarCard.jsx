import { Link } from "react-router-dom";
import "./WebinarCard.css";

export default function WebinarCard({ webinar }) {
  return (
    <div className="webinar-card">
      <h3>{webinar.title}</h3>
      <p><strong>Speaker:</strong> {webinar.speaker}</p>
      <p>{webinar.date}</p>

      <Link to={`/webinar/${webinar.id}`}>
        <button>View Details</button>
      </Link>
    </div>
  );
}