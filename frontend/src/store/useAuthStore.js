import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      // Khởi tạo trạng thái mặc định
      user: null,         // Chứa thông tin: username, fullName
      roles: [],          // Danh sách quyền: ['ROLE_ADMIN', ...]
      accessToken: null,  // Chuỗi JWT
      isAuthenticated: false,

      // Hành động đăng nhập thành công
      login: (authData) => {
        set({
          user: {
            username: authData.username,
            fullName: authData.fullName,
          },
          roles: authData.roles || [],
          accessToken: authData.accessToken,
          isAuthenticated: true,
        });
      },

      // Hành động đăng xuất
      logout: () => {
        set({
          user: null,
          roles: [],
          accessToken: null,
          isAuthenticated: false,
        });
        // Có thể thêm logic xóa cache khác ở đây nếu cần
      },
    }),
    {
      name: 'stdmanager-auth', // Tên key lưu trong localStorage của trình duyệt
    }
  )
);

export default useAuthStore;