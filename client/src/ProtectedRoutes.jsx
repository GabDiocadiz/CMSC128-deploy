import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useEffect } from 'react';

export const RoleRoute = ({ allowedRoles, children }) => {
    const { user, accessToken, logout } = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (user && !allowedRoles.includes(user.user_type)) {
            console.log('Unauthorized access. Logging out...');
            logout();
        }
    }, [user, allowedRoles, logout, location]);

    if (allowedRoles.includes(user.user_type)) {
        return children || <Outlet />;
    }

    // If not authenticated or role not allowed, navigate to login
    return <Navigate to="/login" state={{ from: location }} replace />;
};