import axios from 'axios';

// Create an instance of Axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api/user/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include the token
api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('access_token'); // Use sessionStorage instead of localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Add token to headers
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;


