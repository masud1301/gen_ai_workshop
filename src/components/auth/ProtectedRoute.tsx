import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required and user doesn't have it
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    // Redirect to the dashboard appropriate for their role
    const fallbackRoute =
      currentUser.role === 'admin'
        ? '/admin/dashboard'
        : currentUser.role === 'staff'
        ? '/staff/dashboard'
        : currentUser.role === 'faculty'
        ? '/faculty/dashboard'
        : '/student/dashboard';

    return <Navigate to={fallbackRoute} replace />;
  }

  return <>{children}</>;
};
