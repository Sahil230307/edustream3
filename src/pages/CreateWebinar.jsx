import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createWebinar,
  getWebinarById,
  updateWebinar,
  deleteWebinar,
} from "../services/api";

export default function CreateWebinar() {
  const navigate = useNavigate();
  const { id } = useParams(); // for edit route

  const editId = id ? Number(id) : null;

  const [title, setTitle] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [speakerEmail, setSpeakerEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [maxCapacity, setMaxCapacity] = useState("100");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (editId) {
      fetchWebinar();
    }
  }, [editId]);

  const fetchWebinar = async () => {
    try {
      const res = await getWebinarById(editId);
      const existing = res.data;

      if (existing) {
        setTitle(existing.title || "");
        setSpeaker(existing.speaker || "");
        setSpeakerEmail(existing.speakerEmail || "");
        setDate(existing.date || "");
        setTime(existing.time || "");
        setDescription(existing.description || "");
        setCategory(existing.category || "Web Development");
        setDifficulty(existing.difficulty || "Beginner");
        setMaxCapacity(existing.maxCapacity || "100");
        setImageUrl(existing.imageUrl || "");
      }
    } catch (error) {
      console.error("Error fetching webinar:", error);
      alert("Failed to load webinar details");
    }
  };

  const handleSave = async () => {
    if (!title || !speaker || !date || !description) {
      alert("Please fill all required fields");
      return;
    }

    // Sending only backend-supported fields for now
    const webinarData = {
      title,
      speaker,
      date,
      time: time || "2:00 PM - 4:00 PM",
      description,
      imageUrl:
        imageUrl ||
        "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&h=250&fit=crop",
      meetingLink: "",
      recordingUrl: "",
      materials: "",
    };

    try {
      if (editId) {
        await updateWebinar(editId, webinarData);
        alert("Webinar updated successfully");
      } else {
        await createWebinar(webinarData);
        alert("Webinar created successfully");
      }

      navigate("/admin");
    } catch (error) {
      console.error("Error saving webinar:", error);
      alert("Failed to save webinar");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Delete this webinar?");
    if (!confirmDelete) return;

    try {
      await deleteWebinar(editId);
      alert("Webinar deleted successfully");
      navigate("/admin");
    } catch (error) {
      console.error("Error deleting webinar:", error);
      alert("Failed to delete webinar");
    }
  };

  return (
    <div style={{ padding: "60px", maxWidth: "600px", margin: "auto" }}>
      <h2 style={{ marginBottom: "25px" }}>
        {editId ? "Edit Webinar" : "Create Webinar"}
      </h2>

      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        }}
      >
        <input
          type="text"
          placeholder="Webinar Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Speaker Name *"
          value={speaker}
          onChange={(e) => setSpeaker(e.target.value)}
          style={inputStyle}
        />

        <input
          type="email"
          placeholder="Speaker Email"
          value={speakerEmail}
          onChange={(e) => setSpeakerEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={inputStyle}
        />

        <input
          type="time"
          placeholder="Time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={inputStyle}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={inputStyle}
        >
          <option value="Web Development">Web Development</option>
          <option value="Cloud">Cloud</option>
          <option value="AI/ML">AI/ML</option>
          <option value="Design">Design</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          style={inputStyle}
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <input
          type="number"
          placeholder="Max Capacity"
          value={maxCapacity}
          onChange={(e) => setMaxCapacity(e.target.value)}
          style={inputStyle}
        />

        <input
          type="url"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          style={inputStyle}
        />

        <textarea
          placeholder="Webinar Description *"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ ...inputStyle, height: "100px" }}
        />

        <div style={{ marginTop: "20px" }}>
          <button onClick={handleSave} style={primaryBtn}>
            {editId ? "Update Webinar" : "Create Webinar"}
          </button>

          {editId && (
            <button onClick={handleDelete} style={deleteBtn}>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const primaryBtn = {
  background: "#4f46e5",
  color: "white",
  padding: "10px 18px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  marginRight: "10px",
};

const deleteBtn = {
  background: "#ef4444",
  color: "white",
  padding: "10px 18px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
};