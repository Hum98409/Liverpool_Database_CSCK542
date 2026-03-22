import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types/auth';

type ProtectedRouteProps = {
  // Optional list of roles allowed to access the nested route.
  allowedRoles?: UserRole[];
};

/**
 * Guards routes based on authentication and optional role-based access.
 *
 * Redirects unauthenticated users to the login page, redirects unauthorized
 * users to the home page, and renders nested routes when access is allowed.
 */
export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  // Read the current authenticated user from the auth context.
  const { user } = useAuth();

  // Redirect to login when no authenticated user is available.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to the home page when the user does not have a required role.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Render the matched child route when access checks pass.
  return <Outlet />;
}