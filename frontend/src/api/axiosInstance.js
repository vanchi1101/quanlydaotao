import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

// Cấu hình URL mặc định. Sử dụng biến môi trường của Vite nếu có.
const BASE_URL = 'https://quanlyphanquyen-v1.onrender.com';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm Interceptor cho Request (Trước khi gửi đi)
axiosInstance.interceptors.request.use(
  (config) => {
    // Lấy token trực tiếp từ Zustand Store
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm Interceptor cho Response (Sau khi nhận kết quả từ Server)
axiosInstance.interceptors.response.use(
  (response) => {
    // Backend của chúng ta luôn bọc dữ liệu trong ApiResponse { success, message, data }
    // Nên ta trả về response.data luôn để Component dễ sử dụng
    return response.data;
  },
  (error) => {
    const { response } = error;

    if (response) {
      const status = response.status;

      if (status === 401) {
        // Lỗi 401: Token hết hạn hoặc không hợp lệ -> Xóa state và đẩy về trang đăng nhập
        console.warn('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        useAuthStore.getState().logout();
        window.location.href = '/login';
      } else if (status === 403) {
        // Lỗi 403: Có token nhưng không đủ quyền (Ví dụ: Sinh viên vào trang Admin)
        console.error('Bạn không có quyền truy cập tài nguyên này.');
      }
    } else {
      console.error('Không thể kết nối đến Server.');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;