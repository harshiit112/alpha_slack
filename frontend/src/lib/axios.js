// frontend/src/lib/axios.js
import axios from 'axios';

// Get base URL and ensure it has the /api suffix if not already present
const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Strip any trailing slash from base URL to prevent double slashes
const BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});