import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor gửi Token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor hứng lỗi (Sync với GlobalExceptionHandler của Backend)
axiosInstance.interceptors.response.use(
  (response) => response.data, // Trả về ApiResponse.data ngay lập tức
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    // Trả về message lỗi từ Backend
    const message = error.response?.data?.message || 'Đã có lỗi xảy ra';
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;