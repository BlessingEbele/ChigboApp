import axios from 'axios';

// Assuming Django is running on localhost:8000
const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.access) {
      config.headers.Authorization = `Bearer ${user.access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = async (username, password) => {
  const response = await api.post('/users/login/', { username, password });
  if (response.data.access) {
    // Save tokens initially so interceptor can use them for profile fetch
    localStorage.setItem('user', JSON.stringify(response.data));
    
    try {
      // Fetch full profile data
      const profile = await api.get('/users/profile/');
      const fullUser = { ...response.data, ...profile.data };
      localStorage.setItem('user', JSON.stringify(fullUser));
      return fullUser;
    } catch (e) {
      console.error("Failed to fetch full profile");
      return response.data;
    }
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const register = (userData) => {
  return api.post('/users/register/', userData);
};

export const synthesizeAudio = async (text, language) => {
  const response = await api.post('/ai/tts/', { text, language }, { responseType: 'blob' });
  return window.URL.createObjectURL(new Blob([response.data], { type: 'audio/mpeg' }));
};

export default api;
