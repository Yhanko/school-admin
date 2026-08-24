import axios from 'axios';
import Cookies from 'js-cookie';
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
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if we are not already on the login page
    if (error.response?.status === 401 && window.location.pathname !== "/login") {
      Cookies.remove('yhanko_school_admin_token', { path: '/' });
      Cookies.remove('yhanko_school_admin_user', { path: '/' });
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;