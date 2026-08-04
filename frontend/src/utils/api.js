import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const studentAPI = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
};

export const screeningAPI = {
  start: (data) => api.post('/screenings/start', data),
  submitAnswer: (data) => api.post('/screenings/answer', data),
  complete: (sessionId) => api.post(`/screenings/complete/${sessionId}`),
};

export const resultsAPI = {
  getBySession: (sessionId) => api.get(`/results/session/${sessionId}`),
  getByStudent: (studentId) => api.get(`/results/student/${studentId}`),
  generate: (data) => api.post('/results/generate', data),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
};

export default api;