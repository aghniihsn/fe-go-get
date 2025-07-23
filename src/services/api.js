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


// Create film
export const createFilm = async (data) => {
  return API.post('/films', data);
};

// Get all films
export const getFilms = async () => {
  return API.get('/films');
};

// Create jadwal
export const createJadwal = async (data) => {
  return API.post('/jadwals', data);
};

// Get all jadwals
export const getJadwals = async () => {
  return API.get('/jadwals');
};

// Delete jadwal by id
export const deleteJadwal = async (id) => {
  return API.delete(`/jadwals/${id}`);
};

// Update jadwal by id
export const updateJadwal = async (id, data) => {
  return API.put(`/jadwals/${id}`, data);
};


export default API;
