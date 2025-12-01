import axios from 'axios';

const api = axios.create({
  // Prefer explicit VITE_API_URL for production or ngrok overrides;
  // otherwise use relative `/api` so the dev server can proxy requests to the local backend.
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
