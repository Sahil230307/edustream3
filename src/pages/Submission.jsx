import React, { useEffect, useState, useRef } from "react";
import "./Submission.css";

const STORAGE_KEY = "edustream_submissions";

export default function Submission() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [mode, setMode] = useState("files"); // 'files' or 'link'
  const [linkValue, setLinkValue] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSubmissions(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to load submissions:", e);
    }
  }, []);

  const persist = (items) => {
    setSubmissions(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save submissions:", e);
    }
  };

  const readFileAsDataURL = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("File read error"));
      reader.onload = () =>
        resolve({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          dataURL: reader.result,
          uploadedAt: Date.now(),
        });
      reader.readAsDataURL(file);
    });

  const handleFileChange = async (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    setLoading(true);
    try {
      const items = await Promise.all(selected.map(readFileAsDataURL));
      const updated = [...items, ...submissions];
      persist(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      e.target.value = null;
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    if (!files.length) return;
    setLoading(true);
    try {
      const items = await Promise.all(files.map(readFileAsDataURL));
      const updated = [...items, ...submissions];
      persist(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const addLink = () => {
    if (!linkValue) return;
    const item = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name: linkValue.split("/").pop() || linkValue,
      size: 0,
      type: "link",
      dataURL: linkValue,
      uploadedAt: Date.now(),
    };
    persist([item, ...submissions]);
    setLinkValue("");
  };

  const removeItem = (id) => {
    const updated = submissions.filter((s) => s.id !== id);
    persist(updated);
  };

  const clearAll = () => {
    persist([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Submission</h2>

      <div className="submission-controls">
        <div className="mode-toggle" role="tablist" aria-label="Upload mode">
          <button
            className={mode === "files" ? "active" : ""}
            onClick={() => setMode("files")}
          >
            Files
          </button>
          <button
            className={mode === "link" ? "active" : ""}
            onClick={() => setMode("link")}
          >
            Link
          </button>
        </div>

        {mode === "files" ? (
          <div className="file-mode">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <div
              className="dropzone"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="dz-inner">
                <strong>Click or drag files here</strong>
                <div className="dz-sub">Supports images, PDFs and more</div>
              </div>
            </div>
            <div style={{ marginTop: 8 }}>
              <button onClick={() => fileInputRef.current?.click()}>Add Files</button>
              <button onClick={clearAll} style={{ marginLeft: 8 }}>
                Clear All
              </button>
            </div>
          </div>
        ) : (
          <div className="link-mode">
            <input
              type="text"
              placeholder="Paste a file URL (https://...)"
              value={linkValue}
              onChange={(e) => setLinkValue(e.target.value)}
              className="link-input"
            />
            <button onClick={addLink} style={{ marginLeft: 8 }}>
              Add Link
            </button>
            <button onClick={clearAll} style={{ marginLeft: 8 }}>
              Clear All
            </button>
          </div>
        )}
      </div>

      {loading && <div>Reading files…</div>}

      <div>
        {submissions.length === 0 ? (
          <div>No submissions yet.</div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {submissions.map((s) => (
              <li
                key={s.id}
                style={{
                  marginBottom: 12,
                  padding: 10,
                  border: "1px solid #ddd",
                  borderRadius: 6,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>
                      {(s.size / 1024).toFixed(1)} KB • {s.type || "(unknown)"}
                      {' • '}
                      {new Date(s.uploadedAt).toLocaleString()}
                    </div>
                    {s.type?.startsWith("image/") && (
                      <img
                        src={s.dataURL}
                        alt={s.name}
                        style={{ marginTop: 8, maxWidth: 240, maxHeight: 160, display: "block" }}
                      />
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <a href={s.dataURL} download={s.name} style={{ textDecoration: "none" }}>
                      <button>Download</button>
                    </a>
                    <button onClick={() => removeItem(s.id)}>Remove</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
