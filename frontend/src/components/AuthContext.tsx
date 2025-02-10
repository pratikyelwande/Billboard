import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
    import { useNavigate } from 'react-router-dom';

    interface AuthContextType {
        isAuthenticated: boolean;
        isLoading: boolean;
        login: (userData: { roleName: string; token: string }) => void;
        logout: () => void;
        getToken: () => string | null;
    }

    interface AuthProviderProps {
        children: ReactNode;
    }

    const AuthContext = createContext<AuthContextType | undefined>(undefined);

    export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
        const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
        const [isLoading, setIsLoading] = useState<boolean>(true);
        const navigate = useNavigate();

        useEffect(() => {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');
            setIsAuthenticated(!!token);
            setIsLoading(false);
        }, []);

        const login = (userData: { roleName: string; token: string }) => {
            localStorage.setItem('token', userData.token);
            localStorage.setItem('role', userData.roleName);
            setIsAuthenticated(true);
            if (userData.roleName === 'Admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/dashboard');
            }
        };

        const logout = () => {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            setIsAuthenticated(false);
            navigate('/login');
        };

        const getToken = () => {
            return localStorage.getItem('token');
        };

        const value = useMemo(() => ({
            isAuthenticated,
            isLoading,
            login,
            logout,
            getToken
        }), [isAuthenticated, isLoading]);

        return (
            <AuthContext.Provider value={value}>
                {children}
            </AuthContext.Provider>
        );
    };

    export const useAuth = () => {
        const context = useContext(AuthContext);
        if (!context) {
            throw new Error('useAuth must be used within an AuthProvider');
        }
        return context;
    };