import axios from 'axios';

// Create an instance of Axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api/user/', // Adjust this if your Django server is running on a different port or path
  headers: {
    'Content-Type': 'application/json',
    // Add authorization headers here if needed, e.g., JWT tokens
  },
});

export default api;
