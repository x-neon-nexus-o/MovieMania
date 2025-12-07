import axios from 'axios';

// Create axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    withCredentials: true, // Include cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Token is set directly on api.defaults in AuthContext
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;

        // If token expired and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh token
                const response = await axios.post(
                    `${api.defaults.baseURL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const { accessToken } = response.data.data;

                // Update default header
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                // Retry original request
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, clear auth state
                delete api.defaults.headers.common['Authorization'];

                // Redirect to login if on protected route
                if (window.location.pathname !== '/login' &&
                    window.location.pathname !== '/register' &&
                    window.location.pathname !== '/') {
                    window.location.href = '/login';
                }

                return Promise.reject(refreshError);
            }
        }

        // Extract error message
        const message = error.response?.data?.message || error.message || 'An error occurred';

        return Promise.reject({
            ...error,
            message,
        });
    }
);

export default api;
