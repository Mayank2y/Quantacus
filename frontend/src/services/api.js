import axios from 'axios';

// Set VITE_API_BASE_URL to your deployed backend, for example:
// https://your-backend.onrender.com/api
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

export const uploadVideo = async (file, enhanceTitle) => {
  const formData = new FormData();
  formData.append('video', file);
  formData.append('enhanceTitle', enhanceTitle);
  // Use full API_BASE here too (not hardcoded '/api')
  const response = await axios.post(`${API_BASE}/upload/video`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const uploadCSV = async (file) => {
  const formData = new FormData();
  formData.append('csv', file);
  const response = await axios.post(`${API_BASE}/upload/csv`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const getJobs = async () => {
  const response = await api.get('/jobs');
  return response.data;
};

export const getJobStatus = async (jobId) => {
  const response = await api.get(`/jobs/${jobId}/status`);
  return response.data;
};

export const getProducts = async (filters = {}) => {
  const response = await api.get('/products', { params: filters });
  return response.data;
};

export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const updateProduct = async (id, data) => {
  const response = await api.put(`/products/${id}`, data);
  return response.data;
};

export const enhanceTitle = async (id) => {
  const response = await api.post(`/products/${id}/enhance-title`);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/products/dashboard/stats');
  return response.data;
};

export const getCompetitorPrices = async (productId) => {
  const response = await api.get(`/competitors/products/${productId}/prices`);
  return response.data;
};

export const refreshCompetitorPrices = async (productId) => {
  const response = await api.post(`/competitors/products/${productId}/refresh`);
  return response.data;
};

export const getAlerts = async () => {
  const response = await api.get('/competitors/alerts');
  return response.data;
};

export const resolveAlert = async (alertId) => {
  const response = await api.put(`/competitors/alerts/${alertId}/resolve`);
  return response.data;
};

export default api;
