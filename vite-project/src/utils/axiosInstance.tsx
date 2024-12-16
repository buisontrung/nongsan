import axios from 'axios';
import { APIENDPOINT } from './constant';
import { Cookies } from 'react-cookie';

// Khởi tạo Cookies
const cookies = new Cookies();

const axiosInstance = axios.create({
    baseURL: APIENDPOINT,
});

axiosInstance.interceptors.request.use(
    (config) => {
        // Lấy token từ cookie và thêm vào header
        const token = cookies.get('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Lấy refresh token từ cookie
                const refreshToken = cookies.get('refreshToken');
                if (!refreshToken) {
                    console.error('Refresh token is missing.');
                    throw new Error('Unauthenticated');
                }

                // Gọi API làm mới token
                
                const response = await axios.post(`${APIENDPOINT}/Auth/api/Auth/GenerateToken?refreshToken=${refreshToken}`);

                const newToken = response.data.token;

                // Lưu token mới vào cookie
                cookies.set('accessToken', newToken, { path: '/', maxAge: 1800 });

                // Gửi lại request ban đầu với token mới
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosInstance(originalRequest);
            } catch (err) {
                console.error('Token refresh failed', err);
                const refreshToken = cookies.get('refreshToken');
                console.log(refreshToken)
                // Điều hướng người dùng tới trang đăng nhập
                window.location.href = '/login';
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
