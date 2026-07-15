import { Navigate } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthContext';
import { LoadingScreen } from './LoadingScreen';
import { getDashboardRoute } from '../../constants/roles';

export function ProtectedRoute({
  children,
  allowedRoles = []
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    return (
      <Navigate
        to={getDashboardRoute(user.role)}
        replace
      />
    );
  }

  return children;
}