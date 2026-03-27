import axios from "axios";

const API = "http://localhost:8080/api";

// AUTH APIs
export const registerUser = (data) => axios.post(`${API}/auth/register`, data);
export const loginUser = (data) => axios.post(`${API}/auth/login`, data);

// WEBINAR APIs
export const getAllWebinars = () => axios.get(`${API}/webinars`);
export const getWebinarById = (id) => axios.get(`${API}/webinars/${id}`);
export const createWebinar = (data) => axios.post(`${API}/webinars`, data);
export const updateWebinar = (id, data) => axios.put(`${API}/webinars/${id}`, data);
export const deleteWebinar = (id) => axios.delete(`${API}/webinars/${id}`);

// REGISTRATION APIs
export const registerForWebinar = (userId, webinarId) =>
  axios.post(`${API}/registrations/${userId}/${webinarId}`);

export const getUserRegisteredWebinars = (userId) =>
  axios.get(`${API}/registrations/user/${userId}`);