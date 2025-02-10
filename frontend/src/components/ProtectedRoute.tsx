import React, { ReactNode } from 'react';
    import { Navigate } from 'react-router-dom';
    import { useAuth } from './AuthContext';

    interface ProtectedRouteProps {
        children: ReactNode;
        requireAdmin?: boolean;
    }

    const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
        const { isAuthenticated, isLoading } = useAuth();
        const userRole = localStorage.getItem('role');

        if (isLoading) {
            return <div>Loading...</div>;
        }

        if (!isAuthenticated) {
            return <Navigate to="/login" />;
        }

        if (requireAdmin && userRole !== 'Admin') {
            return <Navigate to="/dashboard" />;
        }

        return <>{children}</>;
    };

    export default ProtectedRoute;