import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:3000/api',
});

// Interceptor untuk menambah header Authorization jika ada token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
