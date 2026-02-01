import React, { useState, useEffect } from 'react';
import authService from '../services/auth';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await authService.getCurrentUser();
                    setUser(userData);
                } catch (error) {
                    localStorage.removeItem('token');
                    console.log(error);
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        const data = await authService.loginRequest(email, password);
        if (data.access_token) {
            localStorage.setItem('token', data.access_token);
            // api.js interceptor will pick this up automatically for next requests
            const userData = await authService.getCurrentUser();
            setUser(userData);
        }
    };

    const register = async (email, password, fullName) => {
        await authService.register(email, password, fullName);
        // Auto login after register
        await login(email, password);
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
