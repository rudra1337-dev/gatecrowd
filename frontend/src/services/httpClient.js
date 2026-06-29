import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const serverMessage = error?.response?.data?.message;
    const fallback = status ? `Request failed (${status})` : 'Request failed';
    const wrapped = new Error(serverMessage || error?.message || fallback);
    wrapped.status = status;
    wrapped.data = error?.response?.data;
    throw wrapped;
  }
);
