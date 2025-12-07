import api from './api';

const authService = {
    /**
     * Register new user
     */
    async register(username, email, password) {
        const response = await api.post('/auth/register', {
            username,
            email,
            password,
        });
        return response.data;
    },

    /**
     * Login user
     */
    async login(email, password) {
        const response = await api.post('/auth/login', {
            email,
            password,
        });
        return response.data;
    },

    /**
     * Refresh access token
     */
    async refreshToken() {
        const response = await api.post('/auth/refresh');
        return response.data;
    },

    /**
     * Logout user
     */
    async logout() {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    /**
     * Get current user profile
     */
    async getMe(token) {
        const response = await api.get('/auth/me', {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        return response.data;
    },

    /**
     * Update user profile
     */
    async updateProfile(data) {
        const response = await api.patch('/auth/me', data);
        return response.data;
    },

    /**
     * Change password
     */
    async changePassword(currentPassword, newPassword) {
        const response = await api.patch('/auth/password', {
            currentPassword,
            newPassword,
        });
        return response.data;
    },
};

export default authService;
