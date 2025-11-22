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

    const login = async (email: string, _password: string) => {
        try {
            // TODO: Replace with actual API call
            // const response = await authAPI.login(email, password);

            // Mock login for now
            const mockUser: User = {
                id: '1',
                name: 'Demo User',
                email: email,
                role: 'Inventory Manager',
                permissions: ['manage_stock', 'view_reports', 'approve_transfers'],
                department: 'Inventory Control',
                isActive: true,
            };

            const mockToken = 'mock-jwt-token-' + Date.now();

            localStorage.setItem('token', mockToken);
            localStorage.setItem('user', JSON.stringify(mockUser));

            setToken(mockToken);
            setUser(mockUser);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const signup = async (name: string, email: string, _password: string, role: string) => {
        try {
            // TODO: Replace with actual API call
            // const response = await authAPI.signup({ name, email, password, role });

            // Mock signup for now
            const mockUser: User = {
                id: '1',
                name: name,
                email: email,
                role: role as 'Inventory Manager' | 'Warehouse Staff',
                permissions: role === 'Inventory Manager'
                    ? ['manage_stock', 'view_reports', 'approve_transfers']
                    : ['perform_transfers', 'picking', 'shelving', 'counting'],
                isActive: true,
            };

            const mockToken = 'mock-jwt-token-' + Date.now();

            localStorage.setItem('token', mockToken);
            localStorage.setItem('user', JSON.stringify(mockUser));

            setToken(mockToken);
            setUser(mockUser);
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
