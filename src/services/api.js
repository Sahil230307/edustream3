// API service for communicating with the backend
const API_BASE_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Generic fetch wrapper
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add token if available
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error: ${endpoint}`, error);
    throw error;
  }
};

// Auth APIs
export const authAPI = {
  signup: (data) => fetchAPI('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => fetchAPI('/auth/profile'),
};

// Webinar APIs
export const webinarAPI = {
  getAll: () => fetchAPI('/webinars'),
  getById: (id) => fetchAPI(`/webinars/${id}`),
  search: (query) => fetchAPI(`/webinars/search?search=${encodeURIComponent(query)}`),
  create: (data) => fetchAPI('/webinars', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/webinars/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/webinars/${id}`, { method: 'DELETE' }),
};

// Registration APIs
export const registrationAPI = {
  register: (webinarId) => fetchAPI('/registrations/register', {
    method: 'POST',
    body: JSON.stringify({ webinarId }),
  }),
  getMyRegistrations: () => fetchAPI('/registrations/my-registrations'),
  unregister: (webinarId) => fetchAPI(`/registrations/unregister/${webinarId}`, { method: 'DELETE' }),
  getWebinarRegistrations: (webinarId) => fetchAPI(`/registrations/webinar/${webinarId}`),

  // Wishlist
  addToWishlist: (webinarId) => fetchAPI('/registrations/wishlist', {
    method: 'POST',
    body: JSON.stringify({ webinarId }),
  }),
  removeFromWishlist: (webinarId) => fetchAPI(`/registrations/wishlist/${webinarId}`, { method: 'DELETE' }),
  getWishlist: () => fetchAPI('/registrations/wishlist/my-wishlist'),
};

// Assignment APIs
export const assignmentAPI = {
  create: (data) => fetchAPI('/assignments', { method: 'POST', body: JSON.stringify(data) }),
  getByWebinar: (webinarId) => fetchAPI(`/assignments/webinar/${webinarId}`),
  update: (id, data) => fetchAPI(`/assignments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/assignments/${id}`, { method: 'DELETE' }),
};

// Submission APIs
export const submissionAPI = {
  submit: (data) => fetchAPI('/submissions/submit', { method: 'POST', body: JSON.stringify(data) }),
  getMySubmissions: () => fetchAPI('/submissions/my-submissions'),
  getByAssignment: (assignmentId) => fetchAPI(`/submissions/assignment/${assignmentId}`),
  grade: (id, data) => fetchAPI(`/submissions/grade/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// Review APIs
export const reviewAPI = {
  add: (data) => fetchAPI('/reviews', { method: 'POST', body: JSON.stringify(data) }),
  getByWebinar: (webinarId) => fetchAPI(`/reviews/webinar/${webinarId}`),
  getRating: (webinarId) => fetchAPI(`/reviews/rating/${webinarId}`),
  update: (id, data) => fetchAPI(`/reviews/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/reviews/${id}`, { method: 'DELETE' }),
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const clearToken = () => localStorage.removeItem('token');
