import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [accessToken, setAccessToken] = useState(null);
    const navigate = useNavigate();

    // Load user on mount
    useEffect(() => {
        const initAuth = async () => {
            try {
                // Try to refresh token on mount
                const response = await authService.refreshToken();
                if (response.accessToken) {
                    setAccessToken(response.accessToken);
                    // Fetch user data
                    const userData = await authService.getMe(response.accessToken);
                    setUser(userData.user);
                }
            } catch (error) {
                // Not logged in, that's okay
                console.log('No active session');
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    // Update axios interceptor when token changes
    useEffect(() => {
        if (accessToken) {
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        } else {
            delete api.defaults.headers.common['Authorization'];
        }
    }, [accessToken]);

    const login = useCallback(async (email, password) => {
        const response = await authService.login(email, password);
        setAccessToken(response.accessToken);
        setUser(response.user);
        return response;
    }, []);

    const register = useCallback(async (username, email, password) => {
        const response = await authService.register(username, email, password);
        setAccessToken(response.accessToken);
        setUser(response.user);
        return response;
    }, []);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setAccessToken(null);
            delete api.defaults.headers.common['Authorization'];
            navigate('/');
        }
    }, [navigate]);

    const refreshAccessToken = useCallback(async () => {
        try {
            const response = await authService.refreshToken();
            setAccessToken(response.accessToken);
            return response.accessToken;
        } catch (error) {
            setUser(null);
            setAccessToken(null);
            throw error;
        }
    }, []);

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        accessToken,
        login,
        register,
        logout,
        refreshAccessToken,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
