
import axios from 'axios';

const api = axios.create({
  //baseURL: 'http://localhost:3000/api',
  baseURL:'https://skill-bridge-82xz.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sb_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
