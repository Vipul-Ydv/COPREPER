'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                api.setToken(token);
                const userData = await api.getMe();
                setUser(userData);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            api.logout();
        } finally {
            setLoading(false);
        }
    }

    async function login(email, password) {
        const data = await api.login(email, password);
        setUser(data.user);
        router.push('/dashboard');
        return data;
    }

    async function signup(email, password, displayName) {
        const data = await api.signup(email, password, displayName);
        setUser(data.user);
        router.push('/dashboard');
        return data;
    }

    function logout() {
        api.logout();
        setUser(null);
        router.push('/login');
    }

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
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
