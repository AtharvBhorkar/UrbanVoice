import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Har request ke saath automatically token attach karega (agar user login hai)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------- AUTH ----------
export const signup = (data) => api.post('/auth/signup', data);
export const login = (data) => api.post('/auth/login', data);
export const forgotPassword = (data) => api.post('/auth/forgot-password', data);
export const getMe = () => api.get('/auth/me');
export const searchUsers = (query) => api.get('/auth/search', { params: { q: query } });
export const getUserByUsername = (username) => api.get(`/auth/user/${username}`);
export const getFollowersList = (username) => api.get(`/auth/user/${username}/followers`);
export const getFollowingList = (username) => api.get(`/auth/user/${username}/following`);
export const updateProfile = (formData) =>
  api.put('/auth/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// ---------- COMPLAINTS (Posts/Reels) ----------
export const createComplaint = (formData) =>
  api.post('/complaints', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const getComplaints = (type) =>
  api.get('/complaints', { params: type ? { type } : {} });
export const getComplaintById = (id) => api.get(`/complaints/${id}`);
export const getComplaintsByUser = (userId, type) =>
  api.get(`/complaints/user/${userId}`, { params: type ? { type } : {} });
export const toggleLike = (id) => api.put(`/complaints/${id}/like`);
export const toggleSave = (id) => api.put(`/complaints/${id}/save`);

// ---------- ENGAGEMENT (Comments, Views, Shares, Follow) ----------
export const addComment = (id, text) => api.post(`/engagement/${id}/comment`, { text });
export const getComments = (id) => api.get(`/engagement/${id}/comments`);
export const addView = (id) => api.post(`/engagement/${id}/view`);
export const addShare = (id) => api.post(`/engagement/${id}/share`);
export const toggleFollow = (userId) => api.put(`/engagement/follow/${userId}`);
export const getNotifications = () => api.get('/engagement/notifications');
export const markNotificationsRead = () => api.put('/engagement/notifications/read');

// ---------- LEADERBOARD ----------
export const getLeaderboard = () => api.get('/leaderboard');
export const getTop5 = () => api.get('/leaderboard/top5');

// ---------- ADMIN ----------
export const getAllComplaintsAdmin = (params) => api.get('/admin/complaints', { params });
export const updateComplaintStatus = (id, status) =>
  api.put(`/admin/complaints/${id}/status`, { status });
export const getAllUsersAdmin = () => api.get('/admin/users');
export const getAnalytics = () => api.get('/admin/analytics');

// ---------- MESSAGES ----------
export const getConversations = () => api.get('/messages');
export const getConversation = (userId) => api.get(`/messages/${userId}`);
export const sendMessage = (userId, text) => api.post(`/messages/${userId}`, { text });

export default api;