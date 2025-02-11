import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: string | null;
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
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('roleName'); // Changed from 'role' to 'roleName'
    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
      // Route to appropriate dashboard on page refresh
      if (window.location.pathname === '/login' || window.location.pathname === '/') {
        navigate(role === 'Admin' ? '/admin-dashboard' : '/dashboard');
      }
    }
    setIsLoading(false);
  }, [navigate]);

  const login = (userData: { roleName: string; token: string }) => {
    console.log('Storing auth data:', userData); // Debug log
    localStorage.setItem('token', userData.token);
    localStorage.setItem('roleName', userData.roleName); // Changed from 'role' to 'roleName'
    setIsAuthenticated(true);
    setUserRole(userData.roleName);
    // Navigate based on role
    navigate(userData.roleName === 'Admin' ? '/admin-dashboard' : '/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('roleName'); // Changed from 'role' to 'roleName'
    setIsAuthenticated(false);
    setUserRole(null);
    navigate('/login');
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const value = useMemo(() => ({
    isAuthenticated,
    isLoading,
    userRole,
    login,
    logout,
    getToken
  }), [isAuthenticated, isLoading, userRole]);

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