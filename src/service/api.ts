import axios from 'axios';
import env from "../config/env";
import { useAuth } from '../store/useAuth';

const axiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  maxBodyLength : Infinity,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuth.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;