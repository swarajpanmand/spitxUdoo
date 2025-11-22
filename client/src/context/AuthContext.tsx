import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string, role: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for stored auth data on mount
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const getPermissionsForRole = (role: string): string[] => {
        switch (role) {
            case 'admin':
                return [
                    'manage_stock', 'view_reports', 'approve_transfers',
                    'perform_transfers', 'picking', 'shelving', 'counting',
                    'manage_users', 'manage_settings'
                ];
            case 'manager':
                return ['manage_stock', 'view_reports', 'approve_transfers'];
            case 'warehouse':
                return ['perform_transfers', 'picking', 'shelving', 'counting'];
            default:
                return [];
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch('http://localhost:5002/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            const { token, user } = data;

            // Map backend user to frontend user structure with permissions
            const userWithPermissions: User = {
                ...user,
                permissions: getPermissionsForRole(user.role),
                isActive: true
            };

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userWithPermissions));

            setToken(token);
            setUser(userWithPermissions);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const signup = async (name: string, email: string, password: string, role: string) => {
        try {
            const response = await fetch('http://localhost:5002/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Signup failed');
            }

            // Signup usually doesn't auto-login if email verification is required
            // But if the backend returns a token (it currently doesn't for signup), we could login.
            // The current backend signup returns { success: true, message: "..." }
            // So we just return here and let the UI handle the redirect/message.

        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        login,
        signup,
        logout,
        isAuthenticated: !!token && !!user,
        isLoading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
