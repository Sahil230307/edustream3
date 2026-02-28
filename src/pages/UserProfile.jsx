import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import "./UserProfile.css";

export default function UserProfile({ user, setUser }) {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "https://via.placeholder.com/150"
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      setToast({ message: "Name and email are required", type: "error" });
      return;
    }

    const updatedUser = { ...user, ...formData };
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map(u => u.email === user.email ? { ...u, ...formData } : u);
    
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setEditMode(false);
    setToast({ message: "Profile updated successfully!", type: "success" });
  };

  const handleChangePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setToast({ message: "All password fields are required", type: "error" });
      return;
    }

    if (passwordData.currentPassword !== user.password) {
      setToast({ message: "Current password is incorrect", type: "error" });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToast({ message: "New passwords do not match", type: "error" });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setToast({ message: "Password must be at least 6 characters", type: "error" });
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map(u => 
      u.email === user.email ? { ...u, password: passwordData.newPassword } : u
    );
    
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    const updatedUser = { ...user, password: passwordData.newPassword };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setToast({ message: "Password changed successfully!", type: "success" });
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={formData.avatar} alt="Profile Avatar" />
        </div>
        <h1>My Profile</h1>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="profile-section">
        <div className="section-header">
          <h2>Personal Information</h2>
          <button 
            className="btn-edit"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Cancel" : "Edit"}
          </button>
        </div>

        {editMode ? (
          <div className="form-group">
            <div className="form-row">
              <div className="form-field">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  disabled
                  style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="form-field">
                <label>Avatar URL</label>
                <input
                  type="url"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleInputChange}
                  placeholder="Enter avatar image URL"
                />
              </div>
            </div>

            <div className="form-field">
              <label>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself"
                rows="4"
              />
            </div>

            <button className="btn-primary" onClick={handleSaveProfile}>
              Save Changes
            </button>
          </div>
        ) : (
          <div className="profile-info">
            <div className="info-row">
              <span className="label">Name:</span>
              <span className="value">{formData.name}</span>
            </div>
            <div className="info-row">
              <span className="label">Email:</span>
              <span className="value">{formData.email}</span>
            </div>
            <div className="info-row">
              <span className="label">Phone:</span>
              <span className="value">{formData.phone || "Not provided"}</span>
            </div>
            <div className="info-row">
              <span className="label">Bio:</span>
              <span className="value">{formData.bio || "No bio added yet"}</span>
            </div>
          </div>
        )}
      </div>

      <div className="profile-section">
        <h2>Change Password</h2>
        <div className="form-group">
          <div className="form-field">
            <label>Current Password</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              placeholder="Enter current password"
            />
          </div>

          <div className="form-field">
            <label>New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              placeholder="Enter new password"
            />
          </div>

          <div className="form-field">
            <label>Confirm Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              placeholder="Confirm new password"
            />
          </div>

          <button className="btn-primary" onClick={handleChangePassword}>
            Update Password
          </button>
        </div>
      </div>

      <div className="profile-section">
        <h2>Account Settings</h2>
        <div className="settings-info">
          <p><strong>Account Status:</strong> Active</p>
          <p><strong>Member Since:</strong> {new Date().toLocaleDateString()}</p>
          <p><strong>Role:</strong> {user?.role === "admin" ? "Administrator" : "User"}</p>
        </div>
      </div>
    </div>
  );
}
