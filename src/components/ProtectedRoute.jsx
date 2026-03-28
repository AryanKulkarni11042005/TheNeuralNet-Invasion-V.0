import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const { role } = useAuth();
  const location = useLocation();

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children;
}
