import axios from "axios";

const API = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// =========================
// AUTH APIs
// =========================
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);

// =========================
// WEBINAR APIs
// =========================
export const getAllWebinars = () => api.get("/webinars");
export const getWebinarById = (id) => api.get(`/webinars/${id}`);
export const createWebinar = (data) => api.post("/webinars", data);
export const updateWebinar = (id, data) => api.put(`/webinars/${id}`, data);
export const deleteWebinar = (id) => api.delete(`/webinars/${id}`);

// =========================
// USER APIs
// =========================
export const updateUserProfile = (id, userData) =>
  api.put(`/users/${id}`, userData);

export const changePassword = (id, passwordData) =>
  api.put(`/users/${id}/change-password`, passwordData);

// =========================
// REGISTRATION APIs
// =========================
export const registerForWebinar = (userId, webinarId) =>
  api.post(`/registrations/${userId}/${webinarId}`);

export const getUserRegisteredWebinars = (userId) =>
  api.get(`/registrations/user/${userId}`);

export const getRegistrationsByUser = (userId) =>
  api.get(`/registrations/user/${userId}`);

// =========================
// OPTIONAL: export instance
// =========================
export default api;