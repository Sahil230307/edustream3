import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateWebinar({ webinars, setWebinars }) {

  const navigate = useNavigate();
  const { id } = useParams(); // for edit route

  const editId = Number(id);
  const existing = webinars.find(w => w.id === editId);

  const [title, setTitle] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setSpeaker(existing.speaker);
      setDate(existing.date);
      setDescription(existing.description);
    }
  }, [existing]);

  const handleSave = () => {

    if (!title || !speaker || !date || !description) {
      alert("Please fill all fields");
      return;
    }

    if (editId) {
      const updated = webinars.map(w =>
        w.id === editId
          ? { ...w, title, speaker, date, description }
          : w
      );
      setWebinars(updated);
    } else {
      const newWebinar = {
        id: Date.now(),
        title,
        speaker,
        date,
        description
      };
      setWebinars([...webinars, newWebinar]);
    }

    navigate("/admin");
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm("Delete this webinar?");
    if (confirmDelete) {
      const filtered = webinars.filter(w => w.id !== editId);
      setWebinars(filtered);
      navigate("/admin");
    }
  };

  return (
    <div style={{ padding: "60px", maxWidth: "600px", margin: "auto" }}>

      <h2 style={{ marginBottom: "25px" }}>
        {editId ? "Edit Webinar" : "Create Webinar"}
      </h2>

      <div style={{
        background: "white",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)"
      }}>

        <input
          type="text"
          placeholder="Webinar Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Speaker Name"
          value={speaker}
          onChange={(e) => setSpeaker(e.target.value)}
          style={inputStyle}
        />

        {/* DATE ONLY INPUT */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={inputStyle}
        />

        <textarea
          placeholder="Webinar Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ ...inputStyle, height: "100px" }}
        />

        <div style={{ marginTop: "20px" }}>
          <button onClick={handleSave} style={primaryBtn}>
            {editId ? "Update Webinar" : "Create Webinar"}
          </button>

          {editId && (
            <button
              onClick={handleDelete}
              style={deleteBtn}
            >
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
  border: "1px solid #ccc"
};

const primaryBtn = {
  background: "#4f46e5",
  color: "white",
  padding: "10px 18px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  marginRight: "10px"
};

const deleteBtn = {
  background: "#ef4444",
  color: "white",
  padding: "10px 18px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer"
};