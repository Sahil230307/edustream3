import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Toast from "../components/Toast";
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

  const [activeTab, setActiveTab] = useState("basic");

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
  const [toast, setToast] = useState(null);

  // Refs for focusing fields
  const titleRef = useRef(null);
  const speakerRef = useRef(null);
  const dateRef = useRef(null);
  const descriptionRef = useRef(null);

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
      let errorMessage = "Failed to load webinar details";
      
      if (error.response?.status === 404) {
        errorMessage = "Webinar not found";
      } else if (error.response?.status === 403) {
        errorMessage = "You don't have permission to edit this webinar";
      }
      
      setToast({ message: errorMessage, type: "error" });
    }
  };

  useEffect(() => {
    if (editId) {
      fetchWebinar();
    }
  }, [editId]);

  const handleSave = async () => {
    if (!title.trim()) {
      setToast({ message: "Please enter webinar title", type: "error" });
      setActiveTab("basic");
      titleRef.current?.focus();
      return;
    }

    if (!speaker.trim()) {
      setToast({ message: "Please enter speaker name", type: "error" });
      setActiveTab("basic");
      speakerRef.current?.focus();
      return;
    }

    if (!date) {
      setToast({ message: "Please select a date", type: "error" });
      setActiveTab("basic");
      dateRef.current?.focus();
      return;
    }

    if (!description.trim()) {
      setToast({ message: "Please enter description", type: "error" });
      setActiveTab("details");
      descriptionRef.current?.focus();
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
        setToast({ message: "Webinar updated successfully", type: "success" });
      } else {
        await createWebinar(webinarData);
        setToast({ message: "Webinar created successfully", type: "success" });
      }

      setTimeout(() => navigate("/admin"), 800);
    } catch (error) {
      console.error("Error saving webinar:", error);
      let errorMessage = "Failed to save webinar";
      
      if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || "Invalid webinar data";
      } else if (error.response?.status === 403) {
        errorMessage = "You don't have permission to perform this action";
      }
      
      setToast({ message: errorMessage, type: "error" });
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Delete this webinar?");
    if (!confirmDelete) return;

    try {
      await deleteWebinar(editId);
      setToast({ message: "Webinar deleted successfully", type: "success" });
      setTimeout(() => navigate("/admin"), 800);
    } catch (error) {
      console.error("Error deleting webinar:", error);
      let errorMessage = "Failed to delete webinar";
      
      if (error.response?.status === 403) {
        errorMessage = "You don't have permission to delete this webinar";
      } else if (error.response?.status === 404) {
        errorMessage = "Webinar not found";
      }
      
      setToast({ message: errorMessage, type: "error" });
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
        {/* Tab Navigation */}
        <div style={{ display: "flex", marginBottom: "20px", borderBottom: "1px solid #e5e7eb" }}>
          <button
            onClick={() => setActiveTab("basic")}
            style={{
              ...tabStyle,
              backgroundColor: activeTab === "basic" ? "#f3f4f6" : "transparent",
              borderBottom: activeTab === "basic" ? "2px solid #4f46e5" : "none",
            }}
          >
            Basic Info
          </button>
          <button
            onClick={() => setActiveTab("details")}
            style={{
              ...tabStyle,
              backgroundColor: activeTab === "details" ? "#f3f4f6" : "transparent",
              borderBottom: activeTab === "details" ? "2px solid #4f46e5" : "none",
            }}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            style={{
              ...tabStyle,
              backgroundColor: activeTab === "settings" ? "#f3f4f6" : "transparent",
              borderBottom: activeTab === "settings" ? "2px solid #4f46e5" : "none",
            }}
          >
            Settings
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "basic" && (
          <div>
            <input
              ref={titleRef}
              type="text"
              placeholder="Webinar Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
            />

            <input
              ref={speakerRef}
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
              ref={dateRef}
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
          </div>
        )}

        {activeTab === "details" && (
          <div>
            <textarea
              ref={descriptionRef}
              placeholder="Webinar Description *"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ ...inputStyle, height: "100px" }}
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
          </div>
        )}

        {activeTab === "settings" && (
          <div>
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
          </div>
        )}

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

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
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

const tabStyle = {
  flex: 1,
  padding: "10px",
  border: "none",
  backgroundColor: "transparent",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  color: "#374151",
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